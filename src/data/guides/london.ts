import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const londonGuide = assembleGuide({
  citySlug: "london",
  countrySlug: "united-kingdom",
  title: "London Travel Guide",
  subtitle: "A capital of villages on the Tube. Stay in one. Ride the rest.",
  seoTitle: "London Travel Guide 2026: Neighborhoods, Tube, Food & Itinerary",
  seoDescription:
    "A London guide written like a weekday: parks, pubs, one museum, and the Tube that actually moves you. ETA, contactless, and a three-day plan.",
  hero: {
    url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2000&q=80",
    alt: "Houses of Parliament and the Thames at dusk",
    source: "Unsplash",
    author: "Benjamin Davies",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com/photos/Oja2ty_9ZLM",
    location: "Westminster, London",
  },
  snapshot: {
    country: "United Kingdom",
    languages: "English",
    currency: "Pound sterling (£)",
    timezone: "GMT / BST (UTC+0/+1)",
    population: "About 8.8 million in Greater London",
    dailyCost: "£70–100 shoestring · £160–260 comfortable · £400+ premium",
    bestMonths: "May–June, September–early October",
    typicalStay: "4–5 days in the city; a day trip is extra",
    airports: "Heathrow (LHR) default; Gatwick, City, Stansted, Luton",
    stations: "King's Cross, St Pancras, Paddington, Waterloo, London Bridge, Victoria",
    visaSummary: "ETA for many visa-free passports. Use GOV.UK, not a third-party form.",
    plugType: "Type G",
    voltage: "230V, 50Hz",
    emergency: "999 or 112",
    tipping: "Optional. 10–12.5% only if service is not already on the bill.",
    cashVsCard: "Contactless everywhere. Daily capping on Tube and bus.",
    diningHours: "Lunch 12:00–14:30 · dinner from 18:30",
    walkability: "Excellent in Zone 1 if you accept rain. The city is villages on rails.",
    transitQuality: "The Tube is the skeleton. Delayed, expensive, still the right tool.",
    travelStyle: "Neighborhood-first, park-led — punishes a Westminster-only loop",
  },
  whyGo:
    "London is a working capital that happens to be historic. The river is real; so is the Jubilee line at 8:15, a pub that still does a weekday lunch, and Oxford Street as a mall with a postcode. Stay somewhere you can walk to dinner. Book the one museum you will actually finish. The city you remember is a park and a neighborhood, not a palace photographed in a scrum.",
  whoWillLoveIt: [
    "Walkers who treat a Zone 1 crossing as a commute, not a hike",
    "People who will sit in a park with a sandwich and call it a meal",
    "Museum-goers who pick one wing of the British Museum and leave",
    "Return visitors happy to spend a day in Hackney or Peckham and skip the Eye",
  ],
  whoMayStruggle: [
    "Anyone who needs empty sidewalks and soft voices after 18:00",
    "Travelers who melt when the Central line is delayed and no one apologizes",
    "People who want dinner at 17:30 in a kitchen that is still setting tables",
    "Visitors hoping Westminster feels like a neighborhood after the last tour bus",
  ],
  shortVersion: [
    "Stay in Zone 1 or inner 2 where you can walk home after 23:00 — Hackney, Bermondsey, Marylebone — not a Paddington hotel because the airport train stops there.",
    "Tap contactless. Daily capping exists. An Oyster is a backup, not a personality.",
    "Book the British Museum only if you will finish a wing. Walk the parks. The Eye is a logistics product.",
    "A pub lunch is infrastructure. Service charge is often already on the bill — do not tip as if it were Manhattan.",
    "One neighborhood in the evening beats a second palace.",
  ],
  realityCheck: [
    "Westminster, the Eye queue, and the chain-restaurant belt around Covent Garden are a crowd-management problem, not London.",
    "Pickpockets work Oxford Street, the Tube at rush hour, and any queue that photographs well.",
    "Heathrow Express is speed you pay for. Elizabeth line is usually the adult choice. Stansted is a different county.",
    "August empties some kitchens and fills the remaining tourist ones. January is dark by 16:30 and still worth it if you like museums.",
    "A man in a high-vis vest selling 'skip the queue' on the pavement is not TfL.",
  ],
  zh: {
    title: "伦敦旅行指南",
    subtitle: "一座建在地铁上的村庄首都。住在一个村里，其余坐车。",
    whyGo:
      "伦敦是碰巧有历史的工作首都。河是真的；早上八点十五的银禧线、还做工作日午餐的酒馆、作为带邮编商场的牛津街也是真的。住在能走到晚饭的地方。订一座你真会看完的博物馆。记住的是公园和一个街区，不是人堆里拍的宫殿。",
    whoWillLoveIt: [
      "把一区步行当通勤、不当远足的人",
      "能在公园里吃一份三明治并称之为一餐的人",
      "会选大英博物馆一个侧厅然后离开的人",
      "愿意在 Hackney 或 Peckham 过一天、不去摩天轮的回头客",
    ],
    whoMayStruggle: [
      "傍晚还需要空人行道和轻声的人",
      "中央线晚点也没人道歉就会融化的人",
      "想在五点半吃晚饭、而厨房还在摆台的人",
      "指望威斯敏斯特在最后一辆游览车走后仍像一个街区的人",
    ],
    shortVersion: [
      "住在一区或内二区、二十三点后还能走回家的地方——Hackney、Bermondsey、Marylebone——不要因为机场列车停靠就订 Paddington。",
      "轻触刷卡。有每日封顶。Oyster 是备选，不是性格。",
      "只有真会看完一个侧厅才订大英。公园走路。伦敦眼是后勤产品。",
      "酒馆午餐是基建。服务费常常已经在账单上——别按曼哈顿那套给小费。",
      "一个晚上的一个街区，胜过第二座宫殿。",
    ],
    realityCheck: [
      "威斯敏斯特、摩天轮队列、Covent Garden 周围的连锁带是人群管理问题，不是伦敦。",
      "扒手在牛津街、高峰地铁、任何上镜的队列里工作。",
      "Heathrow Express 是花钱买的速度。伊丽莎白线通常是成年人的选择。Stansted 是另一个郡。",
      "八月空掉一部分厨房，填满剩下的游客店。一月四点半就天黑，爱博物馆的人仍值得来。",
      "人行道上穿荧光背心卖「插队」的人不是交通局。",
    ],
  },
  beforeYouGo: [
    { title: "ETA / visa", body: "Many travelers now need an ETA from the official UK government site. Third-party sites add fees. Read GOV.UK." },
    { title: "Contactless", body: "Tap a card or phone on Tube and bus. Daily and weekly capping exists. Oyster is a backup." },
    { title: "Reservations", body: "Theatre via official venues or TodayTix. British Museum is free; some exhibitions ticketed. The Eye is optional infrastructure." },
    { title: "Neighborhood math", body: "A cheaper hotel in Zone 3 with a 35-minute Tube to dinner is not cheaper in hours. Price the walk home after 23:00." },
  ],
  neighborhoods: [
    nbh("Hackney / London Fields", "Independent kitchens, a park that actually gets used, and a Saturday market that is still a market.", {
      bestFor: ["Food", "Return visitors"],
      price: "Mid to high",
      transit: "London Fields, Hackney Central, Bethnal Green",
      combineWith: "Columbia Road only if you like queues; otherwise stay west of the park.",
    }),
    nbh("Bermondsey / London Bridge", "Maltings, the river path, and food halls that feed locals at lunch as well as visitors.", {
      bestFor: ["First-timers who will walk"],
      transit: "London Bridge, Bermondsey",
      combineWith: "Tate Modern as a building, then leave the South Bank scrum.",
    }),
    nbh("Marylebone", "Residential streets north of Oxford Street that still have a butcher and a bookshop.", {
      bestFor: ["Quieter nights", "First stay"],
      price: "High",
      transit: "Baker Street, Marylebone, Bond Street",
      combineWith: "Regent's Park, not Oxford Street as a day.",
    }),
    nbh("Peckham / Nunhead", "Buses, a rooftop, and a high street that did not ask to be a destination.", {
      bestFor: ["Repeat visitors"],
      price: "Mid",
      transit: "Peckham Rye, Nunhead",
      combineWith: "One evening. Do not 'do South London' as a checklist.",
    }),
  ],
  attractions: [
    att("British Museum", "A free civic interior that rewards one wing, not a completionist death march.", {
      location: "Bloomsbury",
      transport: "Russell Square / Tottenham Court Road",
      price: "Free; exhibitions ticketed",
      reservation: "Free timed entry recommended",
      alternative: "Sir John Soane's if you want a smaller room",
    }),
    att("Tate Modern", "A power station that is better as architecture and a turbine hall than as a race through every floor.", {
      location: "Bankside",
      transport: "Southwark / London Bridge",
      price: "Free collection; paid shows",
      tier: "extra-time",
    }),
    att("Hampstead Heath", "The city's argument for remaining: ponds, a hill, and a skyline you did not pay for.", {
      location: "Hampstead / Highgate",
      transport: "Hampstead / Gospel Oak",
      price: "Free",
      reservation: "None",
      tier: "essential",
    }),
  ],
  thingsToDo: [
    { title: "A park sandwich", body: "Regent's, London Fields, or the Heath. This is not filler. It is how the city eats at 13:00.", duration: "1–2 hours", who: "Everyone" },
    { title: "One paid interior", body: "Book it. Leave when you are full. Do not add the Eye because the weather cleared.", duration: "2–3 hours", who: "First-timers" },
  ],
  foodIntro:
    "London eats in pubs, in markets that still sell vegetables, and in rooms that do not need a view of the river. Sit down for one meal a day. The rest can be a counter.",
  dishes: [
    dish("Sunday roast", "A plate that still structures the weekend if you book the right room.", { when: "Sunday lunch", where: "A pub that cooks, not a chain with a fireplace photo" }),
    dish("A market lunch", "Whatever is on the griddle at Borough or Maltby if you go before the selfie peak.", { when: "Weekday lunch", where: "Bermondsey / Borough before 12:30" }),
    dish("A proper curry", "Not a costume. Go where the lunch crowd is from the offices next door.", { where: "East or west — follow the steam, not the neon" }),
  ],
  venues: [
    venue("A weekday pub lunch", "If they still do a board at 12:30 on a Tuesday, the kitchen is real.", { neighborhood: "Marylebone or Hackney", type: "Pub" }),
  ],
  stayIntro: "Stay where the walk home after last Tube is still a street with lights, not a dual carriageway.",
  stayAreas: [
    { name: "Hackney", bestFor: ["Food", "Evenings"], commute: "Overground into Liverpool Street", priceHint: "Mid to high", noise: "Saturday market mornings", safety: "Busy, ordinary" },
    { name: "Bermondsey", bestFor: ["First-timers"], commute: "Jubilee / Northern", priceHint: "High", noise: "Railway arches", safety: "Fine" },
    { name: "Marylebone", bestFor: ["Quieter nights"], commute: "Bakerloo / Elizabeth", priceHint: "High", noise: "Low on back streets", safety: "High" },
  ],
  arrival: [
    { name: "Heathrow → Elizabeth line", time: "35–50 min to Zone 1", cost: "Contactless, capped with the rest of the day", how: "Follow purple signs. No ticket machine theatre.", bestFor: "Almost everyone", watchOut: "Heathrow Express is only worth it if someone else is paying." },
    { name: "Gatwick → Thameslink", time: "45–60 min", cost: "Contactless", how: "Thameslink to London Bridge or St Pancras.", bestFor: "South and central hotels", watchOut: "Gatwick Express is a brand, not a necessity." },
  ],
  gettingAround: [
    { title: "Tap in, tap out", body: "Contactless on Tube, bus, Elizabeth line. Buses are tap-in only. Daily capping is the adult pass." },
    { title: "Walk Zone 1", body: "Between the parks and the river, walking is faster than a two-change Tube. Rain is not a veto." },
  ],
  itineraries: [
    {
      title: "Three days: park, interior, east",
      days: 3,
      pace: "balanced",
      summary: "One civic interior, two neighborhoods, one park. No Eye. No second palace.",
      daysPlan: [
        {
          label: "Day 1",
          theme: "West and a park",
          stops: [
            { time: "Morning", title: "Marylebone / Regent's Park", detail: "Coffee, then the park. Do not start in Westminster." },
            { time: "Afternoon", title: "British Museum, one wing", detail: "Leave when you are full." },
            { time: "Evening", title: "Dinner in the same neighborhood", detail: "Walk home. Do not cross town for a view." },
          ],
          rainPlan: "Museum first, covered arcades, a pub lunch. The park can wait.",
        },
        {
          label: "Day 2",
          theme: "River and Bermondsey",
          stops: [
            { time: "Morning", title: "Tate Modern as a building", detail: "Turbine hall, then out." },
            { time: "Lunch", title: "Maltby or a Bermondsey counter", detail: "Before 12:30." },
            { time: "Evening", title: "Stay south of the river", detail: "One more kitchen. No West End add-on unless you booked theatre." },
          ],
          rainPlan: "Tate paid show if you care; otherwise Borough under the roof and a long lunch.",
        },
        {
          label: "Day 3",
          theme: "Hackney or the Heath",
          stops: [
            { time: "Morning", title: "London Fields or Hampstead Heath", detail: "Pick one green. Do not collect both." },
            { time: "Afternoon", title: "A high street that is not Oxford Street", detail: "Hackney or Hampstead village." },
            { time: "Evening", title: "Last dinner in the neighborhood you slept in", detail: "Pack. Do not add Greenwich." },
          ],
          rainPlan: "A covered market and a long breakfast. Skip the Heath if it is soup.",
        },
      ],
    },
  ],
  visa: {
    summary: "ETA for many visa-free passports. Confirm on GOV.UK.",
    details: ["Third-party ETA sites add fees.", "An airline email is not the law."],
    officialUrl: "https://www.gov.uk/eta",
  },
  apps: [
    { name: "TfL Go / Citymapper", purpose: "Live Tube", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: false, necessary: "before", note: "Citymapper still earns its keep in the rain." },
  ],
  culture: [
    { title: "Queueing is civic", body: "You wait. You do not film the wait as content." },
    { title: "The park is the living room", body: "Sitting on grass at 13:00 is not wasting the city." },
  ],
  safety: [
    { title: "Ordinary capital", body: "Bag in front on the Tube. Ignore clipboard petitions. Night buses are public space; still sit where you can see the door." },
  ],
  scams: [
    { name: "Fake high-vis helpers", lookFor: "Unsolicited help at ticket gates and airport platforms", prevent: "Use the machine or the staff in TfL uniform", ifItHappens: "Walk away; do not hand a card" },
  ],
  emergency: [
    { label: "Police / ambulance / fire", value: "999" },
  ],
  faq: [
    { q: "Do I need the London Pass?", a: "Almost never, if you will walk parks and use free interiors. Run the math only if you already booked three paid tickets." },
    { q: "Oyster or contactless?", a: "Contactless. Oyster if your bank is difficult abroad." },
    { q: "Is the Eye worth it?", a: "Only if a view is the point of the trip. The Heath is free and higher in weather that cooperates." },
  ],
  sources: [
    { name: "Transport for London", url: "https://tfl.gov.uk/", usedFor: "Fares and status" },
    { name: "GOV.UK ETA", url: "https://www.gov.uk/eta", usedFor: "Entry" },
    { name: "British Museum", url: "https://www.britishmuseum.org/", usedFor: "Hours" },
  ],
});
