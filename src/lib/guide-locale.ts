import type { CityGuide, Snapshot } from "@/types/guide";
import type { Locale } from "@/lib/i18n";

export function localizeGuide(guide: CityGuide, locale: Locale): CityGuide {
  if (locale !== "zh" || !guide.zh) return guide;
  const zh = guide.zh;
  return {
    ...guide,
    title: zh.title ?? guide.title,
    subtitle: zh.subtitle ?? guide.subtitle,
    seoTitle: zh.seoTitle ?? guide.seoTitle,
    seoDescription: zh.seoDescription ?? guide.seoDescription,
    whyGo: zh.whyGo ?? guide.whyGo,
    whoWillLoveIt: zh.whoWillLoveIt ?? guide.whoWillLoveIt,
    whoMayStruggle: zh.whoMayStruggle ?? guide.whoMayStruggle,
    shortVersion: zh.shortVersion ?? guide.shortVersion,
    realityCheck: zh.realityCheck ?? guide.realityCheck,
    snapshot: { ...guide.snapshot, ...(zh.snapshot as Partial<Snapshot> | undefined) },
  };
}
