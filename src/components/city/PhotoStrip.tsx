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

  if (!photos.length) return null;

  return (
    <div className="mt-10">
      <p className="kicker text-muted">{strings.photosKicker}</p>
      <div className="photo-strip mt-4" data-count={photos.length}>
        {photos.map((photo) => {
          const kindLabel = photo.kind ? strings[KIND_KEY[photo.kind]] : null;
          const caption = [kindLabel, photo.location].filter(Boolean).join(" · ");
          return (
            <figure key={photo.url} className="min-w-0">
              <div className="photo-strip-frame bg-card shadow-border">
                <img
                  src={photo.url}
                  alt={photo.alt}
                  referrerPolicy="no-referrer"
                  className="content-img size-full object-cover"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.opacity = "0";
                  }}
                />
              </div>
              {caption ? (
                <figcaption className="mt-2 truncate text-xs text-muted">{caption}</figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>
    </div>
  );
}
