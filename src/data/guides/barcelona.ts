import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const barcelonaGuide = assembleGuide({
  citySlug: "barcelona",
  countrySlug: "spain",
  title: "Barcelona Travel Guide",
  subtitle: "Sea, a grid, and a city negotiating how many visitors a block can hold. Stay off the Rambla.",
  seoTitle: "Barcelona Travel Guide 2026: Neighborhoods, Food, Metro & Itinerary",
  seoDescription:
    "A Barcelona guide for grid walkers: one Gaudí, a market lunch, and a neighborhood that is not the Rambla.",
  hero: {
    url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=2000&q=80",
    alt: "Barcelona street with the Sagrada Família in the distance",
    source: "Unsplash",
    author: "Unsplash",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com",
    location: "Eixample, Barcelona",
  },
  snapshot: {
    country: "Spain",
    languages: "Catalan and Spanish (English in hotels and major interiors; greet in Catalan or Spanish first)",
    currency: "Euro (€)",
    timezone: "CET/CEST",
    population: "About 1.6 million in the city",
    dailyCost: "€70–95 shoestring · €140–220 comfortable · €350+ premium",
    bestMonths: "May–June, September–early October",
    typicalStay: "4 days; a beach day is extra, not the trip",
    airports: "El Prat (BCN)",
    stations: "Sants, Passeig de Gràcia, the metro as the skeleton",
    visaSummary: "Schengen / ETIAS when applicable.",
    plugType: "Type F / C",
    voltage: "230V, 50Hz",
    emergency: "112",
    tipping: "Round up or leave small change. Not 20%.",
    cashVsCard: "Cards widely. Some tiny bars still prefer cash.",
    diningHours: "Lunch 13:30–15:30 · dinner from 20:30",
    walkability: "Excellent on the grid; Rambla is a corridor, not a walk",
    transitQuality: "Metro is dense and the right tool. Hola Barcelona cards are optional math.",
    travelStyle: "Neighborhood-first, one Gaudí — punishes a Gaudi-passport loop",
  },
  whyGo:
    "Barcelona is a port city on a grid that is still arguing with tourism. The sea is real; so is a 14:00 lunch, a metro that works, and a block in Gràcia that does not want your suitcase on the pavement. Stay off the Rambla. Book one interior. The city you remember is a table after 21:00, not a balcony you queued for.",
  whoWillLoveIt: [
    "Walkers who treat the Eixample as a commute",
    "People who will eat lunch at 14:00 and dinner at 21:30",
    "Travelers who pick one Gaudí and walk the rest",
    "Return visitors happy to spend a day in Poble-sec and skip another interior",
  ],
  whoMayStruggle: [
    "Anyone who needs empty sidewalks in August",
    "Visitors who want dinner at 18:00",
    "People who treat every balcony as public content",
    "Travelers hoping the Rambla feels like a neighborhood",
  ],
  shortVersion: [
    "Stay in Gràcia, Eixample left of Passeig de Gràcia, or Poble-sec — not a hotel on the Rambla because the map looks central.",
    "T-casual or contactless on metro. Airport train or metro from T2/T1 is enough.",
    "Book Sagrada Família or Park Güell, not both in one morning. Walk the grid.",
    "Lunch is the meal. A market is a kitchen, not a set — go where the offices go.",
    "One neighborhood after 21:00 beats a second viewpoint.",
  ],
  realityCheck: [
    "The Rambla, the Sagrada scaffolding scrum, and the beach at Barceloneta at 16:00 are crowd-management problems.",
    "Pickpockets work metro Line 3, the Rambla, and any queue that photographs well. Front pockets.",
    "August is heat plus closures. September is the adult month.",
    "A man with a 'skip the line' lanyard on Carrer de Marina is not the basilica.",
    "Some residents are done with visitor volume. Be a guest on the pavement, not a set dresser.",
  ],
  zh: {
    title: "巴塞罗那旅行指南",
    subtitle: "海、网格，以及一座还在谈街区能接待多少访客的城市。不要住在兰布拉。",
    whyGo:
      "巴塞罗那是一座仍在和旅游谈判的港口网格。海是真的；两点的午餐、能用的地铁、格拉西亚一条不想看到你行李箱的街区也是真的。不要住兰布拉。订一处内部。记住的是九点后的桌子，不是排队上过的阳台。",
    shortVersion: [
      "住在格拉西亚、passeig 左侧的扩展区，或 Poble-sec——不要因为地图看着中心就订兰布拉酒店。",
      "地铁 T-casual 或轻触。机场火车或地铁够了。",
      "圣家堂或桂尔公园订一个，不要一个早晨两个。网格走路。",
      "午餐是正餐。市场是厨房不是布景——去上班族去的地方。",
      "九点后的一个街区，胜过第二处观景。",
    ],
  },
  beforeYouGo: [
    { title: "Tickets", body: "Sagrada Família and Park Güell are official-site problems. Screenshot the QR." },
    { title: "Greetings", body: "Bon dia / hola before English. Catalan is not a costume." },
    { title: "Dinner hour", body: "21:00 is normal. 18:00 is a tourist kitchen." },
    { title: "Theft", body: "Phone in front pocket on the metro. Bags on laps in cafes." },
  ],
  neighborhoods: [
    nbh("Gràcia", "A village grid that still has plazas used by the same people tomorrow.", {
      bestFor: ["First stay", "Evenings"],
      transit: "Diagonal, Fontana, Joanic",
      combineWith: "Park Güell only if booked, then leave the hill.",
    }),
    nbh("Eixample (left of Passeig)", "The grid as a living room. Modernisme as buildings you walk past, not a hunt.", {
      bestFor: ["First-timers"],
      transit: "Provença, Hospital Clínic, Passeig de Gràcia",
      combineWith: "One interior, then a lunch that is not on the Rambla.",
    }),
    nbh("Poble-sec / Sant Antoni", "A slope of kitchens and a market that still feeds the block.", {
      bestFor: ["Food"],
      transit: "Poble Sec, Sant Antoni, Paral·lel",
      combineWith: "Montjuïc as a hill, not a checklist of pavilions.",
    }),
    nbh("El Born (edge)", "Pretty stone, heavy visitor hours. Sleep on a back street or sleep elsewhere.", {
      bestFor: ["One evening"],
      noise: "High",
      transit: "Jaume I, Arc de Triomf",
      combineWith: "Picasso only if you care. The beach is a different city at 11:00.",
    }),
  ],
  attractions: [
    att("Sagrada Família", "A working interior. Book it. It is not a facade you photograph from the pavement as the whole trip.", {
      location: "Eixample",
      transport: "Sagrada Família (L2/L5)",
    }),
    att("Gràcia plazas", "The civic argument: a square with the same people at 19:00.", {
      price: "Free",
      reservation: "None",
      tier: "essential",
    }),
    att("Park Güell", "A garden with a timed ticket. Only if you already wanted a hill.", {
      tier: "extra-time",
      reservation: "Timed ticket for the monumental zone",
    }),
  ],
  thingsToDo: [
    { title: "A grid hour", body: "Walk Eixample without a destination. This is the city.", duration: "1–2 hours", who: "Everyone" },
    { title: "One Gaudí interior", body: "Booked. Then stop collecting.", duration: "2 hours", who: "First-timers" },
  ],
  foodIntro:
    "Barcelona eats late and in courses that are not a tasting menu. A market stall at 14:00 is lunch. Paella on the Rambla is a prop. Follow offices and families.",
  dishes: [
    dish("Esqueixada or a market plate", "Salted fish, vegetables, oil. Lunch infrastructure.", { when: "14:00" }),
    dish("Bombas / tapas in a room with a floor", "Standing is fine. A selfie wall is not a kitchen.", { when: "Evening" }),
    dish("Vermut", "A midday hour, not a cocktail costume.", { when: "Sunday noon" }),
  ],
  venues: [
    venue("A Sant Antoni lunch", "If the next table has shopping bags from the market, stay.", { neighborhood: "Sant Antoni", type: "Bar" }),
  ],
  stayIntro: "Off the Rambla. Near a metro you would use at 01:00.",
  stayAreas: [
    { name: "Gràcia", bestFor: ["Evenings"], commute: "L3 / L4", priceHint: "High", noise: "Plaza nights", safety: "Watch bags" },
    { name: "Eixample left", bestFor: ["First stay"], commute: "L3 / L5", priceHint: "High", noise: "Moderate", safety: "Fine" },
    { name: "Poble-sec", bestFor: ["Food"], commute: "L3", priceHint: "Mid to high", noise: "Weekend", safety: "Ordinary" },
  ],
  arrival: [
    { name: "BCN → metro / Aerobús / Rodalies", time: "25–40 min", cost: "Metro is enough from T2; Aerobús if you have luggage and no patience", how: "Follow metro signs. Official taxi rank if you must.", bestFor: "Almost everyone", watchOut: "Unlicensed rides at arrivals." },
  ],
  gettingAround: [
    { title: "Metro", body: "T-casual for a few days. Contactless may cap — check current Hola math." },
    { title: "Walk the grid, ride the hill", body: "Montjuïc and Güell are hills. The Eixample is a walk." },
  ],
  itineraries: [
    {
      title: "Three days: interior, grid, hill",
      days: 3,
      pace: "balanced",
      summary: "One Gaudí, two neighborhoods, no Rambla as a day.",
      daysPlan: [
        {
          label: "Day 1",
          theme: "Eixample",
          stops: [
            { time: "Morning", title: "Sagrada Família", detail: "Timed ticket. Out by lunch." },
            { time: "Afternoon", title: "Grid walk", detail: "Left of Passeig. A long lunch at 14:00." },
            { time: "Evening", title: "Dinner in the Eixample", detail: "21:00. No Rambla add-on." },
          ],
          rainPlan: "The interior is the day. Covered passages and a long lunch.",
        },
        {
          label: "Day 2",
          theme: "Gràcia",
          stops: [
            { time: "Morning", title: "Plazas", detail: "Coffee where the same people will be tomorrow." },
            { time: "Afternoon", title: "Park Güell only if booked", detail: "Otherwise stay in Gràcia." },
            { time: "Evening", title: "Stay in Gràcia", detail: "One more table." },
          ],
          rainPlan: "Skip the park. A museum and vermut under a roof.",
        },
        {
          label: "Day 3",
          theme: "Poble-sec or the sea early",
          stops: [
            { time: "Morning", title: "Market / Montjuïc hill", detail: "Pick food or air." },
            { time: "Afternoon", title: "Barceloneta only before 11:00", detail: "Or skip the beach entirely." },
            { time: "Evening", title: "Last dinner near the hotel", detail: "Pack." },
          ],
          rainPlan: "Market and a long lunch. The sea can wait.",
        },
      ],
    },
  ],
  visa: {
    summary: "Schengen / ETIAS when applicable.",
    details: ["Confirm official sources."],
    officialUrl: "https://www.exteriores.gob.es/",
  },
  apps: [
    { name: "TMB / Citymapper", purpose: "Metro", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: false, necessary: "before", note: "Watch your phone on Line 3." },
  ],
  culture: [
    { title: "Two languages", body: "Catalan first is a courtesy, not a test. English can wait one sentence." },
    { title: "Late lunch", body: "14:00 is the room. Missing it is a planning error." },
  ],
  safety: [
    { title: "Bags and phones", body: "The city is not dangerous. The Rambla and the metro at rush hour are workplaces for pickpockets." },
  ],
  scams: [
    { name: "Pavement tickets", lookFor: "Lanyards near Sagrada Família", prevent: "Official site only", ifItHappens: "Do not pay on the street" },
  ],
  emergency: [{ label: "Emergency", value: "112" }],
  faq: [
    { q: "Need a travel card?", a: "T-casual for a few days is usually enough. Run Hola math only if you will ride constantly." },
    { q: "August?", a: "Possible if you do interiors at open and evenings at 21:30. Midday is for shutters." },
  ],
  sources: [
    { name: "TMB", url: "https://www.tmb.cat/", usedFor: "Metro" },
    { name: "Sagrada Família", url: "https://sagradafamilia.org/", usedFor: "Tickets" },
  ],
});
