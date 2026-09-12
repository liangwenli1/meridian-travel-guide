import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const taipeiGuide = assembleGuide({
  citySlug: "taipei",
  countrySlug: "taiwan",
  title: "Taipei Travel Guide",
  subtitle: "MRT, rain, and a night market as dinner. Stay in Daan or Zhongshan.",
  seoTitle: "Taipei Travel Guide 2026: Neighborhoods, Night Markets, MRT & Itinerary",
  seoDescription:
    "A Taipei guide for people who will ride the MRT, eat one night market as dinner, and treat 101 as optional. EasyCard, Beitou, rain.",
  hero: {
    url: "https://images.unsplash.com/photo-1470004914144-24199811c0c6?auto=format&fit=crop&w=2000&q=80",
    alt: "Taipei street at dusk with a dense night-market crowd under fluorescent lights",
    source: "Unsplash",
    author: "Unsplash",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com",
    location: "Taipei",
  },
  snapshot: {
    country: "Taiwan",
    languages: "Mandarin (Taiwanese Hokkien in older rooms; English on MRT, not at every stall)",
    currency: "New Taiwan dollar (NT$)",
    timezone: "NST (UTC+8) — no daylight saving",
    population: "About 2.5 million in the city; more in New Taipei",
    dailyCost: "NT$2,000–3,200 shoestring · NT$4,500–7,500 comfortable · NT$12,000+ premium",
    bestMonths: "October–December, March–April. May–June is rain. July–September is heat and typhoons.",
    typicalStay: "4 days; Beitou is a half-day, Jiufen only if you start early",
    airports: "Taoyuan (TPE) default; Songshan (TSA) for some regional flights",
    stations: "Taipei Main, Banqiao, Songshan, Ximen, Zhongxiao Fuxing",
    visaSummary: "Many passports: visa-exempt short stay. Confirm BOCA, not a 2022 blog.",
    plugType: "Type A / B",
    voltage: "110V, 60Hz",
    emergency: "110 police · 119 fire/ambulance",
    tipping: "Do not tip. Round nothing. Service is in the bill if it exists.",
    cashVsCard: "Cards in chains and MRT-area rooms. Cash and EasyCard for stalls, taxis, tiny counters.",
    diningHours: "Lunch 11:30–14:00 · dinner from 18:00. Night markets from dusk until late.",
    walkability: "Excellent inside a district. Between districts, take the MRT. Rain makes the umbrella the walk.",
    transitQuality: "MRT is the adult spine. Buses fill gaps. YouBike if you accept rain and scooters.",
    travelStyle: "District-first, tower-optional — punishes a night-market scavenger hunt",
  },
  whyGo:
    "Taipei is a basin city that runs on MRT exits, fluorescent night markets, and rain you should treat as weather, not a cancelled day. The food is real; so is a queue for soup dumplings that were never meant to be a pilgrimage. Stay in Daan or Zhongshan. Book nothing except maybe a Beitou soak. The Taipei you remember is a stall dinner and a dry MRT ride home, not 101 from the ticketed floor.",
  whoWillLoveIt: [
    "People who will load an EasyCard and treat the MRT as the city",
    "Eaters who pick one night market and sit down",
    "Travelers who accept rain as the default, not a crisis",
    "Return visitors happy to spend a day in Daan and skip another tower",
  ],
  whoMayStruggle: [
    "Anyone who needs English at every stall",
    "Visitors who melt when it rains at 14:00 and call the day over",
    "People who need Taipei 101 as the whole skyline",
    "Travelers hoping Shilin at 20:00 feels like a village, not a queue",
  ],
  shortVersion: [
    "Stay in Daan or Zhongshan — not a short-let above Ximending because the map looks central.",
    "EasyCard on MRT, bus, YouBike, convenience stores. Top up once. Stop buying single tickets.",
    "One night market as dinner. Walk it once. Do not collect stalls like stamps.",
    "Taipei 101 is optional. The mall is more useful than the observatory.",
    "Beitou is a half-day soak, not a spa weekend. Xiaolongbao is a snack.",
  ],
  realityCheck: [
    "Shilin, 101, and the dumpling shop with a 40-minute line are crowd-management problems.",
    "Rain is normal. An umbrella is infrastructure. Indoor malls are the backup, not the trip.",
    "Scooters own the corners. Look twice. The danger is turning vehicles, not a general menace.",
    "July–September is heat plus typhoon risk. October and November are the adult months.",
    "A 'private tour' from the night-market mouth is a sales script. The MRT map is enough.",
  ],
  zh: {
    title: "台北旅行指南",
    subtitle: "捷运、雨、夜市当晚饭。住大安或中山。",
    whyGo:
      "台北是一座靠捷运出口、荧光夜市和雨运转的盆地。食物是真的；把小笼包排成朝圣也是真的。住大安或中山。除了北投泡汤，几乎不用订。记住的是一顿摊位晚饭和一趟干的捷运回家，不是 101 售票楼层。",
    shortVersion: [
      "住大安或中山——不要因为地图看着中心就住西门町楼上的短租。",
      "悠游卡刷捷运、公交、YouBike、便利店。充一次。别再买单程票。",
      "一个夜市当晚饭。走一遍。不要像集邮一样收摊。",
      "台北 101 可去可不去。商场比观景台有用。",
      "北投是半天泡汤，不是温泉度假。小笼包是点心。",
    ],
  },
  beforeYouGo: [
    { title: "EasyCard", body: "Buy at the airport MRT or any station. It is the city. Single tickets are a tourist habit." },
    { title: "Rain", body: "Pack a compact umbrella. May–June plum rain and summer storms are not 'unlucky.' They are Taipei." },
    { title: "Beitou", body: "If you soak, go as a half-day. Public pool or a simple room. It is not a Ryokan weekend." },
    { title: "101", body: "Skip the observatory unless you have a clear evening and leftover energy. The city is not the tower." },
  ],
  neighborhoods: [
    nbh("Daan", "A grid with trees, a park, and dinner you can walk to without a night-market scrum.", {
      bestFor: ["First stay"],
      transit: "Daan, Zhongxiao Fuxing, Dongmen",
      combineWith: "Yongkang as a walk, not a hotel base on the dumpling line.",
    }),
    nbh("Zhongshan", "Japanese-era streets, decent rooms, MRT in two directions. Sleep here; eat here after dark.", {
      bestFor: ["Repeat visitors"],
      transit: "Zhongshan, Shuanglian, Minquan West",
      combineWith: "Ningxia market as dinner, not a second district hunt.",
    }),
    nbh("Ximending (visit)", "Youth grid and neon. Visit after 16:00. Sleeping here is a weekend noise problem.", {
      bestFor: ["One evening"],
      noise: "High",
      transit: "Ximen",
      combineWith: "Out before the last MRT if you are not 22.",
    }),
    nbh("Beitou (half-day)", "Sulphur steam and a metro terminus. Soak and leave. Do not make it your hotel unless the soak is the trip.", {
      bestFor: ["One afternoon"],
      transit: "Xinbeitou",
      combineWith: "Hot spring then back to Daan for dinner.",
    }),
  ],
  attractions: [
    att("A night market as dinner", "One. Raohe or Ningxia. Sit. The hunt is not the point.", {
      price: "Cash for stalls",
      reservation: "None",
      location: "Raohe or Ningxia",
      transport: "MRT Songshan or Zhongshan",
    }),
    att("Beitou soak", "The civic bath. Half a day. Public pool is enough.", {
      tier: "extra-time",
      transport: "Xinbeitou",
      duration: "Half day",
    }),
    att("Taipei 101 as optional", "A mall with a tower on it. Ride if the sky is clear. Do not build a day around the ticket.", {
      price: "Observatory ticket or free mall",
      reservation: "None for the mall",
      tier: "niche",
      location: "Xinyi",
    }),
  ],
  thingsToDo: [
    { title: "MRT dinner hop", body: "Pick a district, eat there, ride home. Do not taxi a night market as a checklist.", duration: "Evening", who: "Everyone" },
    { title: "Park walk in rain", body: "Daan Park with an umbrella. The city does not stop.", duration: "1 hour", who: "Walkers" },
  ],
  foodIntro:
    "Taipei eats noodles, stall dinner, and soup dumplings as infrastructure. A beef noodle in a room with Mandarin conversation beats a dumpling theatre with a velvet rope.",
  dishes: [
    dish("Beef noodle soup", "The actual lunch. Broth first. A room with a ticket machine is a good sign.", { when: "Lunch", localName: "牛肉麵" }),
    dish("Night-market dinner", "Oyster omelette, luwei, grilled things. One market. Sit if there is a stool.", { when: "Dinner" }),
    dish("Xiaolongbao", "One basket, from a shop without a pilgrimage line, with vinegar. A snack.", { when: "Anytime", localName: "小籠包" }),
  ],
  venues: [
    venue("A Yongkang or Zhongshan lunch", "If the next table has office badges, stay.", { neighborhood: "Daan / Zhongshan", type: "Noodle shop" }),
  ],
  stayIntro: "A room on an MRT exit you will use after 22:00. Not a 4th-floor walk-up above the Ximen speakers.",
  stayAreas: [
    { name: "Daan", bestFor: ["First stay"], commute: "MRT Daan / Zhongxiao Fuxing", priceHint: "Mid to high", noise: "Low to moderate", safety: "High" },
    { name: "Zhongshan", bestFor: ["Food and rail"], commute: "MRT Zhongshan", priceHint: "Mid", noise: "Moderate", safety: "Fine" },
    { name: "Xinyi", bestFor: ["Towers and malls"], commute: "MRT Taipei 101 / City Hall", priceHint: "High", noise: "Mall evenings", safety: "High" },
  ],
  arrival: [
    { name: "TPE → Airport MRT", time: "35–50 min", cost: "EasyCard or airport MRT ticket", how: "Taoyuan Airport MRT to Taipei Main. Taxi if you have two bags and a late flight into rain.", bestFor: "Almost everyone", watchOut: "Unlicensed touts at arrivals. The MRT is downstairs." },
  ],
  gettingAround: [
    { title: "EasyCard is the city", body: "MRT, bus, YouBike, 7-Eleven. Load it. Stop thinking about fares." },
    { title: "Rain is transit weather", body: "Walk under arcade, ride the MRT, keep going. Do not taxi across town because of a shower." },
  ],
  itineraries: [
    {
      title: "Three days: district, soak, optional tower",
      days: 3,
      pace: "balanced",
      summary: "One night market as dinner, one Beitou half-day, 101 only if the sky is clear. The MRT is not a day.",
      daysPlan: [
        {
          label: "Day 1",
          theme: "Daan without the scrum",
          stops: [
            { time: "Morning", title: "Daan Park to Yongkang", detail: "Coffee. Walk. Dumplings only if the line is short." },
            { time: "Afternoon", title: "One indoor — Chiang Kai-shek Memorial or a bookstore", detail: "Rain is a reason to go inside, not to Uber." },
            { time: "Evening", title: "Ningxia or a Zhongshan dinner", detail: "One market. Then MRT home." },
          ],
          rainPlan: "Memorial, mall, or a long noodle lunch. The market still runs in rain.",
        },
        {
          label: "Day 2",
          theme: "Beitou half-day, then leave",
          stops: [
            { time: "Morning", title: "Xinbeitou soak", detail: "Public pool or a simple room. Out by early afternoon." },
            { time: "Afternoon", title: "Back to the basin", detail: "Rest. Hills and sulphur compound." },
            { time: "Evening", title: "Dinner in Daan", detail: "No second night market as a collection." },
          ],
          rainPlan: "Beitou still works in rain. That is the point of hot water.",
        },
        {
          label: "Day 3",
          theme: "Xinyi optional or a residential grid",
          stops: [
            { time: "Morning", title: "101 mall or skip the tower", detail: "Observatory only if clear. Otherwise a district walk." },
            { time: "Afternoon", title: "Stay with that choice", detail: "Do not add Jiufen as a third thought." },
            { time: "Evening", title: "Last stall dinner near the hotel", detail: "Pack. EasyCard refund if you must." },
          ],
          rainPlan: "Xinyi malls. Jiufen in rain is a wet queue on a slope.",
        },
      ],
    },
  ],
  visa: {
    summary: "Many passports: visa-exempt short stay. Confirm BOCA.",
    details: ["Confirm official sources before you fly. Length and eligible passports change."],
    officialUrl: "https://www.boca.gov.tw/",
  },
  apps: [
    { name: "EasyCard / Taipei Metro", purpose: "Fares and exits", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: false, necessary: "before", note: "Maps.me or Apple Maps for the last soggy block." },
  ],
  culture: [
    { title: "A greeting first", body: "A nod, a please, then the order. English can be the second sentence. Mandarin first is noticed." },
    { title: "The night market is dinner", body: "If you treat it as a scavenger hunt, you will eat badly and walk in a scrum. Pick a stall and stop." },
  ],
  safety: [
    { title: "Scooters and rain", body: "Look twice at corners. Ordinary caution with bags on MRT. The danger is turning traffic and wet tiles, not a general menace." },
  ],
  scams: [
    { name: "Night-market touts", lookFor: "Unsolicited 'tea' or 'private tours' at market mouths", prevent: "A flat no and keep walking", ifItHappens: "Leave. Eat where you intended." },
  ],
  emergency: [{ label: "Emergency", value: "110 police · 119 fire/ambulance" }],
  faq: [
    { q: "Must I go up 101?", a: "No. The mall is useful. The observatory is a clear-evening extra. The city is the districts." },
    { q: "Jiufen in an afternoon?", a: "No. It is an early full day or it is a wet queue. Skip it on a three-day first stay." },
  ],
  sources: [
    { name: "Taipei Metro", url: "https://english.metro.taipei/", usedFor: "Transit" },
    { name: "BOCA", url: "https://www.boca.gov.tw/", usedFor: "Visa" },
  ],
});
