import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const mexicoCityGuide = assembleGuide({
  citySlug: "mexico-city",
  countrySlug: "mexico",
  title: "Mexico City Travel Guide",
  subtitle: "A high-altitude capital of museums, markets, and neighborhoods with very different hours.",
  seoTitle: "Mexico City Travel Guide 2026: Neighborhoods, Food, Metro & Itinerary",
  seoDescription:
    "A CDMX guide for altitude people: one museum, a market lunch, and a neighborhood that is not the Zócalo loop.",
  hero: {
    url: "https://images.unsplash.com/photo-1518659526051-707ba8d1370e?auto=format&fit=crop&w=2000&q=80",
    alt: "Mexico City skyline and Paseo de la Reforma",
    source: "Unsplash",
    author: "Unsplash",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com",
    location: "Mexico City",
  },
  snapshot: {
    country: "Mexico",
    languages: "Spanish (English in Roma/Condesa hotels; not a given at the market)",
    currency: "Mexican peso (MXN)",
    timezone: "CST (UTC−6; confirm current DST rules)",
    population: "About 9.2 million in the city; ~22 million in the metro area",
    dailyCost: "$45–70 USD shoestring · $110–180 comfortable · $300+ premium (pay in pesos)",
    bestMonths: "November–March (drier). May–June is a rain-and-heat test.",
    typicalStay: "5 days; Teotihuacan is an early morning, not a half-thought",
    airports: "Benito Juárez (MEX); AIFA (NLU) for some flights — they are not interchangeable",
    stations: "The Metro as the skeleton; Metrobus on the avenues",
    visaSummary: "Many passports enter visa-free for tourism. Confirm INM, not a forum screenshot. FMM rules change.",
    plugType: "Type A / B",
    voltage: "127V, 60Hz",
    emergency: "911",
    tipping: "10–15% in sit-down rooms is expected. Markets no.",
    cashVsCard: "Cards in Roma/Condesa. Cash at markets, some taxis, small fondas. Use ATMs inside banks.",
    diningHours: "Lunch 14:00–16:00 is the meal · dinner from 19:30, later in Roma",
    walkability: "Excellent inside Roma, Condesa, Centro pockets; the city as a whole is metro + traffic",
    transitQuality: "Metro is cheap, dense, crowded. Uber is the glue. Official taxis at the airport.",
    travelStyle: "Neighborhood-first, museum-optional, food-led — punishes a Zócalo-only loop",
  },
  whyGo:
    "Mexico City is a working megalopolis at 2,200 metres that happens to be famous. The museums are real; so is a 14:00 comida, a market that feeds the block, and a neighborhood that changes character in six blocks. Stay where you can walk to dinner. Book one museum. The city you remember is a table you returned to, not a pyramid you photographed in a scrum.",
  whoWillLoveIt: [
    "Walkers who treat Roma–Condesa as a commute",
    "People who eat standing at a market and call it lunch",
    "Museum-goers who will pick Antropología or Jumex, not both in one morning",
    "Return visitors happy to spend a day in Coyoacán or a market and skip another plaza",
  ],
  whoMayStruggle: [
    "Anyone who ignores altitude — alcohol, noon sun, and a heavy first meal",
    "Visitors who need English at every fonda",
    "People uncomfortable with density, noise, and a sky that is not always blue",
    "Travelers hoping the Zócalo at midday feels like a neighborhood",
  ],
  shortVersion: [
    "Stay in Roma Norte, Condesa, or Juárez — not a hotel on the Zócalo because the map looks central.",
    "Uber from MEX at night. Metro by day. Bank ATMs, not street ones.",
    "Book Antropología or one contemporary museum. Walk a market. Teotihuacan is an early full morning.",
    "Comida at 14:00 is the meal. Tacos are infrastructure. A 22% US tip is not the local default — 10–15% in rooms.",
    "One neighborhood after dark beats a second viewpoint.",
  ],
  realityCheck: [
    "The Zócalo, the balloon sellers, and the Frida queue are crowd-management problems.",
    "Altitude is logistics: water, slower first day, lighter first drinks.",
    "MEX and AIFA are different cities of arrival. Check which one your ticket uses.",
    "Some streets are fine at 15:00 and not a walk at 23:00. Roma is not the whole map.",
    "A 'free walking tour' that ends in a shop is a shop.",
  ],
  zh: {
    title: "墨西哥城旅行指南",
    subtitle: "一座高海拔首都：博物馆、市场，以及作息完全不同的街区。",
    whyGo:
      "墨西哥城是一座海拔 2200 米、碰巧有名的工作巨型都市。博物馆是真的；两点的正餐、喂养街区的市场、六条街气质就变的街区也是真的。住在能走到晚饭的地方。订一座博物馆。记住的是你回去过的桌子，不是人堆里拍的金字塔。",
    shortVersion: [
      "住在 Roma Norte、Condesa 或 Juárez——不要因为地图看着中心就订主广场酒店。",
      "夜里从 MEX 打 Uber。白天坐地铁。银行里的 ATM，不要街上的。",
      "订人类学博物馆或一座当代馆。走一趟市场。特奥蒂瓦坎是一早出发的整个上午。",
      "十四点的 comida 是正餐。塔可是基建。22% 美式小费不是本地默认——坐下来的房间 10–15%。",
      "天黑后的一个街区，胜过第二处观景。",
    ],
  },
  beforeYouGo: [
    { title: "Altitude", body: "2,200 m. Walk slower the first afternoon. Water. Save the mezcal until you have eaten." },
    { title: "Arrival airport", body: "MEX vs AIFA is not a detail. AIFA is a different transfer. Official taxi / Uber, not a lobby broker." },
    { title: "Cash", body: "Bank ATMs. Markets want pesos. Do not treat the city as cashless because Roma is." },
    { title: "Spanish", body: "A greeting and please. English is a bonus, not a civic duty at the fonda." },
  ],
  neighborhoods: [
    nbh("Roma Norte", "Tree streets, a restaurant map that justified the rents, and a Saturday that can feel like a mall. Weekdays are the point.", {
      bestFor: ["First stay", "Evenings"],
      transit: "Insurgentes, a walk, Metrobus",
      combineWith: "A market lunch, not a second plaza.",
    }),
    nbh("Condesa", "Parks, dogs, and a calmer night than Roma's main avenues.", {
      bestFor: ["Quieter nights"],
      transit: "Chilpancingo, Patriotismo, walk",
      combineWith: "Parque México as the living room.",
    }),
    nbh("Juárez / Centro edge", "A hinge between the historic core and the restaurant map. Useful if you will walk to Bellas Artes without sleeping on the Zócalo.", {
      bestFor: ["First-timers who will walk"],
      transit: "Bellas Artes, Hidalgo",
      combineWith: "Centro in the morning, Roma at night.",
    }),
    nbh("Coyoacán (as a day)", "A village south with a Frida queue. Go for the plazas, not the ticket unless you already wanted it.", {
      bestFor: ["A slower day"],
      transit: "Metro Coyoacán / Viveros + walk or Uber",
      combineWith: "One afternoon. Do not 'do south' as a checklist.",
    }),
  ],
  attractions: [
    att("Museo Nacional de Antropología", "The civic interior. One morning. It is not a backdrop for the park.", {
      location: "Chapultepec",
      transport: "Auditorio / Chapultepec + walk",
    }),
    att("A market morning", "La Merced is a city; a neighborhood market is a kitchen. Pick the second unless you want intensity.", {
      price: "Free to enter",
      reservation: "None",
      tier: "essential",
    }),
    att("Teotihuacan", "An early van or Uber. It is a morning, not a selfie stop on the way to lunch.", {
      tier: "extra-time",
      duration: "Half day, early",
    }),
  ],
  thingsToDo: [
    { title: "Comida", body: "14:00, a room with a floor, a set lunch if they still do it.", duration: "1–2 hours", who: "Everyone" },
    { title: "One museum", body: "Antropología or contemporary. Not both before noon.", duration: "2–3 hours", who: "First-timers" },
  ],
  foodIntro:
    "CDMX eats in markets, fondas, and rooms that take dinner seriously after 20:00. Tacos are infrastructure. The tasting-menu boom is real and optional. Follow the lunch crowd that is not holding a camera.",
  dishes: [
    dish("Tacos", "A standing lunch. Judge the stall by the queue of people in work clothes.", { when: "Anytime the comal is hot" }),
    dish("Comida corrida", "A set lunch that still structures the day.", { when: "14:00" }),
    dish("Something from a market", "Fruit, a juice, a stew. Not a food-tour headset.", { when: "Morning" }),
  ],
  venues: [
    venue("A Roma weekday lunch", "If the next table has laptops and receipts, the kitchen is for them too.", { neighborhood: "Roma Norte", type: "Fonda / restaurant" }),
  ],
  stayIntro: "Walkable dinner in Roma/Condesa. Centro is a morning. Polanco is a different budget.",
  stayAreas: [
    { name: "Roma Norte", bestFor: ["First stay"], commute: "Walk / Metrobus", priceHint: "High", noise: "Weekend avenues", safety: "Busy; watch phones" },
    { name: "Condesa", bestFor: ["Parks", "Quieter nights"], commute: "Walk / metro", priceHint: "High", noise: "Low on interior streets", safety: "Fine" },
    { name: "Juárez", bestFor: ["Walking to Centro"], commute: "Metro Bellas Artes", priceHint: "Mid to high", noise: "Avenue traffic", safety: "Ordinary urban" },
  ],
  arrival: [
    { name: "MEX → authorized taxi / Uber", time: "25–60 min depending on traffic and hour", cost: "Fixed-ish authorized taxi; Uber from the designated zone", how: "Do not take a lobby broker. Metro exists but is a bag problem at 22:00.", bestFor: "Almost everyone", watchOut: "AIFA is a different, longer transfer — check the ticket." },
  ],
  gettingAround: [
    { title: "Metro by day, Uber by night", body: "Metro is the civic spine. At 23:00 with a phone in your hand on a quiet street, ride." },
    { title: "Walk the neighborhood", body: "Roma to Condesa is a walk. Roma to Centro is a metro. Do not treat the map's inches as minutes." },
  ],
  itineraries: [
    {
      title: "Three days: museum, market, south",
      days: 3,
      pace: "balanced",
      summary: "One museum, two neighborhoods, altitude respected. No Zócalo loop as a day.",
      daysPlan: [
        {
          label: "Day 1",
          theme: "Arrive and Roma",
          stops: [
            { time: "Morning", title: "Slow", detail: "Water, a short walk, no pyramid." },
            { time: "Afternoon", title: "Comida in Roma", detail: "14:00. The meal." },
            { time: "Evening", title: "Parque México or a nearby table", detail: "Early night. Altitude." },
          ],
          rainPlan: "A long lunch. The park can wait. Rain here is often a hard hour, not a lost day.",
        },
        {
          label: "Day 2",
          theme: "Museum",
          stops: [
            { time: "Morning", title: "Antropología", detail: "Open. One building." },
            { time: "Afternoon", title: "Chapultepec edge or back to Roma", detail: "Do not add Centro in the same heat." },
            { time: "Evening", title: "Dinner in Condesa", detail: "Walkable." },
          ],
          rainPlan: "The museum is the day. A covered market after.",
        },
        {
          label: "Day 3",
          theme: "Market or Coyoacán",
          stops: [
            { time: "Morning", title: "A neighborhood market", detail: "Not a headset tour." },
            { time: "Afternoon", title: "Coyoacán plazas or rest", detail: "Frida only if you booked and care." },
            { time: "Evening", title: "Last dinner in Roma", detail: "Pack. Teotihuacan needs a fourth morning." },
          ],
          rainPlan: "Market under the roof and a long comida.",
        },
      ],
    },
  ],
  visa: {
    summary: "Many passports enter visa-free. Confirm INM. FMM rules change.",
    details: ["An airline email is not the law.", "Check which airport you land at."],
    officialUrl: "https://www.inm.gob.mx/",
  },
  apps: [
    { name: "Uber / Metro CDMX", purpose: "Night rides and the civic spine", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: true, offline: false, necessary: "before", note: "Download offline Spanish. Bank ATM, not street ATM." },
  ],
  culture: [
    { title: "Buenos días", body: "Greet before you order. The English sentence can wait." },
    { title: "Comida is the meal", body: "14:00 is not a late lunch. It is the structure of the day." },
  ],
  safety: [
    { title: "Neighborhood-specific", body: "Roma at 21:00 is not the whole city. Metro with phone in a front pocket. Uber at night. ATMs inside banks." },
  ],
  scams: [
    { name: "Airport lobby broker", lookFor: "Unsolicited taxi help at arrivals", prevent: "Official rank or Uber zone", ifItHappens: "Walk back to the official line" },
  ],
  emergency: [{ label: "Emergency", value: "911" }],
  faq: [
    { q: "Is the metro safe?", a: "By day, with ordinary big-city caution and a front pocket. At night with luggage, ride Uber." },
    { q: "Need Teotihuacan?", a: "Only if you want it. It is an early morning, not a box to tick on a tired third day." },
  ],
  sources: [
    { name: "Metro CDMX", url: "https://www.metro.cdmx.gob.mx/", usedFor: "Transit" },
    { name: "INM", url: "https://www.inm.gob.mx/", usedFor: "Entry" },
  ],
});
