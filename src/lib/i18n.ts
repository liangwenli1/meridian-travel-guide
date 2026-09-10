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
    guidesKicker: "Published",
    guidesTitle: "Eight cities, written like you live there.",
    guidesDek: "Not a listicle. Neighborhood grain, late kitchens, and the transit that actually moves you.",
    dispatchKicker: "The desk",
    dispatchTitle: "Notes from the atlas.",
    readingNote: "Letter",
    hoursKicker: "A day",
    hoursTitle: "Write the hour, not the postcard.",
    hoursDek: "Six times of day. If a city fails one of them, we say so in the guide.",
    methodKicker: "How we write",
    methodTitle: "Fewer cities. Sharper pages.",
    methodWalk: {
      title: "Walk first",
      body: "If we cannot cross it on foot, we say so. Distance, shade, and boredom belong in a guide.",
    },
    methodNight: {
      title: "Keep the night",
      body: "The globe is a night map because cities are night machines. We write the 1 a.m. version.",
    },
    methodNoFiller: {
      title: "No filler",
      body: "Every section has to change a booking, a walk, or a meal. If it does not, it does not ship.",
    },
    letterKicker: "Meridian Letter",
    letterTitle: "One city, once a month.",
    letterDek: "A short briefing: where the light is, what to skip, and one table worth walking for. No ads. Unsubscribe anytime.",
    letterPlaceholder: "Email for the letter",
    letterCta: "Subscribe",
    letterThanks: "You're on the letter. We'll write when the next city is ready.",
    letterInvalid: "That email doesn't look right.",
    passTitle: "Field Pass",
    passDek: "Downloadable itineraries, off-season tables, and the unpublished neighborhood notes. Join the letter first — Pass opens from there.",
    passCta: "Join the letter",
    scrollAtlas: "Continue",
    onThisPage: "On this page",
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
    guidesKicker: "已完成",
    guidesTitle: "八座城市，按住在那里的人来写。",
    guidesDek: "不是清单体。街区的纹理、夜里还开的厨房，以及真能把你送走的交通。",
    dispatchKicker: "编辑部",
    dispatchTitle: "来自地图边上的笔记。",
    readingNote: "通讯",
    hoursKicker: "一天",
    hoursTitle: "写那个小时，不写明信片。",
    hoursDek: "一天里的六个时刻。有一个时刻站不住，指南里会直说。",
    methodKicker: "写法",
    methodTitle: "更少的城市，更锋利的页面。",
    methodWalk: {
      title: "先走路",
      body: "走不过去的地方，我们会直说。距离、荫凉和无聊，都该写进指南。",
    },
    methodNight: {
      title: "留下夜晚",
      body: "地球用夜景，是因为城市是夜间机器。我们写凌晨一点的版本。",
    },
    methodNoFiller: {
      title: "不要注水",
      body: "每一节都得改一次预订、一次步行或一顿饭。做不到就不发。",
    },
    letterKicker: "Meridian 通讯",
    letterTitle: "一个月，一座城。",
    letterDek: "一封短通讯：光在哪里、什么可以跳过、哪张桌子值得走过去。没有广告，随时可退。",
    letterPlaceholder: "填写邮箱",
    letterCta: "订阅",
    letterThanks: "已经记下。下一座城市写好时，我们会写信。",
    letterInvalid: "这个邮箱看起来不对。",
    passTitle: "Field Pass",
    passDek: "可下载行程、淡季餐桌，以及还没公开的街区笔记。先加入通讯，Pass 从那里开放。",
    passCta: "先订通讯",
    scrollAtlas: "往下看",
    onThisPage: "本页",
  },
} as const;

export function t(locale: Locale) {
  return copy[locale];
}
