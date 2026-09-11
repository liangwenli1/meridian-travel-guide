import type {
  Attraction,
  CityGuide,
  Dish,
  Itinerary,
  MediaAsset,
  Neighborhood,
  Snapshot,
  Venue,
} from "@/types/guide";

export function nbh(
  name: string,
  vibe: string,
  extra: Partial<Neighborhood> = {},
): Neighborhood {
  return {
    name,
    vibe,
    bestFor: extra.bestFor ?? ["First stay"],
    price: extra.price ?? "Mid",
    noise: extra.noise ?? "Moderate",
    safety: extra.safety ?? "Ordinary city caution",
    transit: extra.transit ?? "Walk or one transit hop",
    stayNights: extra.stayNights ?? "3–4",
    pros: extra.pros ?? ["Walk to dinner"],
    cons: extra.cons ?? ["Not a monument hotel"],
    combineWith: extra.combineWith ?? "Stay after dark in the same neighborhood.",
  };
}

export function att(
  name: string,
  summary: string,
  extra: Partial<Attraction> = {},
): Attraction {
  return {
    name,
    summary,
    whyItMatters: extra.whyItMatters ?? summary,
    whoItSuits: extra.whoItSuits ?? "First-timers who booked",
    duration: extra.duration ?? "2–3 hours",
    price: extra.price ?? "Timed ticket",
    hours: extra.hours ?? "Check the official site the night before",
    reservation: extra.reservation ?? "Book ahead",
    queue: extra.queue ?? "Morning is kinder",
    crowd: extra.crowd ?? "High at midday",
    location: extra.location ?? "",
    transport: extra.transport ?? "",
    bestTime: extra.bestTime ?? "Open, or last entry",
    season: extra.season ?? "Year-round",
    accessibility: extra.accessibility ?? "Assume stairs; check official step-free notes",
    nearby: extra.nearby ?? "",
    tips: extra.tips ?? ["Go early"],
    mistakes: extra.mistakes ?? ["Arriving at noon without a ticket"],
    alternative: extra.alternative ?? "A neighborhood walk",
    worthIt: extra.worthIt ?? "Yes if you booked",
    tier: extra.tier ?? "essential",
  };
}

export function dish(name: string, what: string, extra: Partial<Dish> = {}): Dish {
  return {
    name,
    localName: extra.localName,
    what,
    taste: extra.taste ?? "Savory, specific to the room",
    when: extra.when ?? "Lunch or dinner",
    price: extra.price ?? "Everyday",
    where: extra.where ?? "Neighborhood counters, not only the famous street",
    howToOrder: extra.howToOrder ?? "Point, or learn one sentence",
    note: extra.note,
  };
}

export function venue(name: string, why: string, extra: Partial<Venue> = {}): Venue {
  return {
    name,
    type: extra.type ?? "Restaurant",
    cuisine: extra.cuisine,
    price: extra.price ?? "Mid",
    neighborhood: extra.neighborhood ?? "",
    why,
    who: extra.who ?? "Hungry walkers",
    dishes: extra.dishes,
    reservation: extra.reservation ?? "Walk-in if you are early",
    note: extra.note,
  };
}

type AssembleInput = {
  citySlug: string;
  countrySlug: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  hero: MediaAsset;
  snapshot: Snapshot;
  whyGo: string;
  whoWillLoveIt: string[];
  whoMayStruggle: string[];
  shortVersion: string[];
  realityCheck: string[];
  zh?: CityGuide["zh"];
  beforeYouGo: CityGuide["beforeYouGo"];
  neighborhoods: Neighborhood[];
  attractions: Attraction[];
  thingsToDo: CityGuide["thingsToDo"];
  foodIntro: string;
  dishes: Dish[];
  venues: Venue[];
  stayIntro: string;
  stayAreas: CityGuide["stayAreas"];
  arrival: CityGuide["arrival"];
  gettingAround: CityGuide["gettingAround"];
  itineraries: Itinerary[];
  visa: CityGuide["visa"];
  apps: CityGuide["apps"];
  culture: CityGuide["culture"];
  safety: CityGuide["safety"];
  scams: CityGuide["scams"];
  emergency: CityGuide["emergency"];
  faq: CityGuide["faq"];
  sources: CityGuide["sources"];
  lastUpdated?: string;
};

export function assembleGuide(input: AssembleInput): CityGuide {
  return {
    ...input,
    lastUpdated: input.lastUpdated ?? "September 2026",
    hiddenGems: input.thingsToDo.slice(0, 2).map((item) => ({
      title: item.title,
      body: item.body,
    })),
    localExperiences: input.culture.slice(0, 2),
    everydayLife: input.gettingAround.slice(0, 2),
    foodThemes: [{ title: "How to eat", body: input.foodIntro }],
    shopping: [{ title: "Shop later", body: "Walk first. Buy on the last afternoon if you still want the object." }],
    stayNotes: ["Price the walk home after 23:00, not only the nightly rate."],
    bestAreaFor: input.stayAreas.map((area) => ({
      persona: area.bestFor[0] ?? "Most travelers",
      area: area.name,
      why: area.commute,
    })),
    dayTrips: [],
    seasons: [
      {
        name: "Shoulder",
        forWhom: "Almost everyone",
        pros: "Fewer queues, kitchens still open.",
        cons: "Weather is a coin toss.",
        pack: "A layer you can walk in.",
      },
    ],
    weatherTips: [{ title: "Walk anyway", body: "A short rain is not a reason to take a taxi across town." }],
    festivals: [],
    budget: {
      currency: input.snapshot.currency,
      asOf: "2026",
      bands: [
        {
          name: "Shoestring",
          daily: input.snapshot.dailyCost.split("·")[0]?.trim() ?? "—",
          includes: "Transit, one sit-down, street food.",
        },
        {
          name: "Comfortable",
          daily: input.snapshot.dailyCost,
          includes: "Lodging mid-range, two proper meals, one paid interior.",
        },
      ],
      breakdown: [
        { item: "Lodging", budget: "Hostel / small room", mid: "Hotel you can sleep in", luxury: "A room you will remember" },
        { item: "Food", budget: "Counters and bakeries", mid: "One restaurant a day", luxury: "Reservations as the day" },
      ],
      hidden: ["Airport trains, bottles of water you still buy, a second viewpoint."],
      worthSpending: ["The one interior you booked.", "A neighborhood dinner you will repeat."],
      worthSaving: ["A second viewpoint.", "A hotel next to a monument because the map looks central."],
    },
    timePlanning: [
      { title: "How many days", body: input.snapshot.typicalStay },
      { title: "Arrival day", body: "One neighborhood and a normal meal. Do not book a 10:00 interior after a dawn landing." },
    ],
    connectivity: [{ title: "eSIM first", body: "Install before you land. Cafe Wi-Fi is a backup, not a plan." }],
    payments: [{ title: "Cards", body: input.snapshot.cashVsCard }],
    etiquette: [{ do: "Greet before you ask.", dont: "Film people eating.", why: "You are in their canteen." }],
    taboos: ["Do not treat a working neighborhood as a set."],
    accessibility: [{ title: "Stairs", body: "Assume stairs. Check the one museum you care about for step-free routes." }],
    byTraveler: [
      { persona: "First visit", tips: input.shortVersion.slice(0, 3) },
      { persona: "Return", tips: ["Pick one neighborhood and stay there after dark."] },
    ],
    touristsGetWrong: input.realityCheck.slice(0, 3),
    localModules: input.culture.slice(0, 1),
    phrases: [],
  };
}
