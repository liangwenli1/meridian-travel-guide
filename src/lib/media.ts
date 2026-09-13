export type MediaKind = "card" | "gallery" | "hero";

const PRESET: Record<
  MediaKind,
  { widths: number[]; srcIndex: number; sizes: string; quality: number }
> = {
  card: {
    widths: [480, 800, 1200],
    srcIndex: 1,
    sizes: "(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw",
    quality: 68,
  },
  gallery: {
    widths: [640, 960, 1400],
    srcIndex: 1,
    sizes: "(min-width: 768px) 42vw, 100vw",
    quality: 70,
  },
  hero: {
    widths: [800, 1280, 1600, 2000],
    srcIndex: 2,
    sizes: "100vw",
    quality: 74,
  },
};

export function sizedUrl(url: string, width: number, quality = 72): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "images.unsplash.com") {
      parsed.searchParams.set("auto", "format");
      parsed.searchParams.set("fit", "crop");
      parsed.searchParams.set("w", String(width));
      parsed.searchParams.set("q", String(quality));
      return parsed.toString();
    }
    if (parsed.hostname === "images.pexels.com") {
      parsed.searchParams.set("auto", "compress");
      parsed.searchParams.set("cs", "tinysrgb");
      parsed.searchParams.set("w", String(width));
      return parsed.toString();
    }
  } catch {
    return url;
  }
  return url;
}

export function mediaAttrs(url: string, kind: MediaKind) {
  const preset = PRESET[kind];
  return {
    src: sizedUrl(url, preset.widths[preset.srcIndex], preset.quality),
    srcSet: preset.widths
      .map((width) => `${sizedUrl(url, width, preset.quality)} ${width}w`)
      .join(", "),
    sizes: preset.sizes,
  };
}
