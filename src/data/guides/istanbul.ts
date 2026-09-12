import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const istanbulGuide = assembleGuide({
  citySlug: "istanbul",
  countrySlug: "turkey",
  title: "Istanbul Travel Guide",
  subtitle: "Two continents, a commute by water. Stay where the ferry is useful, not where the minaret is a hotel logo.",
  seoTitle: "Istanbul Travel Guide 2026: Neighborhoods, Ferries, Food & Itinerary",
  seoDescription:
    "An Istanbul guide that treats Sultanahmet as a queue: Kadıköy or Cihangir as a base, the ferry as transit, Istanbulkart as the city.",
  hero: {
    url: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=2000&q=80",
    alt: "Istanbul mosque and waterfront from the Bosphorus",
    source: "Unsplash",
    author: "Unsplash",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com",
    location: "Istanbul",
  },
  snapshot: {
    country: "Turkey",
    languages: "Turkish (English in Sultanahmet and hotels; greet in Turkish first)",
    currency: "Turkish lira (₺)",
    timezone: "TRT (UTC+3)",
    population: "About 16 million in the metro area",
    dailyCost: "₺2,000–3,200 shoestring · ₺4,500–8,000 comfortable · ₺14,000+ premium",
    bestMonths: "April–June, September–October",
    typicalStay: "4 days; a fifth if you treat the Asian side as a stay, not a photo",
    airports: "Istanbul Airport (IST); Sabiha Gökçen (SAW) if you land on the Asian side",
    stations: "Sirkeci, Yenikapı, Kadıköy, Taksim; Marmaray under the strait",
    visaSummary: "e-Visa or visa-free depending on passport. Confirm official sources, not a forum.",
    plugType: "Type F / C",
    voltage: "230V, 50Hz",
    emergency: "112",
    tipping: "Round up. 5–10% in a sit-down if service was real.",
    cashVsCard: "Cards widely. Keep lira for simit, taxis that refuse the machine, and tiny counters.",
    diningHours: "Lunch 12:00–15:00 · dinner from 19:30; meyhane runs later",
    walkability: "Hills, stairs, traffic that does not yield. Ferries beat a taxi across water.",
    transitQuality: "Metro, tram, ferry, Marmaray — if you have an Istanbulkart. Taxis are a negotiation.",
    travelStyle: "Neighborhood-first, ferry-as-transit — punishes a Sultanahmet-as-the-city loop",
  },
  whyGo:
    "Istanbul is two cities stacked on a strait. The skyline is real; so is a Hagia Sophia line that eats a morning, a taxi that takes the long way over a bridge, and a meyhane that still serves the block. Stay in Kadıköy or Cihangir. The Istanbul you remember is a deck on the 08:40 ferry and a table of meze, not a hotel with a minaret in the listing photo.",
  whoWillLoveIt: [
    "People who will treat a ferry as a commute and sit outside anyway",
    "Walkers who can do hills and then stop for tea",
    "Travelers who eat simit standing up and save the table for rakı",
    "Return visitors happy in Moda and uninterested in another Grand Bazaar lap",
  ],
  whoMayStruggle: [
    "Anyone who booked a Sultanahmet terrace because the map looked historic",
    "Visitors who melt in August queues at 14:00",
    "Travelers who need a taxi as the default and then complain about the meter",
    "People hoping the Blue Mosque courtyard at 11:00 feels like a village",
  ],
  shortVersion: [
    "Stay in Kadıköy or Cihangir — not a Sultanahmet short-let because the mosque is in the window.",
    "Istanbulkart on metro, tram, bus, ferry. The boat is transit. Sit on the water side.",
    "Sultanahmet once, early. The second monument is the same queue in different stone.",
    "Simit is breakfast. Meyhane is dinner. A kebab street with photo menus is a different product.",
    "IST is far. Havaist or metro. Do not add a Bosphorus cruise to a tired landing day.",
  ],
  realityCheck: [
    "Sultanahmet, the Grand Bazaar, and the Galata climb at midday are crowd-management problems.",
    "Taxi meters and 'broken' card readers are a known sport. Istanbulkart and walking beat most of it.",
    "Lira inflation is real. Ignore last year's blog prices. Look at the till.",
    "August is heat plus cruise ships. May and September are the adult months.",
    "A 'Bosphorus yacht' at the hotel desk is a sales script. The public ferry already crosses.",
  ],
  zh: {
    title: "伊斯坦布尔旅行指南",
    subtitle: "两块大陆，渡轮是通勤。住在船有用的地方，不要住在宣礼塔当酒店 logo 的地方。",
    whyGo:
      "伊斯坦布尔是叠在海峡上的两座城。天际线是真的；吃掉一上午的圣索菲亚队、绕桥的出租车、还在服务街区的酒馆也是真的。住在 Kadıköy 或 Cihangir。记住的是八点四十渡轮甲板和一桌冷盘，不是窗里有宣礼塔的房源照片。",
    shortVersion: [
      "住在 Kadıköy 或 Cihangir——不要因为清真寺在窗外就订苏丹艾哈迈德短租。",
      "地铁、电车、公交、渡轮用 Istanbulkart。船是交通。坐靠水一侧。",
      "苏丹艾哈迈德去一次，要早。第二座古迹是同一条队换了石头。",
      "simit 是早餐。酒馆是晚饭。带照片菜单的烤肉街是另一种东西。",
      "IST 很远。Havaist 或地铁。不要把博斯普鲁斯游船加在落地那天。",
    ],
  },
  beforeYouGo: [
    { title: "Istanbulkart", body: "Buy at the airport or a machine. Load it. The ferry will not wait for you to figure out tokens." },
    { title: "IST is not close", body: "Forty-plus kilometres. Metro or Havaist. A taxi at 01:00 is a long meter." },
    { title: "Lira and cards", body: "Cards work. Keep cash for simit, some taxis, and the stall that still prefers paper." },
    { title: "Mosque hours", body: "Hagia Sophia is a working mosque. Dress and prayer closures are not a suggestion." },
  ],
  neighborhoods: [
    nbh("Kadıköy / Moda", "The Asian grid that still buys groceries. Ferry in; dinner on the same side.", {
      bestFor: ["First stay"],
      transit: "Ferry from Eminönü / Karaköy, Marmaray, metro",
      combineWith: "Sultanahmet as a morning trip, not a hotel.",
    }),
    nbh("Cihangir", "A slope of cats and tables between Taksim and the water.", {
      bestFor: ["Repeat visitors"],
      transit: "F1 funicular, T1 tram at Karaköy, buses",
      combineWith: "Beyoğlu as a walk, not a rooftop crawl.",
    }),
    nbh("Karaköy / Galata (visit)", "The climb and the tower. Visit. Sleeping here in peak season is a suitcase in a crowd.", {
      bestFor: ["One afternoon"],
      noise: "High",
      transit: "T1, ferry, Tünel",
      combineWith: "Out before the sunset-terrace groups thicken.",
    }),
    nbh("Sultanahmet (visit, early)", "The postcard cluster. A queue with minarets. Sleeping here is a tourist-price problem.", {
      bestFor: ["One morning"],
      noise: "High",
      transit: "T1 tram, Gülhane",
      combineWith: "In at opening. Out before the cruise buses.",
    }),
  ],
  attractions: [
    att("A ferry as transit", "Kadıköy–Eminönü or Karaköy. The water is the ticket. Sit outside.", {
      price: "Istanbulkart fare",
      reservation: "None",
      location: "The deck, not a yacht brochure",
      transport: "Public ferry",
    }),
    att("Hagia Sophia, early", "The civic interior. A working mosque. Go at opening or skip the midday scrum.", {
      location: "Sultanahmet",
      transport: "T1 tram",
    }),
    att("A mosque that is not the Blue Mosque queue", "Süleymaniye or a neighborhood mosque at prayer-adjacent quiet.", {
      price: "Free",
      reservation: "None",
      tier: "extra-time",
      location: "Süleymaniye or your own hill",
    }),
  ],
  thingsToDo: [
    { title: "Tea and a view you did not pay extra for", body: "Çay on a ferry or a Moda wall. The rooftop with a cover charge is optional.", duration: "1 hour", who: "Everyone" },
    { title: "Meyhane after dark", body: "Meze, rakı, a room that is not performing for a cruise group.", duration: "Evening", who: "Eaters" },
  ],
  foodIntro:
    "Istanbul eats bread, grilled fish, meze, and street sesame as infrastructure. A kahvaltı in Kadıköy with too many small plates beats a terrace kebab whose menu is a photograph of itself.",
  dishes: [
    dish("Simit", "Sesame ring, still warm, with tea standing up. Breakfast infrastructure.", { when: "Morning" }),
    dish("Meze and rakı", "The meyhane table. Order small, stay long, do not rush the fish.", { when: "Dinner" }),
    dish("Balık ekmek", "Fish in bread at the water if the grill is real, not a costume.", { when: "Lunch" }),
  ],
  venues: [
    venue("A Kadıköy meyhane", "If the next table is speaking Turkish and not filming the plate, stay.", { neighborhood: "Kadıköy", type: "Meyhane" }),
  ],
  stayIntro: "A ferry or a tram and an elevator. Not a Sultanahmet fourth floor with a 23kg bag and a call to prayer as a selling point.",
  stayAreas: [
    { name: "Kadıköy", bestFor: ["First stay"], commute: "Ferry / Marmaray", priceHint: "Mid", noise: "Moderate", safety: "Fine" },
    { name: "Cihangir", bestFor: ["Walkers"], commute: "Walk / funicular", priceHint: "Mid to high", noise: "Evenings", safety: "Watch bags" },
    { name: "Galata edge", bestFor: ["Short stays"], commute: "Tram / walk", priceHint: "High", noise: "High on weekends", safety: "Watch bags" },
  ],
  arrival: [
    { name: "IST → metro / Havaist", time: "60–90 min", cost: "Metro on Istanbulkart, or the airport bus", how: "M11 then a transfer, or Havaist to Taksim / Kadıköy. Official taxi if you have two bags and a hill at midnight.", bestFor: "Almost everyone", watchOut: "Unlicensed rides at arrivals. IST is not a 25-minute hop." },
  ],
  gettingAround: [
    { title: "Istanbulkart is the city", body: "Metro, tram, bus, ferry, Marmaray. Load more than you think. The reader is faster than a ticket window." },
    { title: "Ferry beats the bridge", body: "Crossing by taxi is a traffic lesson. Crossing by boat is the point." },
  ],
  itineraries: [
    {
      title: "Three days: water, queue, Asian grid",
      days: 3,
      pace: "balanced",
      summary: "One ferry as a commute, one early Sultanahmet, one residential table. The cruise is not a day.",
      daysPlan: [
        {
          label: "Day 1",
          theme: "Land, then the Asian side",
          stops: [
            { time: "Morning", title: "Arrive and dump the bag in Kadıköy or Cihangir", detail: "Do not start in Sultanahmet with luggage." },
            { time: "Afternoon", title: "Ferry as a first ride", detail: "Sit outside. Çay if they are selling it." },
            { time: "Evening", title: "Dinner on the side you are sleeping", detail: "Walk home." },
          ],
          rainPlan: "The ferry still runs. Add a covered çarşı, not a cruise.",
        },
        {
          label: "Day 2",
          theme: "Sultanahmet early, then leave",
          stops: [
            { time: "Morning", title: "Hagia Sophia at opening", detail: "Out before the buses. One interior, not three." },
            { time: "Afternoon", title: "Süleymaniye or a rest", detail: "The historic peninsula compounds." },
            { time: "Evening", title: "Meyhane in Beyoğlu or Kadıköy", detail: "No photo-menu kebab theatre." },
          ],
          rainPlan: "Cistern or a long breakfast. The courtyard can wait.",
        },
        {
          label: "Day 3",
          theme: "Moda, or a further ferry",
          stops: [
            { time: "Morning", title: "Kadıköy market or an early island ferry", detail: "Pick one. The islands are a full day." },
            { time: "Afternoon", title: "Stay with that choice", detail: "Do not add the Grand Bazaar as a third thought." },
            { time: "Evening", title: "Last dinner near the hotel", detail: "Pack." },
          ],
          rainPlan: "Kadıköy under awnings. The islands are wind and wet if you already committed.",
        },
      ],
    },
  ],
  visa: {
    summary: "e-Visa or visa-free depending on passport.",
    details: ["Confirm official sources."],
    officialUrl: "https://www.mfa.gov.tr/",
  },
  apps: [
    { name: "BiTaksi / Citymapper / Moovit", purpose: "Ferries, metro, and the last hill", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: false, necessary: "before", note: "Istanbulkart is physical or in-app. Test it before the first ferry." },
  ],
  culture: [
    { title: "Merhaba", body: "Greet before you order. English can be the second sentence." },
    { title: "The ferry is not a cruise", body: "If you treat it as a commute you get the city. If you buy a yacht hour you get a microphone." },
  ],
  safety: [
    { title: "Hills, bags, taxis", body: "Pickpockets on trams and in bazaars. Ordinary caution after dark in Taksim. The danger is theft and a creative meter, not a general menace." },
  ],
  scams: [
    { name: "Shoe-shine and 'broken' meters", lookFor: "Dropped brushes, taxis that refuse the machine or the short road", prevent: "Istanbulkart, BiTaksi, a flat no", ifItHappens: "Get out; pay only what the app or meter shows" },
  ],
  emergency: [{ label: "Emergency", value: "112" }],
  faq: [
    { q: "Must I stay in Sultanahmet?", a: "No. Visit early. Sleep in Kadıköy or Cihangir. The mosque is still there in the morning." },
    { q: "Bosphorus cruise?", a: "No. Take a public ferry. The private boat is a floating queue with tea at a markup." },
  ],
  sources: [
    { name: "Istanbulkart", url: "https://www.istanbulkart.istanbul/", usedFor: "Transit" },
    { name: "Istanbul Airport", url: "https://www.istairport.com/", usedFor: "Arrival" },
  ],
});
