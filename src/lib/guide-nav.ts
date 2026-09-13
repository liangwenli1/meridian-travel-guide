export const GUIDE_NAV_PRIMARY = [
  { id: "overview", labelKey: "navOverview" },
  { id: "neighborhoods", labelKey: "navAreas" },
  { id: "food", labelKey: "navEat" },
  { id: "stay", labelKey: "navStay" },
  { id: "transport", labelKey: "navMove" },
  { id: "itinerary", labelKey: "navPlan" },
] as const;

export const GUIDE_NAV_MORE = [
  { id: "things-to-do", labelKey: "navSee" },
  { id: "money", labelKey: "navMoney" },
  { id: "connectivity", labelKey: "navConnect" },
  { id: "apps", labelKey: "navApps" },
  { id: "culture", labelKey: "navCulture" },
  { id: "safety", labelKey: "navSafety" },
  { id: "faq", labelKey: "navFaq" },
] as const;

export const GUIDE_NAV = [...GUIDE_NAV_PRIMARY, ...GUIDE_NAV_MORE] as const;

export type GuideSectionId = (typeof GUIDE_NAV)[number]["id"];
