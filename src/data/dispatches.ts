export type Dispatch = {
  slug: string;
  date: string;
  kicker: { en: string; zh: string };
  title: { en: string; zh: string };
  dek: { en: string; zh: string };
};

export const dispatches: Dispatch[] = [
  {
    slug: "after-the-last-train",
    date: "2026-09-04",
    kicker: { en: "Field note", zh: "田野笔记" },
    title: { en: "After the last train", zh: "末班车之后" },
    dek: {
      en: "A city tells the truth between 00:40 and 05:10. We write that hour first, then the museums.",
      zh: "一座城市最诚实的时刻，往往在 00:40 到 05:10。我们先写那几个小时，再写博物馆。",
    },
  },
  {
    slug: "walk-until-the-map-fails",
    date: "2026-08-22",
    kicker: { en: "Method", zh: "方法" },
    title: { en: "Walk until the map fails", zh: "走到地图失灵" },
    dek: {
      en: "Every Meridian guide starts on foot. If a neighborhood cannot be crossed without a taxi, we say so.",
      zh: "每篇指南都从步行开始。如果一个街区离开出租车就过不去，我们会直接写出来。",
    },
  },
  {
    slug: "september-light",
    date: "2026-09-01",
    kicker: { en: "Season", zh: "时节" },
    title: { en: "September light", zh: "九月的光" },
    dek: {
      en: "Shoulder season is not a discount. It is when kitchens, hotels, and sidewalks return to locals.",
      zh: "平季不是打折季。那是厨房、旅馆和人行道重新还给当地人的时候。",
    },
  },
];
