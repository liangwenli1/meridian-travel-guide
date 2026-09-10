import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "en" | "zh";

type I18nState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useI18n = create<I18nState>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
    }),
    { name: "meridian-locale" },
  ),
);

export const copy = {
  en: {
    where: "Where",
    rest: "do you want to go",
    search: "Search a city or country",
    skip: "Skip to search",
    globe: "Globe",
    noMatch: "No matching city yet.",
    country: "Country",
    comingSoon: "Coming soon",
    guide: "Guide",
    soon: "Soon",
    explore: "Explore",
    webgl: "The live globe needs WebGL. Search above, or open a finished guide.",
    layoutOverlay: "Centered",
    layoutCopyLeft: "Copy left",
    layoutGlobeLeft: "Globe left",
    layoutGroup: "Homepage layout",
  },
  zh: {
    where: "你",
    rest: "想去哪儿",
    search: "搜索城市或国家",
    skip: "跳到搜索",
    globe: "地球",
    noMatch: "还没有匹配的城市。",
    country: "国家",
    comingSoon: "即将推出",
    guide: "指南",
    soon: "稍后",
    explore: "探索",
    webgl: "地球需要 WebGL。请使用搜索，或打开已完成的指南。",
    layoutOverlay: "居中",
    layoutCopyLeft: "文字在左",
    layoutGlobeLeft: "地球在左",
    layoutGroup: "首页布局",
  },
} as const;

export function t(locale: Locale) {
  return copy[locale];
}
