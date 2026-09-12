import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const veniceGuide = assembleGuide({
  citySlug: "venice",
  countrySlug: "italy",
  title: "Venice Travel Guide",
  subtitle: "Still inhabited. Stay where residents buy milk. The vaporetto is a bus.",
  seoTitle: "Venice Travel Guide 2026: Neighborhoods, Vaporetto, Acqua Alta & Itinerary",
  seoDescription:
    "A Venice guide for people who will sleep in Cannaregio or Dorsoduro, ride the vaporetto as a bus, and leave San Marco to the day-trip crush.",
  hero: {
    url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=2000&q=80",
    alt: "Venice canal with a vaporetto and weathered palazzi, not a gondola close-up",
    source: "Unsplash",
    author: "Unsplash",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com",
    location: "Venice",
  },
  snapshot: {
    country: "Italy",
    languages: "Italian (English in San Marco; less so in a Cannaregio bakery at 8:00)",
    currency: "Euro (€)",
    timezone: "CET/CEST (UTC+1/+2)",
    population: "About 50,000 in the historic city — still inhabited, shrinking",
    dailyCost: "€90–130 shoestring · €180–280 comfortable · €400+ premium",
    bestMonths: "Late October–November (fog, fewer day-trippers), March–April. August is a crush.",
    typicalStay: "3 nights in the city; a mainland hotel is how you become a day-tripper",
    airports: "Marco Polo (VCE) default; Treviso (TSF) for some low-cost flights",
    stations: "Venezia Santa Lucia; Mestre on the mainland if you misbooked",
    visaSummary: "Schengen / ETIAS when applicable.",
    plugType: "Type F / L",
    voltage: "230V, 50Hz",
    emergency: "112",
    tipping: "Service is often included. A euro on the table is optional, not 20%.",
    cashVsCard: "Cards widely. Keep coins for some bacari and the odd toilet.",
    diningHours: "Lunch 12:30–14:30 · cicchetti from noon · dinner from 19:30",
    walkability: "Total, and tiring. Bridges, no wheels, no shortcuts that stay dry in acqua alta.",
    transitQuality: "Vaporetto is a bus on water. Slow, useful, packed at San Marco. Walk when the alleys allow.",
    travelStyle: "Neighborhood-first, square-optional — punishes a day-trip to San Marco",
  },
  whyGo:
    "Venice is still a city people live in, however reduced, with a square that day-trippers crush between 10:00 and 16:00. The water is real; so is a wheeled suitcase on a bridge, a church you will not finish, and acqua alta that is logistics, not romance. Stay in Cannaregio or Dorsoduro. Ride the vaporetto as a bus. The Venice you remember is a bacaro after dark and a quiet campo, not San Marco from inside the crush.",
  whoWillLoveIt: [
    "Walkers who will carry a bag, not roll it",
    "People who eat standing at a counter and call it lunch",
    "Travelers who will pick one church interior and walk the rest",
    "Return visitors happy to spend a day in Cannaregio and skip another mosaic",
  ],
  whoMayStruggle: [
    "Anyone with a wheeled suitcase and a hotel across four bridges",
    "Visitors who need San Marco at noon to feel they have arrived",
    "People who booked Mestre and think the lagoon is a commute, not a day-trip",
    "Travelers hoping a gondola is transport rather than a priced performance",
  ],
  shortVersion: [
    "Stay in Cannaregio or Dorsoduro — not a room on San Marco because the map looks central.",
    "Vaporetto is a bus. ACTV day ticket if you will ride twice. Walk the rest.",
    "One church interior. The second is the same damp and gold.",
    "If you must day-trip, leave by 16:00. Better: sleep here.",
    "No wheeled bags on bridges. Acqua alta is a forecast, not a vibe.",
  ],
  realityCheck: [
    "San Marco, the Rialto bridge, and the 10:30 vaporetto from the station are crowd-management problems.",
    "Day-trippers peak 10:00–16:00. The city returns to residents after the last mainland train mood.",
    "Wheeled luggage on stepped bridges is a planning error and a local grievance. Carry, or pack light.",
    "Acqua alta is seasonal water in the street. Boots, raised walkways, check Centro Maree. Not a photo op to wade.",
    "A gondola tout at the station is a sales script. The vaporetto is how Venetians move bulk.",
  ],
  zh: {
    title: "威尼斯旅行指南",
    subtitle: "还有人住。住在居民买牛奶的地方。水上巴士是公交。",
    whyGo:
      "威尼斯仍是有人住的城市，尽管人少了；圣马可在十点到四点被日归游客压垮。水是真的；桥上的拉杆箱、看不完的教堂、当后勤而不是浪漫的涨水也是真的。住 Cannaregio 或 Dorsoduro。把水上巴士当公交。记住的是天黑后的柜台酒和安静的广场，不是挤在圣马可里。",
    shortVersion: [
      "住 Cannaregio 或 Dorsoduro——不要因为地图看着中心就住圣马可。",
      "水上巴士是公交。要坐两趟再买 ACTV 日票。其余走路。",
      "一座教堂内部。第二座是同样的潮和金。",
      "如果必须日归，十六点前离开。更好：住在这里。",
      "桥上不要拉杆箱。涨水是预报，不是氛围。",
    ],
  },
  beforeYouGo: [
    { title: "Bags", body: "A wheeled suitcase on stepped bridges is a planning error. Pack a bag you can carry. Hotels have stairs." },
    { title: "Where you sleep", body: "Historic city or you are a day-tripper. Mestre is cheaper and you will resent the last train." },
    { title: "Acqua alta", body: "Check Centro Maree. Autumn and winter. Raised boards (passerelle) on marked routes. Waterproof shoes, not a paddle." },
    { title: "Day access", body: "Some peak days require a day-visitor contribution. Sleeping in the city is the clean workaround. Confirm Comune di Venezia." },
  ],
  neighborhoods: [
    nbh("Cannaregio", "A canal grid with bakeries, laundry, and dinner you can walk to without a San Marco scrum.", {
      bestFor: ["First stay"],
      transit: "Vaporetto Ca' d'Oro, Guglie, or Santa Lucia on foot",
      combineWith: "Ghetto as a neighbor, not a checklist stop.",
    }),
    nbh("Dorsoduro", "University quiet, a Zattere walk, rooms that still feel like a sestiere after 18:00.", {
      bestFor: ["Repeat visitors"],
      transit: "Accademia, Zattere, or a long walk from the station",
      combineWith: "One gallery if you want interiors. Salute as a silhouette, not a ticket.",
    }),
    nbh("Castello (east)", "Arsenale side. Fewer day-trippers. Sleep a street off the Biennale axis in odd years.", {
      bestFor: ["Quieter nights"],
      transit: "Celestia, Giardini",
      combineWith: "Via Garibaldi as grocery, not a restaurant hunt.",
    }),
    nbh("San Marco (visit, carefully)", "The postcard square. Visit at 8:00 or after 18:00. Sleeping here is a price and a crush.", {
      bestFor: ["One morning"],
      noise: "High",
      transit: "San Marco Vallaresso / San Zaccaria",
      combineWith: "Out before the cruise and coach mood thickens.",
    }),
  ],
  attractions: [
    att("A campo after 18:00", "The civic square. One. Residents, not a selfie wall.", {
      price: "Free",
      reservation: "None",
      location: "Cannaregio or a Dorsoduro campo",
    }),
    att("One church interior", "Frari or San Giorgio Maggiore. Pick one. Gold repeats.", {
      tier: "extra-time",
      transport: "Walk or San Giorgio vaporetto",
      location: "San Polo or Isola di San Giorgio",
    }),
    att("Vaporetto as bus", "Ride a line that is not the Grand Canal postcard loop if that boat is a queue. The point is the stop, not the wake.", {
      price: "ACTV fare or day ticket",
      reservation: "None",
      tier: "niche",
    }),
  ],
  thingsToDo: [
    { title: "Bacaro dinner standing", body: "Cicchetti and wine at a counter. Sit only if the room sits locals.", duration: "Evening", who: "Everyone" },
    { title: "Zattere walk", body: "Giudecca Canal light without the San Marco density.", duration: "1 hour", who: "Walkers" },
  ],
  foodIntro:
    "Venice eats cicchetti, fish when the stall is real, and pastry as infrastructure. A tramezzino in a room with Italian conversation beats a menu with a gondolier on it.",
  dishes: [
    dish("Cicchetti", "Small plates at a counter. Point. Stand. Lunch infrastructure.", { when: "Lunch" }),
    dish("Fish of the day", "In a room that smells like a grill, not a postcard. Ask what came in.", { when: "Dinner" }),
    dish("Tramezzino", "One, from a bar without a velvet rope, with a spritz if you must.", { when: "Morning" }),
  ],
  venues: [
    venue("A Cannaregio bacaro", "If the next table has grocery bags, stay.", { neighborhood: "Cannaregio", type: "Bacaro" }),
  ],
  stayIntro: "A sestiere you can find in the dark without crossing San Marco. Stairs. No wheels. Not a 4th-floor walk-up with a 23kg bag.",
  stayAreas: [
    { name: "Cannaregio", bestFor: ["First stay"], commute: "Walk / vaporetto", priceHint: "Mid to high", noise: "Low to moderate", safety: "Fine" },
    { name: "Dorsoduro", bestFor: ["Quieter nights"], commute: "Walk / Accademia boat", priceHint: "High", noise: "Low", safety: "High" },
    { name: "Castello", bestFor: ["Distance from the crush"], commute: "Walk / eastern vaporetto", priceHint: "Mid", noise: "Low", safety: "Fine" },
  ],
  arrival: [
    { name: "VCE → Alilaguna or bus+vaporetto", time: "45–75 min", cost: "Alilaguna or ACTV+bus", how: "Alilaguna to a stop near the hotel, or bus to Piazzale Roma then vaporetto/walk. Water taxi only if you are splitting it and have no stairs left.", bestFor: "Almost everyone", watchOut: "Unlicensed water-taxi touts at arrivals. Wheels on the first bridge." },
  ],
  gettingAround: [
    { title: "Walk, then boat", body: "Most of the historic city is a walk. Vaporetto is for the long edge, the islands, and tired legs." },
    { title: "No wheels on bridges", body: "This is the whole method. Carry the bag or you will hate every campo." },
  ],
  itineraries: [
    {
      title: "Three days: sestiere, one interior, skip the crush",
      days: 3,
      pace: "balanced",
      summary: "One campo, one church, one residential grid. San Marco is not a day. Day-trippers leave at 16:00; you stay.",
      daysPlan: [
        {
          label: "Day 1",
          theme: "Cannaregio without the scrum",
          stops: [
            { time: "Morning", title: "Strada Nova as a commute, then off it", detail: "Coffee standing up. Groceries exist." },
            { time: "Afternoon", title: "One church or a long lunch", detail: "Frari if you want rooms." },
            { time: "Evening", title: "Campo at 18:00, bacaro dinner", detail: "Walk home without San Marco." },
          ],
          rainPlan: "The church still works. Acqua alta: follow passerelle, do not wade for a photo.",
        },
        {
          label: "Day 2",
          theme: "San Marco early, then leave",
          stops: [
            { time: "Morning", title: "Piazza before 9:00", detail: "Out before coaches. Basilica only if you booked and will finish." },
            { time: "Afternoon", title: "Dorsoduro or a rest", detail: "Bridges compound." },
            { time: "Evening", title: "Dinner in Dorsoduro", detail: "No menu with a gondola on it." },
          ],
          rainPlan: "Skip the square. Accademia or a long table. Square stones are a rink in rain.",
        },
        {
          label: "Day 3",
          theme: "Castello or a single island",
          stops: [
            { time: "Morning", title: "East walk or an early vaporetto to one island", detail: "Pick one. Murano-Burano-Torcello as a chain is a day-tripper loop." },
            { time: "Afternoon", title: "Stay with that choice", detail: "Do not add San Marco as a third thought." },
            { time: "Evening", title: "Last cicchetti near the hotel", detail: "Pack a bag you can carry at dawn." },
          ],
          rainPlan: "Castello under arcades. Islands in rain are still islands; the boat is the day.",
        },
      ],
    },
  ],
  visa: {
    summary: "Schengen / ETIAS when applicable.",
    details: ["Confirm official sources. Peak-day visitor contribution is a Comune rule, not a visa."],
    officialUrl: "https://www.veneziaunica.it/",
  },
  apps: [
    { name: "Venezia Unica / ACTV", purpose: "Vaporetto tickets and acqua alta notices", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: false, necessary: "before", note: "Centro Maree for water. Offline map for alleys after 23:00." },
  ],
  culture: [
    { title: "Buongiorno", body: "Greet before you order. English can be the second sentence. You are in someone's grocery grid." },
    { title: "The vaporetto is not a cruise", body: "If you cannot board, you did not miss Venice. You missed a full bus." },
  ],
  safety: [
    { title: "Bridges, water, bags", body: "Pickpockets on crowded boats and the Rialto. Ordinary caution after dark. The danger is wheels, wet stone, and theft, not a general menace." },
  ],
  scams: [
    { name: "Gondola and water-taxi touts", lookFor: "Unsolicited rides at the station and San Marco", prevent: "A flat no. ACTV is posted.", ifItHappens: "Walk to the vaporetto stop" },
  ],
  emergency: [{ label: "Emergency", value: "112" }],
  faq: [
    { q: "Can I day-trip from Mestre?", a: "You can. You will be in the 10:00–16:00 crush and on a schedule. Sleep in the city." },
    { q: "Must I ride a gondola?", a: "No. It is a priced performance. The vaporetto is the bus. A traghetto crossing is the cheap row if you want wood on water." },
  ],
  sources: [
    { name: "ACTV / Venezia Unica", url: "https://www.veneziaunica.it/", usedFor: "Transit" },
    { name: "Centro Maree", url: "https://www.comune.venezia.it/", usedFor: "Acqua alta" },
  ],
});
