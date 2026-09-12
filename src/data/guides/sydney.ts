import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const sydneyGuide = assembleGuide({
  citySlug: "sydney",
  countrySlug: "australia",
  title: "Sydney Travel Guide",
  subtitle: "The harbour is real. The city is spread out. Stay inner west or Surry Hills, not a Circular Quay hotel.",
  seoTitle: "Sydney Travel Guide 2026: Neighborhoods, Ferries, Beaches & Itinerary",
  seoDescription:
    "A Sydney guide that treats the Opera House as a free angle: Opal card, ferry as transit, Bondi in the morning, Circular Quay as a station not a hotel.",
  hero: {
    url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=2000&q=80",
    alt: "Sydney Opera House and harbour from the water",
    source: "Unsplash",
    author: "Unsplash",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com",
    location: "Sydney",
  },
  snapshot: {
    country: "Australia",
    languages: "English",
    currency: "Australian dollar (A$)",
    timezone: "AEST/AEDT (UTC+10/+11)",
    population: "About 5.3 million in the metro area",
    dailyCost: "A$120–180 shoestring · A$220–350 comfortable · A$550+ premium",
    bestMonths: "March–May, September–November",
    typicalStay: "4 days; a fifth if you treat a beach as a morning and the inner west as a night",
    airports: "Kingsford Smith (SYD)",
    stations: "Central, Town Hall, Wynyard, Circular Quay; airport on T8",
    visaSummary: "ETA / eVisitor for many passports. Confirm Home Affairs, not a forum.",
    plugType: "Type I",
    voltage: "230V, 50Hz",
    emergency: "000",
    tipping: "Not expected. Round up, or 10% only if the room was exceptional.",
    cashVsCard: "Tap cards everywhere. You will barely see cash.",
    diningHours: "Breakfast culture is real · lunch 12:00–14:30 · dinner from 18:00",
    walkability: "Excellent inside a neighborhood. The metro area is a train map, not a stroll.",
    transitQuality: "Opal on trains, buses, ferries, light rail. The ferry is transit. Taxis are a last hill.",
    travelStyle: "Neighborhood-first, harbour-as-commute — punishes a Circular-Quay-hotel-as-the-city loop",
  },
  whyGo:
    "Sydney is a harbour city that pretends the harbour is the whole map. The water is real; so is a spread-out grid, a UV index that burns through cloud, and a Circular Quay hotel whose rate is the postcard. Stay in Surry Hills or the inner west. The Sydney you remember is a ferry you tapped with Opal and a beach at 7:30, not a $400 tour that points at the Opera House from a worse angle than Mrs Macquarie's Chair.",
  whoWillLoveIt: [
    "People who will tap Opal and take a ferry as if they had a job on the other shore",
    "Walkers who do the Opera House from the point, not from a ticketed deck",
    "Travelers who swim in the morning and hide from noon",
    "Return visitors happy in Marrickville and uninterested in another Quay gelato",
  ],
  whoMayStruggle: [
    "Anyone who booked Circular Quay because the Opera House was in the window",
    "Visitors who treat Bondi at 14:00 in January as a plan",
    "Travelers who need the CBD as a walkable European old town",
    "People hoping a harbour cruise is the city rather than a floating queue",
  ],
  shortVersion: [
    "Stay in Surry Hills or the inner west — not a Circular Quay hotel because the map looks like a postcard.",
    "Opal on train, bus, ferry. The boat is transit. Sit outside. You already have the view.",
    "Opera House from Mrs Macquarie's Chair. Free. The $400 tour is a microphone.",
    "Beaches in the morning. Midday is UV. Shade is a strategy, not a mood.",
    "The city is spread out. Pick one neighborhood after dark. Do not collect suburbs.",
  ],
  realityCheck: [
    "Circular Quay, Bondi at lunch, and the Opera House forecourt at cruise time are crowd-management problems.",
    "The sun is not European sun. Hat, sleeve, morning water. Sunburn is the amateur souvenir.",
    "Distances lie. Newtown to Manly is a planned move, not a wander.",
    "A hotel 'harbour cruise' is a sales script. Opal already buys the Manly ferry.",
    "January is heat plus school holidays. March and October are the adult months.",
  ],
  zh: {
    title: "悉尼旅行指南",
    subtitle: "港口是真的。城是散的。住内西区或 Surry Hills，不要住环形码头酒店。",
    whyGo:
      "悉尼是一座把港口当成整张地图的港城。水是真的；铺开的路网、能透过云灼伤的紫外线、房价等于明信片的环形码头酒店也是真的。住 Surry Hills 或内西区。记住的是拍了 Opal 的渡轮和七点半的海滩，不是比麦格理夫人椅更差角度的四百刀游船。",
    shortVersion: [
      "住 Surry Hills 或内西区——不要因为地图像明信片就订环形码头酒店。",
      "火车、公交、渡轮用 Opal。船是交通。坐外面。景观你已经有了。",
      "歌剧院去麦格理夫人椅看。免费。四百刀的团是一只麦克风。",
      "海滩去早上。中午是紫外线。阴影是策略，不是心情。",
      "城是散的。天黑后守一个街区。不要收集郊区。",
    ],
  },
  beforeYouGo: [
    { title: "Opal", body: "Card or the app. Airport station has an access fee. Tap on and off. Ferries too." },
    { title: "UV", body: "The sun is the planning constraint. Morning beach, midday interior, hat as default." },
    { title: "The Quay hotel", body: "You are paying for a view a ferry already includes. Sleep inland. Ride the water." },
    { title: "One beach", body: "Bondi or a harbour pool. Early. Do not make midday the swim." },
  ],
  neighborhoods: [
    nbh("Surry Hills", "A tight grid of kitchens. Walk to the CBD; do not sleep in it.", {
      bestFor: ["First stay"],
      transit: "Central, light rail, buses",
      combineWith: "Circular Quay as a station, not a hotel.",
    }),
    nbh("Inner west (Newtown / Marrickville)", "A residential spine with Vietnamese tables and a bookstore density.", {
      bestFor: ["Repeat visitors"],
      transit: "T3 / T4, buses",
      combineWith: "The harbour as a day trip from a real kitchen.",
    }),
    nbh("Glebe / Forest Lodge", "A quieter inner-west slope. Dinner you can walk to.", {
      bestFor: ["Quieter nights"],
      transit: "Light rail, buses",
      combineWith: "Glebe Point as a walk, not a destination hunt.",
    }),
    nbh("Circular Quay / The Rocks (visit)", "The postcard water. Visit. Sleeping here is a harbour tax.", {
      bestFor: ["One morning"],
      noise: "High",
      transit: "Circular Quay trains and ferries",
      combineWith: "Mrs Macquarie's, then leave before the cruise groups thicken.",
    }),
  ],
  attractions: [
    att("Opera House from Mrs Macquarie's Chair", "The civic angle. Free. Walk the point. Do not buy a tour for this view.", {
      price: "Free",
      reservation: "None",
      location: "Mrs Macquarie's Chair, The Domain",
      transport: "Bus or walk from the Quay",
    }),
    att("A ferry as transit", "Manly or a inner-harbour hop on Opal. Sit outside. This is not a cruise.", {
      price: "Opal fare",
      reservation: "None",
      location: "Circular Quay wharves",
      transport: "Public ferry",
      tier: "essential",
    }),
    att("A beach before 9:00", "Bondi or a harbour pool. Out before the UV and the towel grid.", {
      price: "Free",
      reservation: "None",
      tier: "extra-time",
      location: "Bondi or a harbour baths",
    }),
  ],
  thingsToDo: [
    { title: "Morning water, then shade", body: "Swim or ferry early. The afternoon is an interior or a long lunch inland.", duration: "Morning", who: "Everyone" },
    { title: "Inner-west dinner", body: "Newtown or Marrickville. A room that does not face the Opera House.", duration: "Evening", who: "Eaters" },
  ],
  foodIntro:
    "Sydney eats breakfast seriously, Vietnamese in the inner west, and seafood that does not require a harbour surcharge. A counter in Marrickville beats a Quay restaurant whose price is the window.",
  dishes: [
    dish("Flat white", "A real cafe, not a hotel. Morning infrastructure.", { when: "Morning" }),
    dish("A Vietnamese plate", "Marrickville or Cabramatta. Lunch that feeds the block.", { when: "Lunch" }),
    dish("Seafood at a counter", "Oysters or fish where the floor is not a view deck.", { when: "Dinner" }),
  ],
  venues: [
    venue("A Surry Hills dinner", "If the next table has grocery bags, stay.", { neighborhood: "Surry Hills", type: "Bistro" }),
  ],
  stayIntro: "A train stop and an elevator. Not a Circular Quay room whose rate is the Opera House you can walk to from a cheaper hill.",
  stayAreas: [
    { name: "Surry Hills", bestFor: ["First stay"], commute: "Walk / train Central", priceHint: "High", noise: "Moderate", safety: "Fine" },
    { name: "Newtown / inner west", bestFor: ["Repeat visitors"], commute: "Train / bus", priceHint: "Mid to high", noise: "King Street evenings", safety: "Fine" },
    { name: "Glebe", bestFor: ["Quieter nights"], commute: "Light rail / bus", priceHint: "Mid to high", noise: "Low", safety: "High" },
  ],
  arrival: [
    { name: "SYD → T8 train", time: "15–20 min to Central", cost: "Opal plus the airport station fee", how: "T8 from the airport. Follow trains, not touts. Taxi or rideshare if you have two bags and a late landing.", bestFor: "Almost everyone", watchOut: "The station access fee is real. Budget it. Unlicensed rides at arrivals." },
  ],
  gettingAround: [
    { title: "Opal is the spine", body: "Train, bus, ferry, light rail. Tap off. The airport fee is the one surprise." },
    { title: "Ferry beats a cruise", body: "Manly is a commute with a cliff. You do not need a microphone to see water." },
  ],
  itineraries: [
    {
      title: "Three days: point, inner west, morning water",
      days: 3,
      pace: "balanced",
      summary: "One free Opera House angle, one residential grid, one early beach. The cruise is not a day.",
      daysPlan: [
        {
          label: "Day 1",
          theme: "The point, then inland",
          stops: [
            { time: "Morning", title: "Mrs Macquarie's Chair", detail: "The angle. Then leave the forecourt." },
            { time: "Afternoon", title: "Surry Hills walk and lunch", detail: "Not a second queue at the Quay." },
            { time: "Evening", title: "Dinner near the hotel", detail: "Walk home." },
          ],
          rainPlan: "The Art Gallery or MCA. The point can wait. A cruise is still a bad idea.",
        },
        {
          label: "Day 2",
          theme: "Ferry as transit, then the inner west",
          stops: [
            { time: "Morning", title: "Manly ferry out and back, or a shorter hop", detail: "Opal. Sit outside." },
            { time: "Afternoon", title: "Newtown or Marrickville", detail: "The harbour compounds. Go inland." },
            { time: "Evening", title: "A kitchen in the inner west", detail: "No Quay surcharge." },
          ],
          rainPlan: "The ferry still runs. Add a long table, not a boat with a soundtrack.",
        },
        {
          label: "Day 3",
          theme: "Beach early, then stop",
          stops: [
            { time: "Morning", title: "Bondi or a harbour pool before 9:00", detail: "Out before UV and the towel grid." },
            { time: "Afternoon", title: "Stay with shade", detail: "Do not add the Blue Mountains as a third thought." },
            { time: "Evening", title: "Last dinner near the hotel", detail: "Pack." },
          ],
          rainPlan: "Skip the sand. A pool with a roof or a long breakfast. The mountains are a full day if you already committed.",
        },
      ],
    },
  ],
  visa: {
    summary: "ETA / eVisitor for many passports.",
    details: ["Confirm official sources."],
    officialUrl: "https://immi.homeaffairs.gov.au/",
  },
  apps: [
    { name: "Opal / TripView / Next There", purpose: "Trains, ferries, the airport fee", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: false, necessary: "before", note: "Tap on and off. Ferries included. The Quay is a station." },
  ],
  culture: [
    { title: "Sun is not a vibe", body: "Slip, slop, slap is not a joke. Midday beach is how visitors go home red." },
    { title: "The harbour is a commute", body: "If you treat the ferry as transit you get the city. If you buy a cruise you get a microphone." },
  ],
  safety: [
    { title: "UV, rips, bags", body: "Swim between flags. Ordinary city caution after dark. The danger is sun and current, not a general menace." },
  ],
  scams: [
    { name: "Harbour tours at the Quay", lookFor: "Clipboard touts offering a better angle than the point", prevent: "Walk to Mrs Macquarie's; Opal for the ferry", ifItHappens: "Walk inland" },
  ],
  emergency: [{ label: "Emergency", value: "000" }],
  faq: [
    { q: "Must I stay at Circular Quay?", a: "No. Sleep in Surry Hills. The Opera House is a walk and a free angle." },
    { q: "Bondi at midday?", a: "No. Morning or a harbour pool. Midday is UV and a queue for the showers." },
  ],
  sources: [
    { name: "Transport NSW", url: "https://transportnsw.info/", usedFor: "Transit" },
    { name: "City of Sydney", url: "https://www.cityofsydney.nsw.gov.au/", usedFor: "Hours" },
  ],
});
