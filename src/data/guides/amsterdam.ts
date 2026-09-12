import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const amsterdamGuide = assembleGuide({
  citySlug: "amsterdam",
  countrySlug: "netherlands",
  title: "Amsterdam Travel Guide",
  subtitle: "Canals, bikes, and a center that is too small for the crowd it attracts. Stay where residents still buy groceries.",
  seoTitle: "Amsterdam Travel Guide 2026: Neighborhoods, Bikes, Museums & Itinerary",
  seoDescription:
    "An Amsterdam guide that treats the canal ring as a place to sleep carefully: Museumplein as a booking problem, Jordaan as a walk, and the bike as transport.",
  hero: {
    url: "https://images.unsplash.com/photo-1534351590666-13e8e69bc680?auto=format&fit=crop&w=2000&q=80",
    alt: "Amsterdam canal houses and a bridge",
    source: "Unsplash",
    author: "Unsplash",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com",
    location: "Amsterdam",
  },
  snapshot: {
    country: "Netherlands",
    languages: "Dutch (English is fluent; greet in Dutch first)",
    currency: "Euro (€)",
    timezone: "CET/CEST (UTC+1/+2)",
    population: "About 920,000 in the city",
    dailyCost: "€70–95 shoestring · €140–220 comfortable · €350+ premium",
    bestMonths: "April–May, September–October",
    typicalStay: "3–4 days; more if you use it as a rail hub",
    airports: "Schiphol (AMS)",
    stations: "Amsterdam Centraal, Zuid, Amstel",
    visaSummary: "Schengen / ETIAS when applicable.",
    plugType: "Type F / C",
    voltage: "230V, 50Hz",
    emergency: "112",
    tipping: "Round up. Service is included.",
    cashVsCard: "Cards everywhere. Some cafes are card-only.",
    diningHours: "Lunch 12:00–14:30 · dinner from 18:00; kitchens close earlier than you think",
    walkability: "Excellent, until a bike claims the lane you thought was a sidewalk",
    transitQuality: "GVB trams and metro. The bike is the real metro.",
    travelStyle: "Neighborhood-first — punishes a canal-cruise-as-the-city loop",
  },
  whyGo:
    "Amsterdam is a low city with a high opinion of its center. The canals are real; so is a rental bike you should not ride drunk, a museum slot you should have booked, and a street that still sells cheese to the block. Stay outside the loudest ring. The Amsterdam you remember is a stoop, a tram window, and a kitchen that did not need a view.",
  whoWillLoveIt: [
    "People who will rent a bike and actually use the lanes",
    "Museum-goers who book Rijks or Van Gogh and then leave the queue behind",
    "Travelers happy in De Pijp or Oost after dark",
    "Return visitors who skip the cruise and take a ferry to NDSM",
  ],
  whoMayStruggle: [
    "Anyone who treats the Red Light District as a theme park after 23:00",
    "Visitors who walk in the bike lane and then get angry",
    "Travelers who need a car",
    "Peak-July crowds who booked nothing",
  ],
  shortVersion: [
    "Stay in De Pijp, Oost, or Westerpark — not a canal-house party rental because the map looks central.",
    "OV-chipkaart or OVpay. Tram is fine. Bike is better if you can keep a straight line.",
    "One museum with a ticket. The second is optional.",
    "Dinner in a room with Dutch conversation. Stroopwafel is a market snack, not a pilgrimage.",
    "The ferry behind Centraal is free and more of a city than a canal cruise.",
  ],
  realityCheck: [
    "The canal ring in July is a crowd-management problem. So is Damrak.",
    "Bikes have right of way in practice. Look twice. Then look left again.",
    "Coffeeshops are not bars. Read the rules on the door.",
    "Short-lets have eaten some canals. Be a guest on the stairs.",
    "King's Day and Gay Pride are the city as a festival. Book elsewhere those weekends unless that is why you came.",
  ],
  zh: {
    title: "阿姆斯特丹旅行指南",
    subtitle: "运河、自行车，中心区装不下它招来的人。住在居民还买菜的地方。",
    whyGo:
      "阿姆斯特丹是一座低的城，对中心区评价很高。运河是真的；不该酒后骑的租车、该提前订的博物馆、还在卖给街区奶酪的店也是真的。住在最吵的环外面。记住的是门廊、电车窗和一间不需要景观的厨房。",
    shortVersion: [
      "住在 De Pijp、Oost 或 Westerpark——不要因为地图看着中心就订运河派对短租。",
      "OV 卡或 OVpay。电车够用。车把能扶直就骑车。",
      "一个订了票的博物馆。第二个可选。",
      "有荷兰人说话的房间吃晚饭。糖浆华夫是市场点心，不是朝圣。",
      "中央车站后面的渡轮免费，比运河游船更像这座城。",
    ],
  },
  beforeYouGo: [
    { title: "Book the one interior", body: "Rijksmuseum or Van Gogh. Not both in one jet-lagged morning." },
    { title: "Bike honesty", body: "If you have not ridden in a city, walk. The lanes are not a rental-toy circuit." },
    { title: "OVpay", body: "Bank card on the gate works. Test it at Schiphol, not at a jammed tram." },
    { title: "Season", body: "Tulip fields are a day trip and a parking problem. The city in April is already enough." },
  ],
  neighborhoods: [
    nbh("De Pijp", "A tight grid with a market that still feeds the block.", {
      bestFor: ["First stay"],
      transit: "Noord/Zuid metro, tram 3/12",
      combineWith: "Museumplein as a visit, not a hotel.",
    }),
    nbh("Oost / Indische Buurt", "Residential, parks, dinner you can walk to.", {
      bestFor: ["Repeat visitors"],
      transit: "Tram 3/7/14, Muiderpoort",
      combineWith: "Oosterpark as the lawn, not a destination hunt.",
    }),
    nbh("Jordaan (visit)", "Pretty canals. Visit. Sleeping here in peak season is a suitcase in a crowd.", {
      bestFor: ["One afternoon"],
      noise: "High on weekends",
      transit: "Tram 3/13/17",
      combineWith: "Out before the cruise groups thicken.",
    }),
    nbh("Noord", "Across the free ferry. Space, halls, a different skyline.", {
      bestFor: ["Evenings"],
      transit: "Ferry behind Centraal, metro Noord",
      combineWith: "NDSM as a half-day, not a stunt.",
    }),
  ],
  attractions: [
    att("Rijksmuseum", "The civic interior. Book a slot. Then leave.", {
      location: "Museumplein",
      transport: "Tram 2/5/12",
    }),
    att("A canal that is not a cruise", "Walk one ring at 8:00. The water is the ticket.", {
      price: "Free",
      reservation: "None",
      location: "Herengracht or a side canal in Oost",
      tier: "essential",
    }),
    att("Ferry to Noord", "The city's cheapest skyline.", {
      price: "Free",
      reservation: "None",
      transport: "Behind Centraal",
      tier: "extra-time",
    }),
  ],
  thingsToDo: [
    { title: "Market lunch", body: "Albert Cuyp if you must; a neighborhood hall if you can.", duration: "1 hour", who: "Eaters" },
    { title: "Evening without the district", body: "De Pijp or Oost after dark. The center is a different city at 23:00.", duration: "Evening", who: "Everyone" },
  ],
  foodIntro:
    "Amsterdam eats bread, herring, Indonesian plates, and a surprising number of good kitchens that are not Dutch. A rijsttafel in a room with conversation beats a pancake house on a canal because the map said so.",
  dishes: [
    dish("Haring", "Raw herring, onion, pickle. Standing up, outside.", { when: "Lunch" }),
    dish("Rijsttafel", "Colonial history on a table. Eat it as food, not costume.", { when: "Dinner" }),
    dish("Stroopwafel", "Market stall, still warm. One.", { when: "Morning" }),
  ],
  venues: [
    venue("A De Pijp dinner", "If the next table has grocery bags, stay.", { neighborhood: "De Pijp", type: "Bistro" }),
  ],
  stayIntro: "A tram stop and an elevator. Not a canal-house fourth floor with a 23kg bag and no bike shed.",
  stayAreas: [
    { name: "De Pijp", bestFor: ["First stay"], commute: "Metro / tram", priceHint: "High", noise: "Moderate" , safety: "Fine" },
    { name: "Oost", bestFor: ["Quieter nights"], commute: "Tram", priceHint: "Mid to high", noise: "Low", safety: "High" },
    { name: "Westerpark", bestFor: ["Space"], commute: "Tram / bike", priceHint: "Mid", noise: "Evenings in the park", safety: "Fine" },
  ],
  arrival: [
    { name: "AMS → train", time: "15–20 min", cost: "NS to Centraal or Zuid", how: "Follow trains, not taxis. IJtram if you are staying east.", bestFor: "Almost everyone", watchOut: "Unlicensed rides at arrivals." },
  ],
  gettingAround: [
    { title: "Bike as metro", body: "If you rent, lock it like you mean it. Walk the first morning if you landed at dawn." },
    { title: "Tram + walk", body: "The center is small. You do not need a cruise to see water." },
  ],
  itineraries: [
    {
      title: "Three days: museum, neighborhood, north",
      days: 3,
      pace: "balanced",
      summary: "One ticketed interior, one residential grid, one ferry. The cruise is not a day.",
      daysPlan: [
        {
          label: "Day 1",
          theme: "Booked room, then a canal at walking speed",
          stops: [
            { time: "Morning", title: "Rijks or Van Gogh", detail: "The slot you booked." },
            { time: "Afternoon", title: "De Pijp walk and lunch", detail: "Not Museumplein for a second queue." },
            { time: "Evening", title: "Dinner near the hotel", detail: "Walk home." },
          ],
          rainPlan: "The museum was the plan. Add a cafe, not a cruise.",
        },
        {
          label: "Day 2",
          theme: "Jordaan early, then leave",
          stops: [
            { time: "Morning", title: "Jordaan before 10:00", detail: "Out before groups." },
            { time: "Afternoon", title: "Oost or a rest", detail: "The center compounds." },
            { time: "Evening", title: "A kitchen in Oost", detail: "No pancake theatre." },
          ],
          rainPlan: "Covered market and a long table.",
        },
        {
          label: "Day 3",
          theme: "Noord or Haarlem",
          stops: [
            { time: "Morning", title: "Free ferry or an early Haarlem train", detail: "Pick one." },
            { time: "Afternoon", title: "Stay with that choice", detail: "Do not add Zaanse Schans as a third thought." },
            { time: "Evening", title: "Last dinner near the hotel", detail: "Pack." },
          ],
          rainPlan: "Noord halls still work. Haarlem interiors too.",
        },
      ],
    },
  ],
  visa: {
    summary: "Schengen / ETIAS when applicable.",
    details: ["Confirm official sources."],
    officialUrl: "https://www.iamsterdam.com/",
  },
  apps: [
    { name: "GVB / NS", purpose: "Trams and the airport train", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: false, necessary: "before", note: "OVpay with a foreign card usually works. Test once." },
  ],
  culture: [
    { title: "Direct is polite", body: "Dutch conversation skips the cushion. It is not a slight." },
    { title: "The bike is not a toy", body: "If you cannot keep the lane, walk. Locals are commuting, not posing." },
  ],
  safety: [
    { title: "Bikes and bags", body: "Theft is opportunistic — phones, bikes, bags on cafe chairs. The danger is traffic, not a general menace." },
  ],
  scams: [
    { name: "Fake taxis at Schiphol", lookFor: "Helpful drivers before the official rank", prevent: "Train, or a marked taxi", ifItHappens: "Pay only a meter / app" },
  ],
  emergency: [{ label: "Emergency", value: "112" }],
  faq: [
    { q: "Must I take a canal cruise?", a: "No. Walk a canal at 8:00. The boat is a floating queue." },
    { q: "Is the Red Light District the city?", a: "It is a few streets. Treat it as a late walk you can skip." },
  ],
  sources: [
    { name: "GVB", url: "https://www.gvb.nl/", usedFor: "Transit" },
    { name: "I amsterdam", url: "https://www.iamsterdam.com/", usedFor: "Hours" },
  ],
});
