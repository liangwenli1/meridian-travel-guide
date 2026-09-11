import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const kyotoGuide = assembleGuide({
  citySlug: "kyoto",
  countrySlug: "japan",
  title: "Kyoto Travel Guide",
  subtitle: "Temples, wooden streets, and a civic rhythm slower than Tokyo. Stay north or west of the selfie belt.",
  seoTitle: "Kyoto Travel Guide 2026: Neighborhoods, Temples, Transit & Itinerary",
  seoDescription:
    "A Kyoto guide for people who will pick one temple morning, ride the bus, and sleep away from Gion's camera line.",
  hero: {
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2000&q=80",
    alt: "Pagoda and wooden streets in Kyoto",
    source: "Unsplash",
    author: "Su San Lee",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com/photos/Kyoto",
    location: "Kyoto",
  },
  snapshot: {
    country: "Japan",
    languages: "Japanese (English at stations and major temples; not a given in residential west)",
    currency: "Japanese yen (¥)",
    timezone: "JST (UTC+9)",
    population: "About 1.45 million",
    dailyCost: "¥10,000–14,000 shoestring · ¥18,000–28,000 comfortable · ¥45,000+ premium",
    bestMonths: "Late March–April, late October–November. Summer is a heat test.",
    typicalStay: "3–4 days; Nara is a day, not the trip",
    airports: "Kansai (KIX) then HARUKA; Itami (ITM) for some domestic",
    stations: "Kyoto Station, Karasuma line, the bus as the last mile",
    visaSummary: "Japan entry rules. Confirm Immigration, not a 2019 blog.",
    plugType: "Type A / B",
    voltage: "100V, 60Hz in Kansai",
    emergency: "110 police · 119 fire / ambulance",
    tipping: "Do not tip.",
    cashVsCard: "Cards wider than a decade ago. Cash still useful at small temples and counters.",
    diningHours: "Lunch 11:30–14:00 · dinner from 17:30, kitchens close earlier than Tokyo",
    walkability: "Excellent in pockets; buses and hills between them",
    transitQuality: "Buses are the civic spine. Subway is a sketch. IC card everywhere.",
    travelStyle: "Temple-morning, neighborhood-evening — punishes a Gion checklist",
  },
  whyGo:
    "Kyoto is a working city that happens to hold a national memory of wood and gravel. The temples are real; so is a bus that does not come, a lunch that ends at 14:00, and a residential west that goes quiet by 21:00. Stay where you can walk to dinner. Book one temple morning. The city you remember is a street after the schoolkids go home, not a geisha sighting you queued for.",
  whoWillLoveIt: [
    "People who will take a bus and not call it a failure",
    "Walkers who want gravel paths before 9:00",
    "Travelers who will eat lunch as the main meal",
    "Return visitors happy to spend a day in Nishijin and skip another temple stamp",
  ],
  whoMayStruggle: [
    "Anyone who needs Tokyo hours — late kitchens, 24-hour everything",
    "Visitors who wilt at humidity, hills, and a bus map",
    "People who treat every wooden street as a set",
    "Travelers hoping Gion at 17:00 feels like a neighborhood",
  ],
  shortVersion: [
    "Stay in Nishijin, Demachiyanagi, or east of the river away from the Gion camera line — not a hotel facing a famous gate.",
    "IC card. Bus is the last mile. HARUKA from KIX is the adult arrival.",
    "One temple morning (Fushimi is a mountain, not a photo alley). Walk a residential grid in the afternoon.",
    "Lunch is the meal. Dinner is earlier than you think.",
    "Do not chase a geisha. It is a person going to work.",
  ],
  realityCheck: [
    "Fushimi Inari's lower torii, Kiyomizu's approach, and Gion at dusk are crowd-management problems.",
    "Summer is a heat-and-humidity logistics problem. Plan interiors and buses at 14:00.",
    "Many independent shops close one weekday. Confirm hours the night before.",
    "A kimono-rental street is a shop district. Dressing up is optional; blocking the lane is not.",
    "Kyoto Station is a city. Do not sleep in it unless your train forces you.",
  ],
  zh: {
    title: "京都旅行指南",
    subtitle: "寺庙、木构街巷，以及比东京慢的市民节奏。住在自拍带的北边或西边。",
    whyGo:
      "京都是一座碰巧装着木与砂的国家记忆的工作城市。寺庙是真的；不来的公交、两点结束的午餐、九点就安静的西边住宅区也是真的。住在能走到晚饭的地方。订一个寺庙早晨。记住的是放学后的街，不是排队看过的「艺伎」。",
    shortVersion: [
      "住在西阵、出町柳，或离祗园镜头带远一点的河东——不要订名门对面的酒店。",
      "交通卡。公交是最后一公里。从关西机场坐 HARUKA 是成年人的到达。",
      "一个寺庙早晨（伏见是一座山，不是拍照巷）。下午走住宅网格。",
      "午餐是正餐。晚饭比你想的早。",
      "不要追艺伎。那是去上班的人。",
    ],
  },
  beforeYouGo: [
    { title: "IC card", body: "ICOCA / Suica before the first bus. Cash on the fare box is the last century." },
    { title: "Buses", body: "The map is a web. Two stops of walking often beats a 25-minute wait." },
    { title: "Temple hours", body: "Open early. You want gravel before the tour buses. Last entry is earlier than the website's 'close'." },
    { title: "Reservations", body: "Kaiseki and small counters need a name. Convenience food is not a failure on arrival day." },
  ],
  neighborhoods: [
    nbh("Nishijin", "Textile ward west of the palace grid. Low houses, dyeing workshops, early dinners.", {
      bestFor: ["Repeat visitors", "Quiet nights"],
      transit: "Bus; Imadegawa / Kitano",
      combineWith: "A palace-edge walk, not a Gion add-on.",
    }),
    nbh("Demachiyanagi / along the Kamo", "River paths, a station that is a hinge, and dinner that ends on time.", {
      bestFor: ["First stay"],
      transit: "Keihan Demachiyanagi, buses",
      combineWith: "Philosopher's Path only at 7:00, not at 14:00.",
    }),
    nbh("Higashiyama (early only)", "The postcard slope. Sleep elsewhere. Visit at open.", {
      bestFor: ["One morning"],
      noise: "High after 10:00",
      transit: "Keihan; buses to Kiyomizu",
      combineWith: "Out by lunch. Do not stay for the lantern photos.",
    }),
    nbh("Arashiyama (as a half-day)", "Bamboo is a corridor with a queue. The river is the point if you go west of the scrum.", {
      bestFor: ["Extra time"],
      transit: "JR Sagano / Randen",
      combineWith: "Morning only. Skip if your days are three.",
    }),
  ],
  attractions: [
    att("Fushimi Inari", "A mountain shrine. The lower gates are a queue. The point is to climb until the crowd thins.", {
      location: "Fushimi",
      transport: "JR Inari",
      price: "Free",
      reservation: "None",
      bestTime: "Open, or dusk if you can still see the path",
    }),
    att("Daitoku-ji subtemples", "Gravel and rooms that still feel like a compound, not a slope of souvenirs.", {
      location: "North Kyoto",
      transport: "Bus / Kitaoji",
      tier: "essential",
    }),
    att("Kyoto National Museum or a textile workshop", "The civic interior when the hills are full.", {
      tier: "extra-time",
      price: "Ticketed",
    }),
  ],
  thingsToDo: [
    { title: "A river hour", body: "Kamo at 17:50 costs nothing and is not a temple.", duration: "1 hour", who: "Everyone" },
    { title: "One temple, properly", body: "Sit. Do not collect stamps as a sport.", duration: "2–3 hours", who: "First-timers" },
  ],
  foodIntro:
    "Kyoto eats early. Tofu, pickled vegetables, and a bowl that is not a performance. Lunch is the honest meal. Dinner is often over by 21:00 in the west.",
  dishes: [
    dish("Obanzai", "Small plates that taste like a house, not a kaiseki stage.", { when: "Lunch" }),
    dish("A noodle bowl", "Soba or udon as infrastructure between temples.", { when: "Anytime the kitchen is open" }),
    dish("Yudofu", "Tofu in a pot. Judge the room by whether locals are there on a Tuesday.", { when: "Cooler months" }),
  ],
  venues: [
    venue("A Nishijin lunch", "If the next table has shopping bags from a supermarket, stay.", { neighborhood: "Nishijin", type: "Small restaurant" }),
  ],
  stayIntro: "North or west of the camera belt. Kyoto Station is for trains.",
  stayAreas: [
    { name: "Nishijin", bestFor: ["Quiet nights"], commute: "Bus", priceHint: "Mid to high", noise: "Low", safety: "High" },
    { name: "Demachiyanagi", bestFor: ["First stay"], commute: "Keihan + bus", priceHint: "Mid to high", noise: "Low", safety: "High" },
    { name: "Near Karasuma", bestFor: ["Subway people"], commute: "Karasuma line", priceHint: "High", noise: "Moderate", safety: "Fine" },
  ],
  arrival: [
    { name: "KIX → HARUKA", time: "75–90 min to Kyoto Station", cost: "JR ticket / IC where it applies", how: "HARUKA is the adult train. A highway bus is slower in traffic.", bestFor: "Almost everyone", watchOut: "Do not book a 10:00 temple after a dawn landing." },
    { name: "From Tokyo", time: "2h15 by shinkansen", cost: "Hikari / Kodama if Nozomi is not on your pass", how: "Arrive, drop bags, one neighborhood. Not Fushimi the same afternoon.", bestFor: "Domestic arrivals" },
  ],
  gettingAround: [
    { title: "Bus + IC", body: "The civic way. Subway is north–south. Walking connects the last 800 metres." },
    { title: "Do not taxi the postcard", body: "A taxi is for luggage and rain, not for Kiyomizu from the station as a default." },
  ],
  itineraries: [
    {
      title: "Three days: mountain, compound, west",
      days: 3,
      pace: "balanced",
      summary: "One mountain shrine, one quiet compound, one residential west day. Gion is not a day.",
      daysPlan: [
        {
          label: "Day 1",
          theme: "Fushimi as a mountain",
          stops: [
            { time: "Morning", title: "Fushimi Inari", detail: "Climb until the crowd thins. Down before the heat peaks." },
            { time: "Afternoon", title: "East of the river, not the slope", detail: "A bowl, a nap." },
            { time: "Evening", title: "Dinner near the hotel", detail: "Early. Kyoto closes." },
          ],
          rainPlan: "A museum and a covered market. Fushimi paths are clay when wet.",
        },
        {
          label: "Day 2",
          theme: "North compound",
          stops: [
            { time: "Morning", title: "Daitoku-ji subtemples", detail: "Gravel. Sit." },
            { time: "Afternoon", title: "Nishijin walk", detail: "Textile streets, not a shopping list." },
            { time: "Evening", title: "West-side dinner", detail: "21:00 is late here." },
          ],
          rainPlan: "Subtemple interiors and a long lunch.",
        },
        {
          label: "Day 3",
          theme: "River or Arashiyama",
          stops: [
            { time: "Morning", title: "Kamo river or Arashiyama west of the bamboo", detail: "Pick one. Do not collect both." },
            { time: "Afternoon", title: "One more bowl", detail: "Pack." },
            { time: "Evening", title: "Station only if you must", detail: "Otherwise sleep in the neighborhood." },
          ],
          rainPlan: "Skip Arashiyama. The river under an umbrella is still the city.",
        },
      ],
    },
  ],
  visa: {
    summary: "Japan entry rules. Confirm Immigration.",
    details: ["An airline email is not the law."],
    officialUrl: "https://www.moj.go.jp/",
  },
  apps: [
    { name: "Navitime / Google Maps", purpose: "Buses", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: true, necessary: "before", note: "Bus times slip. Build slack." },
  ],
  culture: [
    { title: "Quiet compounds", body: "Voices down. Drones nowhere. The gravel is not a runway." },
    { title: "Early kitchens", body: "Lunch is the meal. Missing it is a planning error, not a vibe." },
  ],
  safety: [
    { title: "Very safe nights", body: "Ordinary caution. The risk is heat, hills, and a bus you missed, not a street at 22:00." },
  ],
  scams: [
    { name: "Kimono-street pressure", lookFor: "Aggressive rental touts on the Higashiyama slope", prevent: "A flat no, keep walking", ifItHappens: "You do not owe a photo" },
  ],
  emergency: [
    { label: "Police", value: "110" },
    { label: "Fire / ambulance", value: "119" },
  ],
  faq: [
    { q: "How many temples?", a: "One proper morning plus whatever you walk past. Collecting ten is a sport, not a trip." },
    { q: "Stay near Gion?", a: "Sleep elsewhere. Visit at open if you must see the slope." },
  ],
  sources: [
    { name: "Kyoto City Official Travel Guide", url: "https://kyoto.travel/", usedFor: "Hours" },
    { name: "JR West HARUKA", url: "https://www.westjr.co.jp/", usedFor: "Airport train" },
  ],
});
