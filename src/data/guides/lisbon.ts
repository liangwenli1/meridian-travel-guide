import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const lisbonGuide = assembleGuide({
  citySlug: "lisbon",
  countrySlug: "portugal",
  title: "Lisbon Travel Guide",
  subtitle: "Hills, trams, Atlantic light. Stay where you can walk downhill to dinner.",
  seoTitle: "Lisbon Travel Guide 2026: Neighborhoods, Trams, Food & Itinerary",
  seoDescription:
    "A Lisbon guide for hill people: one tram as transport, a miradouro at 18:00, and a neighborhood that is not the 28 scrum.",
  hero: {
    url: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=2000&q=80",
    alt: "Lisbon yellow tram on a steep street",
    source: "Unsplash",
    author: "Unsplash",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com",
    location: "Lisbon",
  },
  snapshot: {
    country: "Portugal",
    languages: "Portuguese (English common in the center; greet in Portuguese first)",
    currency: "Euro (€)",
    timezone: "WET/WEST (UTC+0/+1)",
    population: "About 550,000 in the city; more in the metro area",
    dailyCost: "€60–85 shoestring · €120–190 comfortable · €300+ premium",
    bestMonths: "April–June, September–October",
    typicalStay: "4 days; Sintra is a day if you start early, not a half-thought",
    airports: "Humberto Delgado (LIS)",
    stations: "Oriente, Santa Apolónia, Cais do Sodré, Rossio",
    visaSummary: "Schengen / ETIAS when applicable.",
    plugType: "Type F / C",
    voltage: "230V, 50Hz",
    emergency: "112",
    tipping: "Round up. Not 20%.",
    cashVsCard: "Cards widely. Keep coins for some trams and tiny counters.",
    diningHours: "Lunch 12:30–15:00 · dinner from 19:30",
    walkability: "Excellent if you accept hills. Suitcases and cobbles are a fight.",
    transitQuality: "Trams are transport and a scrum. Metro is the adult spine. Hills win anyway.",
    travelStyle: "Neighborhood-first, viewpoint-optional — punishes a 28-as-attraction loop",
  },
  whyGo:
    "Lisbon is a hill city with a river that feels like the sea. The light is real; so is a tram that you cannot board, a cobble that turns an ankle, and a neighborhood still adjusting to short-lets. Stay where dinner is downhill. Book nothing except maybe a palace if you leave the city. The Lisbon you remember is a table and a viewpoint at 18:00, not tram 28 from the inside of a full car.",
  whoWillLoveIt: [
    "Walkers with knees and a water bottle",
    "People who will take the metro and treat the tram as a bonus",
    "Travelers who eat sardines in season and something else when not",
    "Return visitors happy to spend a day in Campo de Ourique and skip another miradouro",
  ],
  whoMayStruggle: [
    "Anyone with heavy luggage and no elevator",
    "Visitors who melt on July cobbles at 14:00",
    "People who need the tram 28 experience as the whole city",
    "Travelers hoping Alfama at 11:00 feels like a village, not a queue",
  ],
  shortVersion: [
    "Stay in Príncipe Real, Campo de Ourique, or Graça off the selfie wall — not a short-let on the 28 because the map looks central.",
    "Viva Viagem / Navegante on metro. Tram 28 is transport; if it is full, walk or take another line.",
    "One miradouro at 18:00. The second one is the same light.",
    "Lunch in a room with a floor. Pastel de nata is a snack, not a pilgrimage.",
    "Sintra only as an early full day. Do not add it to a tired third afternoon.",
  ],
  realityCheck: [
    "Tram 28, the castle approach, and the pastel shop with a 40-minute line are crowd-management problems.",
    "Pickpockets work trams and the castle slope. Front pockets. Bags in front.",
    "Short-lets have changed some hills. Be a guest on the stair, not a rolling suitcase at 23:00.",
    "August is heat plus queues. May and September are the adult months.",
    "A tuk-tuk 'city tour' is a sales script. The hill is walkable if you are not in a hurry.",
  ],
  zh: {
    title: "里斯本旅行指南",
    subtitle: "山、电车、大西洋的光。住在晚饭能下山走到的地方。",
    whyGo:
      "里斯本是一座河像海的山城。光是真的；上不去的电车、扭脚踝的石板、仍在适应短租的街区也是真的。住在晚饭在山下的地方。除了出城的宫殿，几乎不用订。记住的是一张桌子和六点的观景台，不是挤在 28 路车厢里。",
    shortVersion: [
      "住在 Príncipe Real、Campo de Ourique，或观景墙以外的 Graça——不要因为地图看着中心就住在 28 路短租。",
      "地铁用 Viva / Navegante。28 路是交通；满了就走或换一线。",
      "六点一个观景台。第二个是同一束光。",
      "有地板的房间吃午餐。蛋挞是点心，不是朝圣。",
      "辛特拉只作为一早出发的一整天。不要加在疲惫的第三天下午。",
    ],
  },
  beforeYouGo: [
    { title: "Hills and bags", body: "A hard-shell suitcase on Alfama cobbles is a planning error. Pack a bag you can carry up stairs." },
    { title: "Cards", body: "Viva Viagem or the Navegante app. Metro is the spine." },
    { title: "Sintra", body: "If you go, go early and pick one palace. It is a full day." },
    { title: "Season", body: "Sardines have a season. Menus that insist in January are performing." },
  ],
  neighborhoods: [
    nbh("Príncipe Real / Bairro Alto edge", "A garden, a grid, and dinner you can walk to without a tram scrum.", {
      bestFor: ["First stay"],
      transit: "Rato, Baixa-Chiado (steep)",
      combineWith: "Chiado as a descent, not a hotel base.",
    }),
    nbh("Campo de Ourique", "A residential grid with a market that still feeds the block.", {
      bestFor: ["Repeat visitors"],
      transit: "Rato, Campo de Ourique tram 28 (the quiet end)",
      combineWith: "Estrela basilica as a neighbor, not a destination hunt.",
    }),
    nbh("Graça (off the wall)", "A hill with a view. Sleep a street back from the miradouro.", {
      bestFor: ["Evenings"],
      transit: "Intendente, tram 28 if it stops",
      combineWith: "One sunset. Do not collect every viewpoint.",
    }),
    nbh("Alfama (visit, carefully)", "The postcard maze. Visit in the morning or after 20:00. Sleeping here is a suitcase problem.", {
      bestFor: ["One morning"],
      noise: "High",
      transit: "Terreiro do Paço, tram 12 / 28",
      combineWith: "Out before the tuk-tuks thicken.",
    }),
  ],
  attractions: [
    att("A miradouro at 18:00", "The civic view. One. The light is the ticket.", {
      price: "Free",
      reservation: "None",
      location: "Graça or São Pedro de Alcântara",
    }),
    att("Calouste Gulbenkian", "The interior when the hills are enough.", {
      tier: "extra-time",
      transport: "São Sebastião",
    }),
    att("Tram as transport", "Ride a line that is not 28 if 28 is a queue. The point is the hill, not the yellow paint.", {
      price: "Transit fare",
      reservation: "None",
      tier: "niche",
    }),
  ],
  thingsToDo: [
    { title: "Downhill dinner", body: "Plan the day so the last walk is down.", duration: "Evening", who: "Everyone" },
    { title: "Market lunch", body: "Campo de Ourique or Time Out only if you must — the former is a neighborhood.", duration: "1–2 hours", who: "Eaters" },
  ],
  foodIntro:
    "Lisbon eats grilled fish, soup, and pastry as infrastructure. A seafood rice in a room with Portuguese conversation beats a tiled tavern performing fado at lunch.",
  dishes: [
    dish("Sopa", "Caldo verde or whatever the pot is. Lunch infrastructure.", { when: "Lunch" }),
    dish("Grilled fish", "In season, in a room that smells like a grill, not a postcard.", { when: "Dinner" }),
    dish("Pastel de nata", "One, from a bakery without a velvet rope, with coffee standing up.", { when: "Morning" }),
  ],
  venues: [
    venue("A Campo de Ourique lunch", "If the next table has grocery bags, stay.", { neighborhood: "Campo de Ourique", type: "Tasca" }),
  ],
  stayIntro: "A hill with an elevator or a walk you accept. Not a 4th-floor walk-up with a 23kg bag.",
  stayAreas: [
    { name: "Príncipe Real", bestFor: ["First stay"], commute: "Walk / metro Rato", priceHint: "High", noise: "Moderate", safety: "Fine" },
    { name: "Campo de Ourique", bestFor: ["Quieter nights"], commute: "Tram / walk", priceHint: "Mid to high", noise: "Low", safety: "High" },
    { name: "Graça", bestFor: ["Views"], commute: "Tram / walk", priceHint: "Mid", noise: "Miradouro evenings", safety: "Watch bags" },
  ],
  arrival: [
    { name: "LIS → metro", time: "25–40 min", cost: "Metro on a Viva card", how: "Red line from the airport. Official taxi or Bolt if you have two bags and a hill.", bestFor: "Almost everyone", watchOut: "Unlicensed rides at arrivals." },
  ],
  gettingAround: [
    { title: "Metro + hills", body: "Metro is the spine. Trams are useful when they are not full of the same five stops." },
    { title: "Walk down, ride up", body: "This is the whole method." },
  ],
  itineraries: [
    {
      title: "Three days: hill, interior, west",
      days: 3,
      pace: "balanced",
      summary: "One viewpoint, one interior, one residential grid. Tram 28 is not a day.",
      daysPlan: [
        {
          label: "Day 1",
          theme: "Center without the scrum",
          stops: [
            { time: "Morning", title: "Chiado to the river", detail: "Downhill. Coffee standing up." },
            { time: "Afternoon", title: "One museum or a long lunch", detail: "Gulbenkian if you want rooms." },
            { time: "Evening", title: "Miradouro at 18:00, dinner uphill of your hotel", detail: "Walk down after." },
          ],
          rainPlan: "Gulbenkian or another interior. The viewpoint can wait." ,
        },
        {
          label: "Day 2",
          theme: "Alfama early, then leave",
          stops: [
            { time: "Morning", title: "Alfama before 10:00", detail: "Out before tuk-tuks." },
            { time: "Afternoon", title: "Graça or a rest", detail: "Hills compound." },
            { time: "Evening", title: "Dinner in Príncipe Real", detail: "No fado lunch theatre." },
          ],
          rainPlan: "Skip the maze. Covered market and a long table.",
        },
        {
          label: "Day 3",
          theme: "Campo de Ourique or Sintra",
          stops: [
            { time: "Morning", title: "Market or an early Sintra train", detail: "Pick one. Sintra is a full day." },
            { time: "Afternoon", title: "Stay with that choice", detail: "Do not add Belém as a third thought." },
            { time: "Evening", title: "Last dinner near the hotel", detail: "Pack." },
          ],
          rainPlan: "Campo de Ourique under the roof. Sintra palaces still work in rain if you already committed.",
        },
      ],
    },
  ],
  visa: {
    summary: "Schengen / ETIAS when applicable.",
    details: ["Confirm official sources."],
    officialUrl: "https://www.visitportugal.com/",
  },
  apps: [
    { name: "Metro Lisboa / Citymapper", purpose: "Hills and connections", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: false, necessary: "before", note: "Bolt for the last hill with bags." },
  ],
  culture: [
    { title: "Bom dia", body: "Greet before you order. English can be the second sentence." },
    { title: "The tram is not a ride", body: "If you cannot board, you did not miss Lisbon. You missed a full car." },
  ],
  safety: [
    { title: "Hills and bags", body: "Pickpockets on trams. Ordinary caution at miradouros after dark. The danger is ankles and theft, not a general menace." },
  ],
  scams: [
    { name: "Tuk-tuk loops", lookFor: "Unsolicited tours at miradouros", prevent: "A flat no", ifItHappens: "Walk downhill" },
  ],
  emergency: [{ label: "Emergency", value: "112" }],
  faq: [
    { q: "Must I ride 28?", a: "No. Ride a quieter tram or walk. The hill is the city." },
    { q: "Sintra in an afternoon?", a: "No. It is a full early day or it is a queue in the heat." },
  ],
  sources: [
    { name: "Metro Lisboa", url: "https://www.metrolisboa.pt/", usedFor: "Transit" },
    { name: "Visit Lisboa", url: "https://www.visitlisboa.com/", usedFor: "Hours" },
  ],
});
