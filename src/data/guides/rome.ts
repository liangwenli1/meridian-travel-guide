import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const romeGuide = assembleGuide({
  citySlug: "rome",
  countrySlug: "italy",
  title: "Rome Travel Guide",
  subtitle: "A living capital with ruins in the way. Stay inside the walls. Eat at 21:00.",
  seoTitle: "Rome Travel Guide 2026: Neighborhoods, Food, Transit & Itinerary",
  seoDescription:
    "A Rome guide for people who will walk, book one interior, and eat in the neighborhood they sleep in. Forum, Testaccio, trams, and a three-day plan.",
  hero: {
    url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=2000&q=80",
    alt: "Colosseum in Rome under a clear sky",
    source: "Unsplash",
    author: "David Köhler",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com/photos/colosseum-italy",
    location: "Colosseo, Rome",
  },
  snapshot: {
    country: "Italy",
    languages: "Italian (English at hotels and major interiors; not a given at the counter)",
    currency: "Euro (€)",
    timezone: "CET/CEST (UTC+1/+2)",
    population: "About 2.8 million in the city",
    dailyCost: "€70–95 shoestring · €140–220 comfortable · €350+ premium",
    bestMonths: "April–early June, late September–October",
    typicalStay: "4 days inside the walls; Ostia or Tivoli is extra",
    airports: "Fiumicino (FCO) default; Ciampino (CIA) for some low-cost flights",
    stations: "Termini, Tiburtina, Ostiense, Trastevere",
    visaSummary: "EU/Schengen. ETIAS when it applies — confirm official sources.",
    plugType: "Type F / L",
    voltage: "230V, 50Hz",
    emergency: "112",
    tipping: "Service is often included. A euro or two on the table is optional, not 20%.",
    cashVsCard: "Cards widely. Keep cash for tiny bars and some market stalls.",
    diningHours: "Lunch 12:30–15:00 · dinner from 19:30, serious rooms from 20:30",
    walkability: "Excellent and tiring. Cobbles, heat, and no grid.",
    transitQuality: "Metro is a sketch. Buses and trams do the rest. Walking wins inside the walls.",
    travelStyle: "Walkable, ruin-adjacent, neighborhood-specific — punishes a fountain checklist",
  },
  whyGo:
    "Rome is a living capital with ruins in the way. The Forum is real; so is a 21:00 carbonara, a bus that does not come, and a neighborhood that is not the fountain belt. Stay inside the walls if you can. Book the one interior you will actually finish. The city you remember is a table after dark, not a selfie at noon.",
  whoWillLoveIt: [
    "Walkers who will cross the river twice and not call it a hike",
    "People who eat standing at a counter and call it lunch",
    "Travelers who will pick one paid ruin and walk the rest",
    "Return visitors happy to spend a day in Testaccio and skip another fountain",
  ],
  whoMayStruggle: [
    "Anyone who needs step-free, smooth pavements everywhere",
    "Visitors who wilt in July at 14:00 without a shuttered plan",
    "People who want dinner at 18:00 in a kitchen that is still closed",
    "Travelers hoping the area around Trevi feels like a neighborhood",
  ],
  shortVersion: [
    "Stay in Testaccio, Monti, or Trastevere west of the scrum — not a hotel facing the fountain because the map looks central.",
    "Book Colosseum / Forum as one timed ticket. Walk the rest. The Vatican is a logistics day, not a photo stop.",
    "Say buongiorno before you order. Eat the lunch that the offices eat.",
    "Tap-to-pay on metro and buses via the official app or a contactless card. Do not buy a paper day-pass from a man at Termini.",
    "One neighborhood after 21:00 beats a night tour with a headset.",
  ],
  realityCheck: [
    "Trevi, the Spanish Steps, and the chain-gelato belt are a crowd-management problem, not Rome.",
    "Pickpockets work the metro (especially Line A), Termini, and any queue that photographs well.",
    "August is a different city: many kitchens closed, the remaining ones packed. Do not treat August like April.",
    "A 'skip the line' seller on the pavement is not the official ticket.",
    "The centro is not uniformly safe at 2 a.m. on empty side streets. Walk where there are lights and other people, or take a taxi.",
  ],
  zh: {
    title: "罗马旅行指南",
    subtitle: "一座有废墟挡路的活首都。住在城墙里。九点吃饭。",
    whyGo:
      "罗马是一座活着的首都，废墟挡在路上。广场是真的；九点的碳拉、不来的公交、不是喷泉带的街区也是真的。能的话住在城墙里。订一处你真会看完的内部。记住的是天黑之后的一张桌子，不是中午的自拍。",
    shortVersion: [
      "住在 Testaccio、Monti，或人堆西边的 Trastevere——不要因为地图看着中心就订喷泉对面的酒店。",
      "斗兽场/广场当作一张定时票。其余走路。梵蒂冈是一天后勤，不是一个拍照停靠。",
      "点单前说 buongiorno。吃上班族吃的午餐。",
      "地铁公交用官方应用或卡轻触。不要在 Termini 向路人买纸质日票。",
      "九点后的一个街区，胜过戴耳机的夜游。",
    ],
  },
  beforeYouGo: [
    { title: "Tickets", body: "Colosseum and Vatican are official-site problems. Screenshot the QR. Third-party 'skip' is often a tour in disguise." },
    { title: "Shoes", body: "Cobbles. Heat. Distances the map understates. Bring the pair you can walk 15,000 steps in." },
    { title: "Reservations", body: "Dinner from 20:30 in rooms you care about. Lunch can be a counter if you arrive before the offices." },
    { title: "Water", body: "Nasoni fountains are drinkable. Carry a bottle. Buying water at every ruin is a tax on not knowing." },
  ],
  neighborhoods: [
    nbh("Testaccio", "A working quarter of slaughterhouse memory, markets, and kitchens that feed the same people at lunch tomorrow.", {
      bestFor: ["Food", "Repeat visitors"],
      transit: "Piramide, buses along the river",
      combineWith: "A morning at the Pyramid and an evening that does not climb back to the centro.",
    }),
    nbh("Monti", "A village between the Forum and Termini that still has streets you can sleep on.", {
      bestFor: ["First-timers who will walk"],
      transit: "Cavour, Colosseo",
      combineWith: "Forum morning, Monti dinner. Do not add Trevi the same day.",
    }),
    nbh("Trastevere (west of the scrum)", "Cobbles and kitchens. Stay off the main piazza after 20:00 if you want to sleep.", {
      bestFor: ["Evenings"],
      noise: "High on the main squares",
      transit: "Trastevere station / tram 8",
      combineWith: "Janiculum at dusk, then one table. Not a bar crawl mapped by a blog.",
    }),
    nbh("Prati", "Grid streets north of the Vatican. Useful if that interior is your day; dull if it is your whole trip.", {
      bestFor: ["Vatican logistics"],
      price: "High",
      transit: "Ottaviano, Lepanto",
      combineWith: "One Vatican morning, then leave Prati to eat.",
    }),
  ],
  attractions: [
    att("Colosseum + Forum", "One timed ticket, one morning. It is the civic ruin, not a backdrop.", {
      location: "Colosseo",
      transport: "Colosseo (B)",
      alternative: "Appia Antica if you want stone without the same queue",
    }),
    att("Pantheon", "A working interior that still earns the detour if you go when the square is not a show.", {
      location: "Centro",
      price: "Ticketed",
      tier: "essential",
    }),
    att("Galleria Borghese", "The one museum that justifies a reservation more than another ruin.", {
      location: "Villa Borghese",
      reservation: "Mandatory timed entry",
      tier: "extra-time",
    }),
  ],
  thingsToDo: [
    { title: "Fountain water, not fountain photos", body: "Drink from nasoni. Photograph one interior you entered.", duration: "Ongoing", who: "Everyone" },
    { title: "A market morning", body: "Testaccio market is a kitchen, not a set.", duration: "2 hours", who: "Eaters" },
  ],
  foodIntro:
    "Rome is a lunch city that pretends to be a dinner city. The offices tell the truth at 13:00. Carbonara is a Roman plate, not a personality. Sit where the room is speaking Italian.",
  dishes: [
    dish("Cacio e pepe", "Cheese, pepper, pasta water. Judge the room by this, not by a carbonara photo.", { localName: "cacio e pepe", where: "Testaccio or a trattoria that still does lunch" }),
    dish("Pizza al taglio", "A square you eat walking. Lunch infrastructure.", { when: "11:30–14:00" }),
    dish("Carciofi", "Jewish-style or alla romana, in season. Do not order it in August because a menu still lists it.", { when: "Winter–spring" }),
  ],
  venues: [
    venue("A Testaccio lunch", "If the next table has receipts and work badges, stay.", { neighborhood: "Testaccio", type: "Trattoria" }),
  ],
  stayIntro: "Inside the walls, near a tram or a walkable dinner. Termini is a station, not a neighborhood.",
  stayAreas: [
    { name: "Monti", bestFor: ["First stay"], commute: "Walk to the Forum", priceHint: "High", noise: "Moderate", safety: "Busy" },
    { name: "Testaccio", bestFor: ["Food"], commute: "Metro B + walk", priceHint: "Mid to high", noise: "Low at night", safety: "Ordinary" },
    { name: "Trastevere", bestFor: ["Evenings"], commute: "Tram 8", priceHint: "High", noise: "High on piazzas", safety: "Watch bags" },
  ],
  arrival: [
    { name: "FCO → Leonardo Express / regional", time: "32–50 min to Termini", cost: "Express is faster and dearer; regional is enough", how: "Train, not a taxi queue at 22:00 unless you are exhausted.", bestFor: "Almost everyone", watchOut: "Unlicensed rides at arrivals. Official taxi rank or prebook." },
    { name: "CIA → bus", time: "40–60 min", cost: "Bus", how: "Scheduled bus to Termini. Ciampino is not 'closer'.", bestFor: "Low-cost arrivals" },
  ],
  gettingAround: [
    { title: "Walk inside the walls", body: "Metro is two lines and a sketch. A 25-minute walk is often the correct transfer." },
    { title: "Tickets", body: "Contactless or the official app. Do not buy paper from a stranger at Termini." },
  ],
  itineraries: [
    {
      title: "Three days: ruin, river, kitchen",
      days: 3,
      pace: "balanced",
      summary: "One paid ruin morning, one Vatican-or-Borghese, one Testaccio day. No fountain loop.",
      daysPlan: [
        {
          label: "Day 1",
          theme: "Stone, then Monti",
          stops: [
            { time: "Morning", title: "Colosseum + Forum", detail: "Timed ticket. Water, hat, out by lunch." },
            { time: "Afternoon", title: "Monti streets", detail: "Shade, a counter, a nap if the heat wins." },
            { time: "Evening", title: "Dinner in Monti", detail: "21:00. Do not add Trevi." },
          ],
          rainPlan: "Pantheon and covered galleries. The Forum can take a light rain; it cannot take a flood and a tantrum.",
        },
        {
          label: "Day 2",
          theme: "One interior",
          stops: [
            { time: "Morning", title: "Vatican or Borghese", detail: "Pick one. The other is a different trip." },
            { time: "Afternoon", title: "Prati lunch then leave", detail: "Do not shop the same street twice." },
            { time: "Evening", title: "Trastevere west of the piazza", detail: "One table. Walk the river home." },
          ],
          rainPlan: "The booked interior is the day. A long lunch. Skip the square.",
        },
        {
          label: "Day 3",
          theme: "Testaccio",
          stops: [
            { time: "Morning", title: "Market", detail: "Coffee, a stall, no itinerary." },
            { time: "Afternoon", title: "Pyramid / cemetery / river", detail: "Quiet stone without a headset." },
            { time: "Evening", title: "Last dinner in Testaccio", detail: "Pack. Do not add Tivoli unless you already had four days." },
          ],
          rainPlan: "Market under the roof and a trattoria lunch that runs long.",
        },
      ],
    },
  ],
  visa: {
    summary: "Schengen / ETIAS when applicable. Confirm official sources.",
    details: ["An airline email is not the law."],
    officialUrl: "https://www.schengenvisainfo.com/",
  },
  apps: [
    { name: "Trenitalia / official taxi", purpose: "Airport train and a real cab", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: false, necessary: "before", note: "Avoid random QR codes at arrivals." },
  ],
  culture: [
    { title: "Greeting is the ticket", body: "Buongiorno before the order. The English sentence can wait." },
    { title: "Dinner is late", body: "18:00 is for tourists and children. 20:30 is the room." },
  ],
  safety: [
    { title: "Crowds and bags", body: "Front pockets on Line A. Cross-body bags. Empty side streets at 2 a.m. are not charming — take a taxi." },
  ],
  scams: [
    { name: "Petition / bracelet", lookFor: "Friendly approach at the Forum or Trevi", prevent: "A flat no, keep walking", ifItHappens: "Do not engage; check pockets after" },
  ],
  emergency: [{ label: "Emergency", value: "112" }],
  faq: [
    { q: "Roma Pass?", a: "Only if you already planned two paid interiors and the transport math works. Most three-day trips walk more than they ride." },
    { q: "July?", a: "Possible if you do interiors at open and evenings at 21:00. Midday is for shutters." },
  ],
  sources: [
    { name: "Coopculture", url: "https://www.coopculture.it/", usedFor: "Colosseum tickets" },
    { name: "ATAC", url: "https://www.atac.roma.it/", usedFor: "City transport" },
  ],
});
