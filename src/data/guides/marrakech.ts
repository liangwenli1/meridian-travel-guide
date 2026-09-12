import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const marrakechGuide = assembleGuide({
  citySlug: "marrakech",
  countrySlug: "morocco",
  title: "Marrakech Travel Guide",
  subtitle: "A medina maze, not a mall. Stay in a riad you can find at night.",
  seoTitle: "Marrakech Travel Guide 2026: Medina, Riads, Food & Itinerary",
  seoDescription:
    "A Marrakech guide for people who will greet first, take metered taxis, see the square at night, and treat Majorelle as a ticket.",
  hero: {
    url: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2000&q=80",
    alt: "Marrakech medina lane with clay walls and a motorbike, not a staged souk stall",
    source: "Unsplash",
    author: "Unsplash",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com",
    location: "Marrakech",
  },
  snapshot: {
    country: "Morocco",
    languages: "Darija Arabic and French (English in riads and the square; greet in Arabic or French first)",
    currency: "Moroccan dirham (MAD) — buy in Morocco, not a fake 'exchange' at the airport curb",
    timezone: "WEST (UTC+1); Ramadan can shift clocks. Confirm the week you fly.",
    population: "About 1 million in the city; the medina is dense and still lived in",
    dailyCost: "MAD 400–650 shoestring · MAD 900–1,600 comfortable · MAD 2,800+ premium",
    bestMonths: "October–November, March–April. June–August is heat that rewrites the day.",
    typicalStay: "3–4 days; the Atlas is a full day or skip it",
    airports: "Marrakech Menara (RAK)",
    stations: "Marrakech ONCF (Guéliz side) for trains from Casablanca / Tangier",
    visaSummary: "Many passports: visa-free short stay. Confirm official sources before you fly.",
    plugType: "Type C / E",
    voltage: "220V, 50Hz",
    emergency: "19 police · 15 ambulance (112 from mobiles often works)",
    tipping: "Small and specific. Round a cafe. Not 20%. Not at every stall.",
    cashVsCard: "Cash in the medina. Cards in Guéliz and some riads. ATMs in the new town.",
    diningHours: "Lunch 12:30–15:00 · dinner from 19:30. Square food after dusk.",
    walkability: "The medina is walkable and a maze. Motorbikes in lanes. Heat kills noon walks.",
    transitQuality: "Petit taxis on meter. No useful urban rail. Walking in the medina; taxi between medina and Guéliz.",
    travelStyle: "Medina-first, garden-as-ticket — punishes a souk shopping loop at noon",
  },
  whyGo:
    "Marrakech is a living medina with a square that works at night and a garden that is a timed ticket, not a stroll. The maze is real; so is a riad you cannot find after dark, a taxi with no meter, and heat that makes noon a mistake. Stay in a riad with a pin you have tested. Greet in Arabic or French. The Marrakech you remember is a courtyard and Jemaa el-Fnaa after 19:00, not Majorelle from the inside of a sold-out morning.",
  whoWillLoveIt: [
    "Walkers who will get lost on purpose and still find dinner",
    "People who greet first and bargain without treating it as sport",
    "Travelers who will take the square at night and the garden as a ticket",
    "Return visitors happy to spend a day in a riad courtyard and skip another souk lap",
  ],
  whoMayStruggle: [
    "Anyone who needs a grid, a metro, and English at every turn",
    "Visitors who melt at 14:00 in July and call the maze hostile",
    "People who booked a riad they cannot find without a tout",
    "Travelers hoping the Atlas is a half-thought between two lunches",
  ],
  shortVersion: [
    "Stay in a riad you can find at night — a pin, a landmark, a phone number. Not a pretty courtyard three unmarked turns from the square.",
    "The medina is a maze, not a mall. Walk it in the morning or after 17:00. Noon is heat and a hard sell.",
    "Jemaa el-Fnaa at night. Noon on the square is glare and empty stalls performing.",
    "Jardin Majorelle is a ticket. Book. Do not add Yves Saint Laurent as a surprise.",
    "Petit taxis on the meter. Atlas as a full day or skip it. Greet in Arabic or French.",
  ],
  realityCheck: [
    "Majorelle, the square at noon, and the souk loop from the riad door are crowd-management and sales-script problems.",
    "Unmetered taxis from the airport and the square are a negotiation you will lose if you are tired. Meter, or a booked transfer.",
    "Heat from June to August rewrites the itinerary. Courtyards, late starts, night square. Not a walking tour at 13:00.",
    "A 'guide' who attaches at a gate is a commission path. Official guides exist; you book them, they do not find you.",
    "The Atlas is mountains. A full day with a driver, or skip. Do not sandwich it between Majorelle and dinner.",
  ],
  zh: {
    title: "马拉喀什旅行指南",
    subtitle: "麦地那是迷宫，不是商场。住一家夜里找得到的里亚德。",
    whyGo:
      "马拉喀什是一座夜里才真正工作的广场、花园要买票的活着的麦地那。迷宫是真的；天黑后找不到的里亚德、不打表的出租车、让中午变成错误的热也是真的。住有定位钉的里亚德。用阿拉伯语或法语打招呼。记住的是院子和七点后的广场，不是卖完的马若雷尔花园。",
    shortVersion: [
      "住夜里找得到的里亚德——定位、地标、电话。不要住离广场三个没标的弯的漂亮院子。",
      "麦地那是迷宫，不是商场。早上或五点后走。中午是热和硬推销。",
      "杰马夫纳广场看夜场。中午的广场是强光和空摊表演。",
      "马若雷尔花园要买票。先订。不要把圣罗兰博物馆当惊喜。",
      "小出租车打表。阿特拉斯要么一整天要么不去。用阿拉伯语或法语打招呼。",
    ],
  },
  beforeYouGo: [
    { title: "The riad pin", body: "Save the location, a photo of the door, and a number. Night arrivals in the medina without that are how touts eat the evening." },
    { title: "Heat", body: "Summer days are for courtyards. Walk at dawn and after 17:00. June–August is not a 'slightly warm' note." },
    { title: "Majorelle", body: "Timed ticket. Book. The garden is small and popular. It is not a free park." },
    { title: "Atlas", body: "If you go, it is a full day with a driver you chose. Ourika or Imlil, not both as a blur. Or skip." },
  ],
  neighborhoods: [
    nbh("Medina (riad you can find)", "A maze with a courtyard. Sleep where the pin works after dark.", {
      bestFor: ["First stay"],
      transit: "Walk; petit taxi to a gate, then on foot",
      combineWith: "Square at night. Souks as errands, not a shopping day.",
    }),
    nbh("Guéliz / Hivernage", "The new town. Grids, ATMs, a steak if the medina is enough. Sleep here if you want meters and sidewalks.", {
      bestFor: ["Heat and logistics"],
      transit: "Petit taxi",
      combineWith: "Majorelle as a neighbor, not a reason to skip the medina entirely.",
    }),
    nbh("Kasbah / Mellah edge", "Quieter medina, closer to palaces. Still a maze. Still need a pin.", {
      bestFor: ["Repeat visitors"],
      transit: "Walk / taxi to a gate",
      combineWith: "Saadian Tombs as one interior, not a palace crawl.",
    }),
    nbh("The square (visit, at night)", "Jemaa el-Fnaa. Visit after 18:00. Sleeping on it is drums until late.", {
      bestFor: ["One night"],
      noise: "High",
      transit: "Walk from a known riad",
      combineWith: "Eat adjacent, not necessarily on the stall rows if you are tired of performance.",
    }),
  ],
  attractions: [
    att("Jemaa el-Fnaa after 19:00", "The civic square. Night. Smoke, drums, orange juice. Noon is the wrong show.", {
      price: "Free to walk; pay for what you eat",
      reservation: "None",
      location: "Medina",
    }),
    att("Jardin Majorelle", "A ticketed garden. Small, blue, booked. Pair with YSL only if you still have patience.", {
      tier: "extra-time",
      transport: "Petit taxi from a gate",
      location: "Guéliz side",
    }),
    att("A riad courtyard at 16:00", "Shade as infrastructure. The point of the stay, not an amenity photo.", {
      price: "Included if you booked well",
      reservation: "Your room",
      tier: "niche",
    }),
  ],
  thingsToDo: [
    { title: "Medina morning, courtyard noon", body: "Walk early. Hide from heat. Square after dusk. This is the whole method.", duration: "Full day", who: "Everyone" },
    { title: "Hammam", body: "A neighborhood bath, not a spa package with rose petals unless that is the trip.", duration: "1–2 hours", who: "Willing first-timers" },
  ],
  foodIntro:
    "Marrakech eats bread, grilled meat, and stew as infrastructure. A tagine in a room with Darija conversation beats a rooftop performing sunset at lunch.",
  dishes: [
    dish("Tagine", "The pot, not the postcard. Lamb or vegetables. A room with a floor.", { when: "Dinner", localName: "طاجين" }),
    dish("Square night food", "Grills after dusk. Juice. Sit if the table is not a theatre.", { when: "Dinner" }),
    dish("Khobz and olives", "Morning. With mint tea if you have time. Breakfast infrastructure.", { when: "Morning" }),
  ],
  venues: [
    venue("A medina lunch off the square", "If the next table has no camera in hand, stay.", { neighborhood: "Medina", type: "Local restaurant" }),
  ],
  stayIntro: "A riad with a pin, a door you can describe, and a walk you accept after 23:00. Not a courtyard that requires a tout as a GPS.",
  stayAreas: [
    { name: "Medina (findable riad)", bestFor: ["First stay"], commute: "Walk / taxi to a gate", priceHint: "Mid to high", noise: "Lane motorbikes", safety: "Ordinary caution; pin at night" },
    { name: "Guéliz", bestFor: ["Heat and ATMs"], commute: "Petit taxi", priceHint: "Mid", noise: "City streets", safety: "Fine" },
    { name: "Hivernage", bestFor: ["Pools and quiet"], commute: "Petit taxi", priceHint: "High", noise: "Low", safety: "High" },
  ],
  arrival: [
    { name: "RAK → booked transfer or metered taxi", time: "20–40 min", cost: "Metered petit/grand taxi or prebooked riad transfer", how: "Agree the meter or pay a posted airport rate. The riad should send a walker for the last medina minutes.", bestFor: "Almost everyone", watchOut: "Curb 'exchange' and unmetered 'fixed price' that is neither." },
  ],
  gettingAround: [
    { title: "Walk the maze, taxi the distance", body: "Medina on foot. Guéliz and Majorelle by petit taxi on the meter. Say the destination, point at the meter." },
    { title: "Heat is the timetable", body: "Dawn and after 17:00. Midday is the courtyard. Do not taxi across town because of a short walk you refused at 11:00 and now want at 14:00." },
  ],
  itineraries: [
    {
      title: "Three days: maze, ticket, night square",
      days: 3,
      pace: "balanced",
      summary: "One garden as a ticket, one square at night, one courtyard noon. The Atlas is a full day or it is absent.",
      daysPlan: [
        {
          label: "Day 1",
          theme: "Medina without the noon sell",
          stops: [
            { time: "Morning", title: "Riad to a lane walk", detail: "Greet. Get lost once. Coffee off the square." },
            { time: "Afternoon", title: "Courtyard rest", detail: "Heat is not a moral failing. Hide." },
            { time: "Evening", title: "Jemaa el-Fnaa after 19:00, dinner nearby", detail: "Walk home with the pin." },
          ],
          rainPlan: "Rain is rare; when it comes the lanes are clay. Courtyard and a long lunch.",
        },
        {
          label: "Day 2",
          theme: "Majorelle as a ticket, then leave the garden",
          stops: [
            { time: "Morning", title: "Jardin Majorelle (booked)", detail: "Taxi on the meter. Out before you add a second garden." },
            { time: "Afternoon", title: "Guéliz lunch or back to the riad", detail: "ATMs, a grid, then shade." },
            { time: "Evening", title: "Dinner in the medina", detail: "No rooftop performing the same sunset as yesterday." },
          ],
          rainPlan: "Majorelle still works. Paths get slick. The ticket is still the morning.",
        },
        {
          label: "Day 3",
          theme: "Atlas as a full day, or the kasbah and a hammam",
          stops: [
            { time: "Morning", title: "Driver to the High Atlas or a palace interior", detail: "Pick one. Atlas is a full day. Do not fake it." },
            { time: "Afternoon", title: "Stay with that choice", detail: "Do not add Majorelle as a third thought." },
            { time: "Evening", title: "Last courtyard dinner", detail: "Pack. Confirm the airport taxi the night before." },
          ],
          rainPlan: "Skip the Atlas if the road is a rumor. Hammam and kasbah under cover.",
        },
      ],
    },
  ],
  visa: {
    summary: "Many passports: visa-free short stay. Confirm official sources.",
    details: ["Passport validity rules change. Confirm before you fly, not at RAK."],
    officialUrl: "https://www.visitmorocco.com/",
  },
  apps: [
    { name: "Maps pin + Careem/inDrive", purpose: "The riad door and a taxi that is not a debate", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: true, necessary: "before", note: "Offline map of the medina. The pin is the stay." },
  ],
  culture: [
    { title: "Salam / Bonjour", body: "Greet before you ask a price or a direction. English can be the third language in the sentence." },
    { title: "The maze is not a mall", body: "If you treat every lane as retail, you will be sold. Walk as if you live here. Buy on the last afternoon if you still want the object." },
  ],
  safety: [
    { title: "Lanes, heat, bags", body: "Motorbikes in alleys. Ordinary caution with bags on the square. The danger is heat, traffic in lanes, and a lost night walk, not a general menace." },
  ],
  scams: [
    { name: "Unmetered taxi and 'guide' at the gate", lookFor: "Fixed prices with no meter; helpful strangers who found your riad for you", prevent: "Meter or booked transfer; a flat no at the gate", ifItHappens: "Pay a fair amount once and walk. Do not follow." },
  ],
  emergency: [{ label: "Emergency", value: "19 police · 15 ambulance" }],
  faq: [
    { q: "Must I do the Atlas?", a: "No. It is a full day with a driver, or it is a wasted half. Three days in the medina is enough." },
    { q: "Is the square safe at night?", a: "It is a crowd. Watch bags. Eat where you choose. It is the correct hour; noon is the wrong one." },
  ],
  sources: [
    { name: "Visit Morocco", url: "https://www.visitmorocco.com/", usedFor: "Hours and entry notes" },
    { name: "ONCF", url: "https://www.oncf.ma/", usedFor: "Trains" },
  ],
});
