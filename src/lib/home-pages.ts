export const HOME_PAGES = [
  { id: "hero", en: "Globe", zh: "地球" },
  { id: "guides", en: "Cities", zh: "城市" },
  { id: "desk", en: "Desk", zh: "编辑部" },
  { id: "hours", en: "Hours", zh: "时刻" },
  { id: "method", en: "Method", zh: "写法" },
  { id: "letter", en: "Letter", zh: "通讯" },
] as const;

export type HomePageId = (typeof HOME_PAGES)[number]["id"];
