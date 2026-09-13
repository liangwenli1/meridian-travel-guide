import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CITY_GALLERY } from "@/data/guides/gallery";
import { t, useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { MediaAsset } from "@/types/guide";

const KIND_KEY: Record<NonNullable<MediaAsset["kind"]>, "photoSight" | "photoEat" | "photoNight" | "photoStreet"> = {
  sight: "photoSight",
  eat: "photoEat",
  night: "photoNight",
  street: "photoStreet",
};

function captionFor(photo: MediaAsset, strings: ReturnType<typeof t>) {
  const kindLabel = photo.kind ? strings[KIND_KEY[photo.kind]] : null;
  return [kindLabel, photo.location].filter(Boolean).join(" · ");
}

export function PhotoStrip({ citySlug }: { citySlug: string }) {
  const photos = CITY_GALLERY[citySlug] ?? [];
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
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
    root.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    setIndex(i);
  };

  if (!photos.length) return null;

  const current = photos[index] ?? photos[0];
  const caption = current ? captionFor(current, strings) : "";
  const multiple = photos.length > 1;

  return (
    <div className="mt-10">
      <div className="flex items-baseline justify-between gap-4">
        <p className="kicker text-muted">{strings.photosKicker}</p>
        {multiple ? (
          <p className="kicker text-muted" aria-live="polite">
            {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </p>
        ) : null}
      </div>

      <div
        className="relative mt-4"
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
          tabIndex={multiple ? 0 : undefined}
          role="region"
          aria-roledescription="carousel"
          aria-label={strings.photosKicker}
        >
          {photos.map((photo, i) => (
            <figure key={photo.url} className="photo-reel-slide">
              <div className="photo-reel-frame bg-card shadow-border">
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
              </div>
            </figure>
          ))}
        </div>

        {multiple ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "absolute top-1/2 left-3 size-11 -translate-y-1/2 p-0",
                index === 0 && "pointer-events-none opacity-30",
              )}
              aria-label={strings.photoPrev}
              disabled={index === 0}
              onClick={() => go(index - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "absolute top-1/2 right-3 size-11 -translate-y-1/2 p-0",
                index === photos.length - 1 && "pointer-events-none opacity-30",
              )}
              aria-label={strings.photoNext}
              disabled={index === photos.length - 1}
              onClick={() => go(index + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </>
        ) : null}
      </div>

      {caption ? (
        <p className="mt-3 text-xs text-muted" aria-live="polite">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
