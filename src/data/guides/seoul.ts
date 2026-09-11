import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const seoulGuide = assembleGuide({
  citySlug: "seoul",
  countrySlug: "south-korea",
  title: "Seoul Travel Guide",
  subtitle: "A late capital that kept its mountains. Stay near a subway. Eat at 02:00 if the room is still honest.",
  seoTitle: "Seoul Travel Guide 2026: Neighborhoods, Food, Subway & Itinerary",
  seoDescription:
    "A Seoul guide for subway people: one palace morning, a neighborhood dinner, and late stew. T-money, mountains, and a three-day plan.",
  hero: {
    url: "https://images.unsplash.com/photo-1538485399081-7c8ce5a1c072?auto=format&fit=crop&w=2000&q=80",
    alt: "Seoul city lights and mountains at dusk",
    source: "Unsplash",
    author: "Unsplash",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com",
    location: "Seoul",
  },
  snapshot: {
    country: "South Korea",
    languages: "Korean (English in hotels, palaces, and many restaurants; less so in local markets)",
    currency: "Korean won (₩)",
    timezone: "KST (UTC+9)",
    population: "About 9.6 million in the city; more in the metro sprawl",
    dailyCost: "₩70,000–100,000 shoestring · ₩150,000–250,000 comfortable · ₩400,000+ premium",
    bestMonths: "Late April–June, late September–October",
    typicalStay: "4–5 days; a mountain or Suwon is extra",
    airports: "Incheon (ICN) default; Gimpo (GMP) for some regional flights",
    stations: "Seoul Station, Yongsan, Cheongnyangni, the subway as the skeleton",
    visaSummary: "K-ETA / visa-free rules change. Confirm Korea Immigration, not a 2023 blog.",
    plugType: "Type F (C also)",
    voltage: "220V, 60Hz",
    emergency: "112 police · 119 fire / ambulance",
    tipping: "Not expected. Do not perform American tipping at a barbecue table.",
    cashVsCard: "Cards and T-money everywhere. Cash is a backup.",
    diningHours: "Lunch 11:30–13:30 · dinner from 18:00 · many rooms still honest after midnight",
    walkability: "Neighborhoods walk; the city as a whole is subway + hills.",
    transitQuality: "The subway is the city. Frequent, signed, the correct spine.",
    travelStyle: "Late, layered, palace-and-alley — rewards one mountain and punishes a tower checklist",
  },
  whyGo:
    "Seoul is a late capital that kept its mountains. Palaces are real; so is a 2 a.m. stew, a river bus, and a neighborhood that restyles itself in a year. Stay near a subway. Book one palace morning. The city you remember is a table you returned to, not a tower you queued for.",
  whoWillLoveIt: [
    "People who will ride the subway instead of collecting taxi stories",
    "Eaters who consider 02:00 a reasonable hour for soup",
    "Walkers who will climb a mountain on the edge of the city and come down for dinner",
    "Return visitors happy to spend a day in Seochon or Seongsu and skip another palace",
  ],
  whoMayStruggle: [
    "Anyone who needs English at every counter",
    "Visitors who wilt at hills, stairs, and a summer that feels like a wet blanket",
    "People uncomfortable with sensory density — grill smoke, neon, karaoke",
    "Travelers who want the city to be done by 21:00",
  ],
  shortVersion: [
    "Stay near a subway in Ikseon / Jongno, Hannam, or Yeonnam — not a hotel facing a tower because the postcard looks central.",
    "T-money on the phone or card. Airport railroad from ICN is the adult choice.",
    "Book one palace (Gyeongbok or Changdeok) early. Walk a hanok neighborhood. The tower is optional infrastructure.",
    "Eat where the next table is coming from an office or a rehearsal, not a tour bus.",
    "One late kitchen beats a second observation deck.",
  ],
  realityCheck: [
    "Myeongdong and the tower queue are a crowd-management problem, not Seoul.",
    "Summer humidity is a logistics problem. Plan interiors and subway at 14:00.",
    "North Seoul Tower is a view you pay for. Ansan or Inwangsan is a view you walk for.",
    "English menus are common; English small-talk is not a civic duty. Papago is infrastructure.",
    "A 'free suit rental' for a palace photo is a shop. Dress codes at palaces are real; the upsell is not.",
  ],
  zh: {
    title: "首尔旅行指南",
    subtitle: "一座留住了山的晚间首都。住在地铁旁。房间还诚实的话，凌晨两点也可以吃饭。",
    whyGo:
      "首尔是一座留住了山的晚间首都。宫殿是真的；凌晨两点的汤、河上的船、一年一变的街区也是真的。住在地铁旁。订一个宫殿的早晨。记住的是你回去过的那张桌子，不是排队上过的塔。",
    shortVersion: [
      "住在益善/钟路、汉南或延南的地铁旁——不要因为明信片看着中心就订塔对面的酒店。",
      "手机或卡上的 T-money。从仁川坐机场铁路是成年人的选择。",
      "早场订一座宫殿（景福或昌德）。走韩屋街区。塔是可选基建。",
      "去邻桌是上班或排练来的店，不要去游览车来的店。",
      "一间深夜厨房，胜过第二座观景台。",
    ],
  },
  beforeYouGo: [
    { title: "K-ETA / visa", body: "Rules move. Korea Immigration is the source. Screenshots of a 2023 blog are not." },
    { title: "T-money", body: "Load on a card or phone before the first subway. Cash on buses is the last century." },
    { title: "Translations", body: "Papago or Google offline packs. Palace signs are bilingual; market aunties are not." },
    { title: "Palaces", body: "Gyeongbokgung has a changing of the guard that is a crowd. Changdeokgung's secret garden needs a ticket. Pick one." },
  ],
  neighborhoods: [
    nbh("Ikseon-dong / Jongno", "Hanok alleys that still have offices around them. Touristy at 15:00; usable at 19:00 if you pick the side street.", {
      bestFor: ["First stay"],
      transit: "Jongno 3-ga, Anguk",
      combineWith: "One palace morning, then stay north of the boulevard.",
    }),
    nbh("Hannam / Itaewon ridge", "A slope of kitchens and a view without a ticket. Quieter than the old Itaewon script.", {
      bestFor: ["Evenings", "Return visitors"],
      transit: "Hangangjin, Itaewon, Noksapyeong",
      combineWith: "A river walk, not a club crawl mapped in 2014.",
    }),
    nbh("Yeonnam / Yeonhui", "Residential streets along a park-that-used-to-be-a-track. Cafes, but also actual dinner.", {
      bestFor: ["Slower days"],
      transit: "Hongik University, Gajwa",
      combineWith: "Hongdae only if you want that volume. You can skip it.",
    }),
    nbh("Seongsu", "Warehouses, coffee, and a Saturday that can feel like a mall. Go on a weekday if you can.", {
      bestFor: ["Design, lunch"],
      transit: "Seongsu, Ttukseom",
      combineWith: "One afternoon. Do not sleep here unless you like the newness.",
    }),
  ],
  attractions: [
    att("Changdeokgung", "The palace that still feels like a compound. Secret garden if you book.", {
      location: "Jongno",
      transport: "Anguk",
      price: "Ticketed",
    }),
    att("Inwangsan / Ansan", "The city's argument for remaining: a mountain you can do before lunch.", {
      location: "Northwest Seoul",
      price: "Free",
      reservation: "None",
      tier: "essential",
    }),
    att("National Museum of Korea", "A civic interior that rewards two hours, not a tower add-on.", {
      location: "Yongsan",
      transport: "Ichon",
      price: "Free collection",
      tier: "extra-time",
    }),
  ],
  thingsToDo: [
    { title: "A palace morning", body: "One. Early. Hanbok rental is optional and a shop.", duration: "2–3 hours", who: "First-timers" },
    { title: "A late stew", body: "If the room is still full of people who just got off work, stay.", duration: "1 hour", who: "Everyone" },
  ],
  foodIntro:
    "Seoul eats in rooms that do not close because the clock said so. Barbecue is a format, not the whole city. Learn one soup, one grill, and a convenience-store triangle for the airport railroad.",
  dishes: [
    dish("Kimchi jjigae", "The honesty test at 02:00.", { localName: "김치찌개", when: "Late", where: "A room that is still loud after midnight" }),
    dish("Kimbap", "Lunch infrastructure. A roll, not a personality.", { when: "Anytime" }),
    dish("Hanwoo or a neighborhood grill", "Sit where the exhaust is real. Do not book a 'experience' with a headset.", { when: "Dinner" }),
  ],
  venues: [
    venue("A Jongno late kitchen", "If the next table has company lanyards, the stew is for them.", { neighborhood: "Jongno", type: "Restaurant" }),
  ],
  stayIntro: "Near a subway entrance you would use at 01:00. Towers are for postcards.",
  stayAreas: [
    { name: "Jongno / Ikseon", bestFor: ["First stay"], commute: "Line 1 / 3 / 5", priceHint: "Mid to high", noise: "Alley evenings", safety: "Busy" },
    { name: "Hannam", bestFor: ["Quieter evenings"], commute: "Line 6", priceHint: "High", noise: "Low on the ridge", safety: "Fine" },
    { name: "Yeonnam", bestFor: ["Slower days"], commute: "Line 2", priceHint: "Mid", noise: "Cafe streets", safety: "Fine" },
  ],
  arrival: [
    { name: "ICN → AREX", time: "43–60 min to Seoul Station", cost: "Express dearer; all-stop is enough", how: "AREX. T-money or a ticket. Do not take a taxi across the city at rush hour.", bestFor: "Almost everyone", watchOut: "Limousine buses are slower than they look on the poster." },
    { name: "GMP → subway", time: "40–55 min", cost: "T-money", how: "Line 5 / 9 depending on hotel.", bestFor: "Domestic and some regional arrivals" },
  ],
  gettingAround: [
    { title: "Subway first", body: "T-money, numbered exits, and Kakao Map. Taxis are for hills with luggage and for 02:00 when you are done." },
    { title: "Walk the neighborhood, ride the city", body: "Do not walk from Jongno to Gangnam because the map looks short." },
  ],
  itineraries: [
    {
      title: "Three days: palace, mountain, late kitchen",
      days: 3,
      pace: "balanced",
      summary: "One palace, one mountain or museum, one neighborhood that is not Myeongdong.",
      daysPlan: [
        {
          label: "Day 1",
          theme: "Jongno",
          stops: [
            { time: "Morning", title: "Changdeok or Gyeongbok", detail: "Early. One palace." },
            { time: "Afternoon", title: "Ikseon / Seochon walk", detail: "Coffee, shade, a nap if jet lag wins." },
            { time: "Evening", title: "Late kitchen in Jongno", detail: "Stay north of the river." },
          ],
          rainPlan: "Palace interiors and a covered market. Skip the mountain.",
        },
        {
          label: "Day 2",
          theme: "Ridge or museum",
          stops: [
            { time: "Morning", title: "Inwangsan or the National Museum", detail: "Pick air or rooms." },
            { time: "Afternoon", title: "Hannam", detail: "Lunch on the slope." },
            { time: "Evening", title: "Stay in Hannam", detail: "Do not add a tower because the sky cleared." },
          ],
          rainPlan: "Museum is the day. A long lunch. Tower still skippable.",
        },
        {
          label: "Day 3",
          theme: "Yeonnam or Seongsu",
          stops: [
            { time: "Morning", title: "A park that used to be infrastructure", detail: "Yeonnam Gyeongui line park." },
            { time: "Afternoon", title: "One more neighborhood", detail: "Seongsu on a weekday if you can." },
            { time: "Evening", title: "Last stew", detail: "Near your hotel. Pack." },
          ],
          rainPlan: "Cafes that are actually kitchens, and the subway as the plan.",
        },
      ],
    },
  ],
  visa: {
    summary: "K-ETA / visa-free rules change. Confirm Korea Immigration.",
    details: ["An airline email is not the law."],
    officialUrl: "https://www.k-eta.go.kr/",
  },
  apps: [
    { name: "Kakao Map / Naver Map", purpose: "Walking and subway exits", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: true, necessary: "before", note: "Google Maps is weaker here." },
  ],
  culture: [
    { title: "Two hands", body: "Receive and pour with two hands when it matters. It is not a costume." },
    { title: "Late is normal", body: "The city is not failing because dinner is at 21:30 and stew is at 01:00." },
  ],
  safety: [
    { title: "Very walkable nights", body: "Ordinary capital caution. Taxi if you are done, not because the street is empty — often it is not." },
  ],
  scams: [
    { name: "Palace costume upsell", lookFor: "Free rental that becomes a shop", prevent: "Wear what the palace asks; skip the rest", ifItHappens: "Walk away" },
  ],
  emergency: [
    { label: "Police", value: "112" },
    { label: "Fire / ambulance", value: "119" },
  ],
  faq: [
    { q: "T-money or cash?", a: "T-money. Cash is a backup for a stall that still wants it." },
    { q: "Need the tower?", a: "No. A mountain on the edge of the city is the better view and the better morning." },
  ],
  sources: [
    { name: "VisitSeoul", url: "https://english.visitseoul.net/", usedFor: "Hours and palace tickets" },
    { name: "AREX", url: "https://www.arex.or.kr/", usedFor: "Airport railroad" },
  ],
});
