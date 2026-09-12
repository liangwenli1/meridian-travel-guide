import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const berlinGuide = assembleGuide({
  citySlug: "berlin",
  countrySlug: "germany",
  title: "Berlin Travel Guide",
  subtitle: "Low-rise, late nights, a gate you walk through. Stay in Neukölln or Prenzlauer Berg.",
  seoTitle: "Berlin Travel Guide 2026: Neighborhoods, U-Bahn, Museums & Itinerary",
  seoDescription:
    "A Berlin guide that treats Brandenburg as a walk-through: BVG as the spine, Museumsinsel as one island, döner as infrastructure, cash still in the room.",
  hero: {
    url: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=2000&q=80",
    alt: "Berlin TV tower and low-rise skyline",
    source: "Unsplash",
    author: "Unsplash",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com",
    location: "Berlin",
  },
  snapshot: {
    country: "Germany",
    languages: "German (English common in the center; greet in German first)",
    currency: "Euro (€)",
    timezone: "CET/CEST (UTC+1/+2)",
    population: "About 3.8 million in the city",
    dailyCost: "€55–80 shoestring · €110–180 comfortable · €280+ premium",
    bestMonths: "May–June, September",
    typicalStay: "4 days; more if you treat nights as the point and mornings as recovery",
    airports: "Berlin Brandenburg (BER)",
    stations: "Hauptbahnhof, Alexanderplatz, Gesundbrunnen, Ostbahnhof, Südkreuz",
    visaSummary: "Schengen / ETIAS when applicable.",
    plugType: "Type F / C",
    voltage: "230V, 50Hz",
    emergency: "112",
    tipping: "Round up. 5–10% in a sit-down if service was real. Not 20%.",
    cashVsCard: "Cards widely now. Cash still appears in bars and some kitchens. Keep a stash.",
    diningHours: "Lunch 12:00–14:30 · dinner from 19:00; clubs start after midnight, not at 23:00",
    walkability: "Excellent. Low-rise, bikes, a gate you can cross without a ticket.",
    transitQuality: "U-Bahn, S-Bahn, tram, bus — BVG as one system. The bike is a close second.",
    travelStyle: "Neighborhood-first, late-start — punishes a Brandenburg-as-a-day loop",
  },
  whyGo:
    "Berlin is a low city with a long night. The gate is real; so is a Museumsinsel ticket you should have picked as one museum, a bar that still wants cash, and a döner that feeds the block at 1am. Stay in Neukölln or Prenzlauer Berg. The Berlin you remember is a courtyard and a U-Bahn at 00:40, not a selfie at Brandenburg that ate the afternoon.",
  whoWillLoveIt: [
    "People who will take the U-Bahn and treat Brandenburg as a walk-through",
    "Museum-goers who pick one island building and then leave",
    "Travelers happy in Neukölln after dark and uninterested in a 23:00 bedtime",
    "Return visitors who skip the wall tour bus and walk a residential canal",
  ],
  whoMayStruggle: [
    "Anyone who treats Brandenburg Gate as a day and the Reichstag dome as a second day",
    "Visitors who need kitchens open at 17:30 and clubs open at 22:00",
    "Travelers who assume every bar takes a foreign card",
    "Peak-December markets people who booked nothing and hate cold",
  ],
  shortVersion: [
    "Stay in Neukölln or Prenzlauer Berg — not a Mitte hotel because the gate is in the listing photo.",
    "BVG: U-Bahn, S-Bahn, tram. Deutschlandticket or a day ticket. Validate if the ticket needs it.",
    "Brandenburg is a walk-through. Museumsinsel is one museum, not the island as a checklist.",
    "Döner is infrastructure. The English-sign queue is a different product.",
    "Nights start late. Dinner at 20:30 is early. Do not plan a 9:00 interior after a 4:00 club.",
  ],
  realityCheck: [
    "Brandenburg, Checkpoint Charlie, and the East Side Gallery at midday are crowd-management problems.",
    "Cash still appears. A card-only assumption is how you stand outside a bar that is otherwise perfect.",
    "Berghain is a maybe, not an itinerary. Build a night that does not depend on a door.",
    "The city is spread. Treptow to Charlottenburg is a planned move, not a stroll.",
    "December markets are the city as a festival. Fine if that is why you came. Not a quiet week.",
  ],
  zh: {
    title: "柏林旅行指南",
    subtitle: "低层、夜生活晚、一座走过去的门。住新克尔恩或普伦茨劳贝格。",
    whyGo:
      "柏林是一座夜很长的低层城市。门是真的；该只订一座的博物馆岛、仍要现金的酒吧、凌晨一点还在喂街区的肉夹馍也是真的。住新克尔恩或普伦茨劳贝格。记住的是院子和零点四十的地铁，不是吃掉一下午的勃兰登堡自拍。",
    shortVersion: [
      "住新克尔恩或普伦茨劳贝格——不要因为房源照片有门就订 Mitte 酒店。",
      "BVG：地铁、快轨、电车。日票或德国票。该打孔就打孔。",
      "勃兰登堡是路过。博物馆岛是一座馆，不是整岛打卡。",
      "肉夹馍是基础设施。英文招牌的队是另一种东西。",
      "夜生活很晚。八点半吃晚饭算早。不要在四点出门后订九点的馆。",
    ],
  },
  beforeYouGo: [
    { title: "BVG", body: "App or a paper ticket. Zones A and B cover almost everything you will do. Fare evasion fines are real." },
    { title: "Cash", body: "A card works more than it used to. Still carry euros for the bar that never got a reader." },
    { title: "One museum", body: "Museumsinsel: pick Neues or Alte Nationalgalerie. Not the island as a circuit." },
    { title: "Late is the default", body: "If you need an early city, this is the wrong rhythm. Mornings are for coffee and recovery." },
  ],
  neighborhoods: [
    nbh("Neukölln", "Canals, döner, a mix that still buys groceries. Nights are the point.", {
      bestFor: ["First stay"],
      transit: "U7, U8, S-Bahn, buses",
      combineWith: "Kreuzberg as a walk, Mitte as a visit.",
    }),
    nbh("Prenzlauer Berg", "Altbau, playgrounds, a quieter morning. Dinner you can walk to.", {
      bestFor: ["Repeat visitors"],
      transit: "U2, tram M10/M2",
      combineWith: "Mauerpark as a Sunday, not a destination hunt.",
    }),
    nbh("Kreuzberg", "A canal and a late kitchen. Visit hungry. Sleeping on the loudest street is a choice.", {
      bestFor: ["Evenings"],
      noise: "High on weekends",
      transit: "U1, U8, buses",
      combineWith: "Landwehrkanal as a walk, not a tour.",
    }),
    nbh("Mitte (visit)", "The gate, the island, the federal set. Visit. Sleeping here is a monument premium.", {
      bestFor: ["One morning"],
      noise: "Tour groups by day",
      transit: "U6, S-Bahn, Unter den Linden buses",
      combineWith: "Walk through Brandenburg. Do not linger as if it were a palace.",
    }),
  ],
  attractions: [
    att("Brandenburg Gate as a walk-through", "Fifteen minutes. The civic door. Then keep walking.", {
      price: "Free",
      reservation: "None",
      location: "Pariser Platz",
      transport: "Unter den Linden / Brandenburger Tor S-Bahn",
    }),
    att("One museum on the island", "Neues or Alte Nationalgalerie. Book a slot. Leave the rest of the island for another trip.", {
      location: "Museumsinsel",
      transport: "Hackescher Markt / Friedrichstraße",
    }),
    att("Tempelhofer Feld", "The runway as a park. Bikes, kites, a city that kept the airfield.", {
      price: "Free",
      reservation: "None",
      tier: "extra-time",
      location: "Tempelhof",
      transport: "U6 Platz der Luftbrücke / S-Bahn Tempelhof",
    }),
  ],
  thingsToDo: [
    { title: "Döner as a meal", body: "A neighborhood shop, not a landmark queue. Sit or walk. This is how the city eats at 1am.", duration: "30 min", who: "Everyone" },
    { title: "A night that starts after 22:00", body: "Dinner first. The door is later than you think. Have a second plan.", duration: "Evening", who: "Night people" },
  ],
  foodIntro:
    "Berlin eats döner, Vietnamese bowls, and a surprising number of good kitchens that are not German. A plate in Neukölln with conversation beats a beer hall performing the city for a group.",
  dishes: [
    dish("Döner", "Neighborhood spit, late, with the salad you actually want. Civic food.", { when: "Lunch or 1am" }),
    dish("A Vietnamese bowl", "Kreuzberg or Neukölln. Lunch infrastructure.", { when: "Lunch" }),
    dish("Currywurst", "Once, standing up, if you must. It is not a pilgrimage.", { when: "Afternoon" }),
  ],
  venues: [
    venue("A Neukölln kitchen", "If the next table has grocery bags, stay.", { neighborhood: "Neukölln", type: "Wine bar / bistro" }),
  ],
  stayIntro: "A U-Bahn stop and an Altbau with an explanation for the courtyard. Not a Mitte fourth floor whose rate is the gate.",
  stayAreas: [
    { name: "Neukölln", bestFor: ["First stay"], commute: "U7 / U8", priceHint: "Mid", noise: "Evenings", safety: "Ordinary city caution" },
    { name: "Prenzlauer Berg", bestFor: ["Quieter mornings"], commute: "U2 / tram", priceHint: "Mid to high", noise: "Low to moderate", safety: "High" },
    { name: "Kreuzberg", bestFor: ["Nights"], commute: "U1 / U8", priceHint: "Mid to high", noise: "High on weekends", safety: "Watch bags" },
  ],
  arrival: [
    { name: "BER → FEX / S-Bahn", time: "30–45 min", cost: "BVG / Deutsche Bahn into AB", how: "FEX or S9/S45 toward the ring. Follow trains, not touts. U-Bahn once you are in the city.", bestFor: "Almost everyone", watchOut: "Unlicensed rides at arrivals. BER is not a 15-minute hop to Neukölln." },
  ],
  gettingAround: [
    { title: "BVG as one system", body: "U-Bahn, S-Bahn, tram, bus. One ticket. Check the last train before you bet on a night." },
    { title: "Walk the gate, ride the rest", body: "The center is walkable. The city is not. Do not taxi from Neukölln to Charlottenburg as a habit." },
  ],
  itineraries: [
    {
      title: "Three days: walk-through, one island, a neighborhood night",
      days: 3,
      pace: "balanced",
      summary: "One gate as a crossing, one museum, one residential grid. Checkpoint Charlie is not a day.",
      daysPlan: [
        {
          label: "Day 1",
          theme: "Mitte without making it the hotel",
          stops: [
            { time: "Morning", title: "Brandenburg as a walk-through", detail: "Keep walking. Unter den Linden is a boulevard." },
            { time: "Afternoon", title: "Prenzlauer Berg lunch and a rest", detail: "Not a second monument." },
            { time: "Evening", title: "Dinner near the hotel", detail: "Walk home. Night starts later." },
          ],
          rainPlan: "The museum you booked, or a long cafe. The gate will still be there.",
        },
        {
          label: "Day 2",
          theme: "One island building, then leave",
          stops: [
            { time: "Morning", title: "Neues or Alte Nationalgalerie", detail: "The slot you booked. One." },
            { time: "Afternoon", title: "Canal walk in Kreuzberg or a rest", detail: "The island compounds." },
            { time: "Evening", title: "Neukölln table, then a bar that might want cash", detail: "No beer-hall theatre." },
          ],
          rainPlan: "Stay inside the museum longer. Add a second cafe, not Checkpoint Charlie.",
        },
        {
          label: "Day 3",
          theme: "Tempelhof, or a slower Kiez",
          stops: [
            { time: "Morning", title: "Tempelhofer Feld or a market", detail: "Pick one. Both are the city unused as a postcard." },
            { time: "Afternoon", title: "Stay with that choice", detail: "Do not add Potsdam as a third thought." },
            { time: "Evening", title: "Last döner near the hotel", detail: "Pack. Or go out late and pack in the morning." },
          ],
          rainPlan: "Covered market and a long table. Potsdam palaces still work in rain if you already committed.",
        },
      ],
    },
  ],
  visa: {
    summary: "Schengen / ETIAS when applicable.",
    details: ["Confirm official sources."],
    officialUrl: "https://www.visitberlin.de/",
  },
  apps: [
    { name: "BVG / Jelbi", purpose: "U-Bahn, S-Bahn, the last tram", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: false, necessary: "before", note: "Buy in the app. Validate paper. Fare inspectors are not a myth." },
  ],
  culture: [
    { title: "Direct is polite", body: "German conversation skips the cushion. It is not a slight. Greet with Hallo before you switch." },
    { title: "Late is not rude", body: "Dinner at 20:30 is early. A club at 23:00 is still the queue outside. Adjust or go to bed." },
  ],
  safety: [
    { title: "Bags and bikes", body: "Pickpockets on U-Bahn and at gates. Ordinary caution after dark. The danger is theft and a missed last train, not a general menace." },
  ],
  scams: [
    { name: "Checkpoint Charlie photo men and fake petitions", lookFor: "Costumes, clipboards at the gate, unsolicited 'help' with tickets", prevent: "A flat no; walk through", ifItHappens: "Keep walking; do not pay for a photo of a replica booth" },
  ],
  emergency: [{ label: "Emergency", value: "112" }],
  faq: [
    { q: "Must I spend a day at Brandenburg Gate?", a: "No. Walk through. The gate is a crossing, not a palace." },
    { q: "Cash or card?", a: "Card often works. Carry cash anyway. The best bar may not have a reader." },
  ],
  sources: [
    { name: "BVG", url: "https://www.bvg.de/", usedFor: "Transit" },
    { name: "Visit Berlin", url: "https://www.visitberlin.de/", usedFor: "Hours" },
  ],
});
