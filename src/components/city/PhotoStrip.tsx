import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { CITY_GALLERY } from "@/data/guides/gallery";
import { ATTRACTION_PHOTOS, DISH_PHOTOS } from "@/data/guides/place-photos";
import { t, useI18n } from "@/lib/i18n";
import type { GuideSectionId } from "@/lib/guide-nav";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { MediaAsset } from "@/types/guide";

const KIND_KEY: Record<NonNullable<MediaAsset["kind"]>, "photoSight" | "photoEat" | "photoNight" | "photoStreet" | "photoNature"> = {
  sight: "photoSight",
  eat: "photoEat",
  night: "photoNight",
  street: "photoStreet",
  nature: "photoNature",
};

const KIND_SECTION: Record<NonNullable<MediaAsset["kind"]>, GuideSectionId> = {
  sight: "things-to-do",
  eat: "food",
  night: "overview",
  street: "neighborhoods",
  nature: "things-to-do",
};

function captionFor(photo: MediaAsset, strings: ReturnType<typeof t>) {
  if (photo.caption) return photo.caption;
  const kindLabel = photo.kind ? strings[KIND_KEY[photo.kind]] : null;
  const place = photo.location;
  if (kindLabel && place) return `${kindLabel} · ${place}`;
  return [kindLabel, place, photo.alt].filter(Boolean)[0] ?? "";
}

function orientationPhotos(citySlug: string): MediaAsset[] {
  const seen = new Set<string>();
  const out: MediaAsset[] = [];
  const push = (photo: MediaAsset | undefined) => {
    if (!photo?.url || seen.has(photo.url)) return;
    seen.add(photo.url);
    out.push(photo);
  };
  for (const photo of CITY_GALLERY[citySlug] ?? []) push(photo);
  const attractions = ATTRACTION_PHOTOS[citySlug] ?? {};
  for (const photo of Object.values(attractions)) push(photo);
  const dishes = DISH_PHOTOS[citySlug] ?? {};
  for (const photo of Object.values(dishes)) push(photo);
  return out.slice(0, 12);
}

export function PhotoStrip({ citySlug }: { citySlug: string }) {
  const photos = useMemo(() => orientationPhotos(citySlug), [citySlug]);
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const navigate = useNavigate({ from: "/$country/$city" });
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    scrollerRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [citySlug]);

  const syncIndex = useCallback(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const slides = [...root.children] as HTMLElement[];
    if (!slides.length) return;
    const mid = root.scrollLeft + root.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((slide, i) => {
      const center = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(center - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setIndex(best);
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    root.addEventListener("scroll", syncIndex, { passive: true });
    return () => root.removeEventListener("scroll", syncIndex);
  }, [syncIndex, photos.length]);

  const go = (next: number) => {
    const root = scrollerRef.current;
    if (!root) return;
    const i = Math.max(0, Math.min(photos.length - 1, next));
    const slide = root.children[i] as HTMLElement | undefined;
    if (!slide) return;
    const max = Math.max(0, root.scrollWidth - root.clientWidth);
    const left = i === photos.length - 1 ? max : slide.offsetLeft;
    root.scrollTo({ left, behavior: "smooth" });
    setIndex(i);
  };

  const openPhoto = (photo: MediaAsset) => {
    const section = (photo.section as GuideSectionId | undefined) ?? (photo.kind ? KIND_SECTION[photo.kind] : undefined);
    if (!section || section === "overview") {
      document.getElementById("guide-nav")?.scrollIntoView({ behavior: "instant", block: "start" });
      return;
    }
    void navigate({ search: { s: section }, replace: true, resetScroll: false }).then(() => {
      document.getElementById("guide-nav")?.scrollIntoView({ behavior: "instant", block: "start" });
    });
  };

  if (!photos.length) return null;

  const current = photos[index] ?? photos[0];
  const caption = current ? captionFor(current, strings) : "";
  const multiple = photos.length > 1;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between gap-4">
        <p className="kicker text-muted">{strings.photosKicker}</p>
        {multiple ? (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn("size-9 p-0", index === 0 && "pointer-events-none opacity-30")}
              aria-label={strings.photoPrev}
              disabled={index === 0}
              onClick={() => go(index - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <p className="kicker min-w-16 text-center text-muted" aria-live="polite">
              {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "size-9 p-0",
                index === photos.length - 1 && "pointer-events-none opacity-30",
              )}
              aria-label={strings.photoNext}
              disabled={index === photos.length - 1}
              onClick={() => go(index + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        ) : null}
      </div>

      <div
        className="mt-4"
        onKeyDown={(event) => {
          if (!multiple) return;
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            go(index - 1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            go(index + 1);
          }
        }}
      >
        <div
          ref={scrollerRef}
          className="photo-reel"
          data-single={multiple ? undefined : ""}
          tabIndex={multiple ? 0 : undefined}
          role="region"
          aria-roledescription="carousel"
          aria-label={strings.photosKicker}
        >
          {photos.map((photo, i) => (
            <figure key={photo.url} className="photo-reel-slide">
              <button
                type="button"
                className="photo-reel-frame bg-card shadow-border block w-full cursor-pointer border-0 p-0 text-left"
                onClick={() => openPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  referrerPolicy="no-referrer"
                  className="content-img size-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                  onError={(event) => {
                    event.currentTarget.style.opacity = "0";
                  }}
                />
              </button>
            </figure>
          ))}
        </div>
      </div>

      {caption ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted" aria-live="polite">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
