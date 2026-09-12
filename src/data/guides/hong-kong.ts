import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const hongKongGuide = assembleGuide({
  citySlug: "hong-kong",
  countrySlug: "hong-kong",
  title: "Hong Kong Travel Guide",
  subtitle: "Octopus, MTR, humidity. Stay in Sheung Wan or Prince Edward, not a harbour-view trap.",
  seoTitle: "Hong Kong Travel Guide 2026: Neighborhoods, MTR, Food & Itinerary",
  seoDescription:
    "A Hong Kong guide that treats the harbour hotel as a surcharge: Octopus on the Airport Express, ding ding as a bonus, one ridge, cha chaan teng as infrastructure.",
  hero: {
    url: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=2000&q=80",
    alt: "Hong Kong Island skyline across the harbour",
    source: "Unsplash",
    author: "Unsplash",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com",
    location: "Hong Kong",
  },
  snapshot: {
    country: "Hong Kong SAR",
    languages: "Cantonese and English (official); Mandarin common. Greet in Cantonese first if you can.",
    currency: "Hong Kong dollar (HK$)",
    timezone: "HKT (UTC+8)",
    population: "About 7.5 million",
    dailyCost: "HK$550–850 shoestring · HK$1,200–2,000 comfortable · HK$3,800+ premium",
    bestMonths: "October–December, March–April",
    typicalStay: "4 days; a fifth if you hike one ridge and still want a wet market morning",
    airports: "Hong Kong International (HKG)",
    stations: "Central, Admiralty, Tsim Sha Tsui, Prince Edward; Airport Express to Hong Kong / Kowloon",
    visaSummary: "Many passports: visa-free short stay. Confirm Immigration Department, not a forum.",
    plugType: "Type G",
    voltage: "220V, 50Hz",
    emergency: "999",
    tipping: "Not at cha chaan teng. Some restaurants add 10%. Do not tip a dai pai dong.",
    cashVsCard: "Octopus is the city. Cards widely. Cash for wet markets and the stall that still wants coins.",
    diningHours: "Cha chaan teng from breakfast; dim sum morning; dinner from 18:30; late is normal",
    walkability: "Excellent inside a district. Hills, humidity, and the Mid-Levels escalator are the rest.",
    transitQuality: "MTR is the spine. Buses fill gaps. Ding ding is a bonus, not a plan.",
    travelStyle: "Neighborhood-first, card-in-the-pocket — punishes a harbour-view-hotel-as-the-city loop",
  },
  whyGo:
    "Hong Kong is a vertical city with a harbour that hotels will charge you to look at. The skyline is real; so is a Peak tram queue, a humidity that turns a walk into a shower, and a cha chaan teng that still feeds the block at 7:30. Stay in Sheung Wan or Prince Edward. The Hong Kong you remember is an Octopus tap and a table of toast and milk tea, not a room that faces the water you can ride for the price of a Star Ferry.",
  whoWillLoveIt: [
    "People who will tap Octopus and not look at a taxi app first",
    "Eaters who treat cha chaan teng as a meal, not a novelty",
    "Walkers who will do one ridge and then stop",
    "Return visitors happy in Sham Shui Po and uninterested in another Peak selfie",
  ],
  whoMayStruggle: [
    "Anyone who booked a Tsim Sha Tsui harbour view because the listing said skyline",
    "Visitors who melt in July humidity at 14:00 and then blame the city",
    "Travelers who need the Peak as the whole trip",
    "People hoping Central at lunch feels like a village, not a suited scrum",
  ],
  shortVersion: [
    "Stay in Sheung Wan or Prince Edward — not a harbour-view box because the map looks like a postcard.",
    "Octopus before you land. Airport Express, MTR, ding ding, 7-Eleven. The card is the city.",
    "Ding ding is a bonus ride, not a day. Sit upstairs. Get off when you are bored.",
    "Cha chaan teng is breakfast and lunch. Dim sum is a morning. A harbour steakhouse is a different product.",
    "Hike one ridge. Humidity is a constraint. Do not add the Peak tram as a third thought.",
  ],
  realityCheck: [
    "The Peak tram, Avenue of Stars, and a harbour hotel at check-in are crowd-and-surcharge problems.",
    "May–September is wet heat. October is the adult month. Pack for rain that is not a drizzle.",
    "MTR is packed at 8:30 and 18:30. You are commuting with the city, not touring it.",
    "A 'harbour cruise' at the hotel desk is a sales script. Star Ferry is transit.",
    "English works. Cantonese still opens the room. Greet before you point at the menu.",
  ],
  zh: {
    title: "香港旅行指南",
    subtitle: "八达通、港铁、湿度。住上环或太子，不要海景陷阱。",
    whyGo:
      "香港是一座垂直的城，酒店会向你收港口的钱。天际线是真的；山顶缆车的队、把走路变成洗澡的湿度、七点半还在喂街区的茶餐厅也是真的。住上环或太子。记住的是一拍八达通和一桌吐司奶茶，不是对着你可以坐天星去看的那片水的房间。",
    shortVersion: [
      "住上环或太子——不要因为地图像明信片就订海景盒。",
      "落地前备好八达通。机场快线、港铁、叮叮、便利店。卡就是这座城。",
      "叮叮是加分，不是一天。坐上层。腻了就下车。",
      "茶餐厅是早午餐。点心是早上。海港牛排馆是另一种东西。",
      "爬一条山脊。湿度是约束。不要把山顶缆车加成第三个念头。",
    ],
  },
  beforeYouGo: [
    { title: "Octopus", body: "Tourist Octopus or a stored-value card. Airport Express takes it. Test at HKG, not at a turnstile in a crush." },
    { title: "Humidity", body: "If you come in July, plan indoor midday and a change of shirt. This is not a surprise." },
    { title: "The harbour room", body: "Price the view against a Star Ferry ride. Most people overpay for a window." },
    { title: "One hike", body: "Dragon's Back or a Kowloon ridge. Pick one. You are not here for a trekking holiday." },
  ],
  neighborhoods: [
    nbh("Sheung Wan / Sai Ying Pun", "A slope of dried seafood, escalators, and dinner you can walk to.", {
      bestFor: ["First stay"],
      transit: "Island line, Mid-Levels escalator, ding ding",
      combineWith: "Central as a descent, not a hotel.",
    }),
    nbh("Prince Edward / Mong Kok edge", "Residential Kowloon with a market that still feeds the block.", {
      bestFor: ["Repeat visitors"],
      transit: "Tsuen Wan line, Kwun Tong line",
      combineWith: "Flower Market as a neighbor, not a destination hunt.",
    }),
    nbh("Sham Shui Po", "Fabric, electronics, a cheaper table. Visit hungry.", {
      bestFor: ["One afternoon"],
      transit: "Tsuen Wan line",
      combineWith: "A wet market morning, not a mall.",
    }),
    nbh("Tsim Sha Tsui harbour strip (visit)", "The postcard water. Visit at dusk if you must. Sleeping here is a view surcharge.", {
      bestFor: ["One evening"],
      noise: "High",
      transit: "Tsuen Wan line, Star Ferry, bus",
      combineWith: "Star Ferry as the ride home, not a cruise.",
    }),
  ],
  attractions: [
    att("Star Ferry as transit", "Tsim Sha Tsui–Central. The harbour is the ticket. Lower deck is fine.", {
      price: "Octopus fare",
      reservation: "None",
      location: "The harbour, not a dinner cruise",
      transport: "Star Ferry",
    }),
    att("One ridge", "Dragon's Back or a Kowloon hill. Start early. Humidity wins after 11:00.", {
      price: "Free plus MTR",
      reservation: "None",
      location: "Shek O / a Kowloon ridge",
      transport: "MTR then bus or taxi to the trailhead",
      tier: "essential",
    }),
    att("Ding ding upstairs", "The Island tram. A bonus. Get off when the street changes.", {
      price: "Octopus fare",
      reservation: "None",
      tier: "niche",
      location: "Hong Kong Island north shore",
    }),
  ],
  thingsToDo: [
    { title: "Cha chaan teng breakfast", body: "Milk tea, toast, macaroni soup. A room with linoleum. Not a hotel buffet.", duration: "45 min", who: "Everyone" },
    { title: "Wet market morning", body: "Sheung Wan or Prince Edward. Out before the heat is a wall.", duration: "1–2 hours", who: "Walkers" },
  ],
  foodIntro:
    "Hong Kong eats milk tea, noodles, siu mei, and toast as infrastructure. A cha chaan teng with laminated menus beats a harbour restaurant whose price is the window.",
  dishes: [
    dish("Milk tea and toast", "Cha chaan teng. Standing or a booth. Morning infrastructure.", { when: "Morning" }),
    dish("Won ton noodles", "A bowl, a stool, broth that was not an afterthought.", { when: "Lunch" }),
    dish("Siu mei", "Roast goose or char siu over rice. The rice shop, not a tasting menu.", { when: "Dinner" }),
  ],
  venues: [
    venue("A Sheung Wan cha chaan teng", "If the next table has a work bag and a racing form, stay.", { neighborhood: "Sheung Wan", type: "Cha chaan teng" }),
  ],
  stayIntro: "An MTR exit and an elevator. Not a harbour-view 18th floor whose rate is the skyline you can ride for HK$4.",
  stayAreas: [
    { name: "Sheung Wan", bestFor: ["First stay"], commute: "Island line / walk", priceHint: "High", noise: "Moderate", safety: "Fine" },
    { name: "Prince Edward", bestFor: ["Quieter nights"], commute: "MTR", priceHint: "Mid", noise: "Street-level", safety: "Fine" },
    { name: "Sai Ying Pun", bestFor: ["Repeat visitors"], commute: "Island line / walk", priceHint: "Mid to high", noise: "Low to moderate", safety: "High" },
  ],
  arrival: [
    { name: "HKG → Airport Express", time: "24 min to Hong Kong station", cost: "Octopus or a single ticket", how: "Airport Express with Octopus. In-town check-in if you are leaving later. Bus if you are staying in Kowloon and counting coins.", bestFor: "Almost everyone", watchOut: "Taxi is fine with bags; the metre is real. Skip the touts." },
  ],
  gettingAround: [
    { title: "Octopus is the city", body: "MTR, bus, ding ding, ferry, convenience stores. Tap. Do not collect single tickets." },
    { title: "Ding ding as bonus", body: "Upstairs, open window, one useful hop. It is not a sightseeing day." },
  ],
  itineraries: [
    {
      title: "Three days: island slope, Kowloon, one ridge",
      days: 3,
      pace: "balanced",
      summary: "One cha chaan teng, one market, one hike. The Peak tram is not a day.",
      daysPlan: [
        {
          label: "Day 1",
          theme: "Sheung Wan without the harbour surcharge",
          stops: [
            { time: "Morning", title: "Cha chaan teng, then the slope", detail: "Escalator up; walk down." },
            { time: "Afternoon", title: "Ding ding one way, MTR back", detail: "Bonus, not a loop." },
            { time: "Evening", title: "Dinner near the hotel", detail: "Walk home." },
          ],
          rainPlan: "Malls are a last resort. A long lunch and a covered market.",
        },
        {
          label: "Day 2",
          theme: "Kowloon as a neighborhood, not a promenade",
          stops: [
            { time: "Morning", title: "Prince Edward / flower and goldfish streets", detail: "Out before the heat." },
            { time: "Afternoon", title: "Sham Shui Po or a rest", detail: "The harbour strip can wait." },
            { time: "Evening", title: "Star Ferry as the ride, not the show", detail: "No dinner cruise." },
          ],
          rainPlan: "MTR and a noodle shop. The promenade is a wind tunnel in a typhoon signal.",
        },
        {
          label: "Day 3",
          theme: "One ridge, or an outer market",
          stops: [
            { time: "Morning", title: "Dragon's Back early, or a further MTR", detail: "Pick one. Humidity is the clock." },
            { time: "Afternoon", title: "Stay with that choice", detail: "Do not add the Peak tram as a third thought." },
            { time: "Evening", title: "Last milk tea near the hotel", detail: "Pack." },
          ],
          rainPlan: "Skip the ridge. Indoor market and a long table. Trails are slick.",
        },
      ],
    },
  ],
  visa: {
    summary: "Many passports: visa-free short stay.",
    details: ["Confirm official sources."],
    officialUrl: "https://www.immd.gov.hk/",
  },
  apps: [
    { name: "MTR / Citymapper", purpose: "Exits, interchanges, the last hill", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: false, necessary: "before", note: "Octopus in wallet or physical. Airport Express takes it." },
  ],
  culture: [
    { title: "Queue and tap", body: "Stand on the right on MTR escalators. Let people off first. This is not optional." },
    { title: "The harbour is not a hotel amenity", body: "If you cannot see it from a ferry you already paid for, you do not need a room that faces it." },
  ],
  safety: [
    { title: "Humidity, hills, bags", body: "Ordinary city caution. Crowds on MTR. The danger is heat and a snatched phone, not a general menace." },
  ],
  scams: [
    { name: "Harbour dinner cruises and copy-watch touts", lookFor: "Unsolicited boat tickets in TST, shopping 'help' in Mong Kok", prevent: "A flat no; Octopus for the real ferry", ifItHappens: "Walk to the MTR" },
  ],
  emergency: [{ label: "Emergency", value: "999" }],
  faq: [
    { q: "Must I stay with a harbour view?", a: "No. Ride the Star Ferry. Sleep in Sheung Wan or Prince Edward. The water is still there." },
    { q: "Peak tram as a must?", a: "No. One ridge is a better height. The tram is a queue with a view at the end." },
  ],
  sources: [
    { name: "MTR", url: "https://www.mtr.com.hk/", usedFor: "Transit" },
    { name: "Octopus", url: "https://www.octopus.com.hk/", usedFor: "Cards" },
  ],
});
