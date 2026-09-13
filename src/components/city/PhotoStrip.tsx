import { useEffect, useRef } from "react";
import { CITY_GALLERY } from "@/data/guides/gallery";
import { t, useI18n } from "@/lib/i18n";
import type { MediaAsset } from "@/types/guide";

const KIND_KEY: Record<NonNullable<MediaAsset["kind"]>, "photoSight" | "photoEat" | "photoNight" | "photoStreet"> = {
  sight: "photoSight",
  eat: "photoEat",
  night: "photoNight",
  street: "photoStreet",
};

export function PhotoStrip({ citySlug }: { citySlug: string }) {
  const photos = CITY_GALLERY[citySlug] ?? [];
  const locale = useI18n((s) => s.locale);
  const strings = t(locale);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const images = [...root.querySelectorAll("img")];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
        });
      },
      { threshold: 0.2 },
    );
    images.forEach((image) => observer.observe(image));
    return () => observer.disconnect();
  }, [citySlug]);

  if (!photos.length) return null;

  return (
    <div className="mt-10">
      <p className="kicker text-muted">{strings.photosKicker}</p>
      <div ref={rootRef} className="photo-bento mt-4">
        {photos.map((photo) => {
          const kindLabel = photo.kind ? strings[KIND_KEY[photo.kind]] : null;
          const caption = [kindLabel, photo.location].filter(Boolean).join(" · ");
          return (
            <figure key={photo.url} className="relative min-h-48 overflow-hidden rounded-xl bg-card shadow-border">
              <img
                src={photo.url}
                alt={photo.alt}
                referrerPolicy="no-referrer"
                className="content-img reveal-clip absolute inset-0 size-full object-cover"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.opacity = "0";
                }}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-void/80 px-3 py-2 text-xs text-silver">
                {caption}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
