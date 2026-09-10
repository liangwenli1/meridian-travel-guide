import { CITY_GALLERY } from "@/data/guides/gallery";

export function PhotoStrip({ citySlug }: { citySlug: string }) {
  const photos = CITY_GALLERY[citySlug] ?? [];
  if (!photos.length) return null;
  return (
    <div className="photo-bento mt-10">
      {photos.map((photo) => (
        <figure key={photo.url} className="relative min-h-48 overflow-hidden rounded-xl bg-card shadow-border">
          <img
            src={photo.url}
            alt={photo.alt}
            className="content-img absolute inset-0 size-full object-cover"
            loading="lazy"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-void/70 px-3 py-2 text-xs text-silver backdrop-blur-sm">
            {photo.location} · {photo.author}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
