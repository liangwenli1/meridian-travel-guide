import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const kyotoGuide = assembleGuide({
  citySlug: "kyoto",
  countrySlug: "japan",
  title: "Kyoto Travel Guide",
  subtitle: "One temple morning. Stay Nishijin, Demachiyanagi, or near Karasuma — not Gion. Buses and an IC card. Do not stack Fushimi, Kiyomizu, and Arashiyama.",
  seoTitle: "Kyoto Travel Guide 2026: Nishijin, Buses, Fushimi Climb, HARUKA, Nara",
  seoDescription:
    "A Kyoto guide for people who will sleep in Nishijin or near Karasuma, ride the bus, climb Fushimi until the crowd thins, and treat Nara as a full day — not a Gion camera line.",
  hero: {
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2000&q=80",
    alt: "Pagoda and wooden streets in Kyoto",
    source: "Unsplash",
    author: "Su San Lee",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com/photos/Kyoto",
    location: "Kyoto",
  },
  snapshot: {
    country: "Japan",
    languages: "Japanese (English at stations and major temples; thinner in Nishijin)",
    currency: "Japanese yen (¥)",
    timezone: "JST (UTC+9) — no daylight saving",
    population: "About 1.45 million; the basin is the real map",
    dailyCost: "¥10,000–14,000 shoestring · ¥18,000–28,000 comfortable · ¥45,000+ premium",
    bestMonths: "Late March–April, late October–November. August is wet heat.",
    typicalStay: "3–4 days; Nara is a full extra day, not an afternoon",
    airports: "Kansai (KIX) then HARUKA; Itami (ITM) for some domestic",
    stations: "Kyoto Station, Karasuma line, the bus as the last mile",
    visaSummary: "Japan entry rules. Confirm Immigration Services Agency, not a 2019 blog.",
    plugType: "Type A / B",
    voltage: "100V, 60Hz in Kansai",
    emergency: "110 police · 119 fire / ambulance",
    tipping: "Do not tip. It confuses the room.",
    cashVsCard: "Cards wider than a decade ago. Cash still solves small temples, counters, and the stall that wants coins.",
    diningHours: "Lunch 11:30–14:00 · dinner from 17:30, last order is real, earlier than Tokyo",
    walkability: "Excellent in pockets; buses and hills between them. The basin is not a single stroll.",
    transitQuality: "Buses are the civic spine. Subway is a north–south sketch. IC card everywhere.",
    travelStyle: "One-temple-morning, neighborhood-evening — punishes a Gion hotel and a three-shrine stack",
  },
  whyGo:
    "Kyoto is a working city that happens to hold wood and gravel. The temples are real; so is a bus that does not come, a lunch that ends at 14:00, and a residential west that goes quiet by 21:00. Stay in Nishijin, Demachiyanagi, or near Karasuma — not Gion. Book one temple morning. Climb Fushimi until the crowd thins. Do not stack Fushimi, Kiyomizu, and Arashiyama in one day. The city you remember is a street after the schoolkids go home, not a camera line you queued for.",
  whoWillLoveIt: [
    "People who will take a bus and not call it a failure",
    "Walkers who want gravel paths before 9:00 and will sit in a compound",
    "Travelers who will eat lunch as the main meal and accept an early kitchen",
    "Return visitors happy in Nishijin and uninterested in another temple stamp",
  ],
  whoMayStruggle: [
    "Anyone who booked a Gion room because the listing said geisha district",
    "Visitors who think Fushimi, Kiyomizu, and Arashiyama fit between breakfast and dinner",
    "People who need Tokyo hours — late kitchens, 24-hour everything — or who wilt at humidity and a bus map",
    "Travelers hoping Hanamikoji at 17:00 feels like a neighborhood rather than a camera line",
  ],
  shortVersion: [
    "Stay in Nishijin, Demachiyanagi, or near Karasuma — not a hotel on the Gion camera line.",
    "ICOCA before the first bus. Buses are the civic spine. HARUKA from KIX is the adult arrival.",
    "One temple morning. Fushimi: climb until the crowd thins. Daitoku-ji subtemples if you want a compound.",
    "Lunch is the meal. Kitchens close early. Do not stack Fushimi + Kiyomizu + Arashiyama.",
    "Nara is a full day. Arashiyama bamboo is a corridor with a queue — the river west of it if you go.",
  ],
  realityCheck: [
    "Fushimi's lower torii, Kiyomizu's approach, and Gion at dusk are crowd-management problems.",
    "Stacking Fushimi, Kiyomizu, and Arashiyama in one day is a logistics error, not a must-see.",
    "August is wet heat that cancels midday walking. Plan interiors and buses at 14:00.",
    "Greet and lower your voice in compounds. The gravel is not a runway. A geisha is a person going to work.",
    "Kyoto Station is a city. Do not sleep in it unless your train forces you.",
  ],
  zh: {
    title: "京都旅行指南",
    subtitle: "一个寺庙早晨。住西阵、出町柳或乌丸附近，不要住祗园。公交加交通卡。不要一天叠伏见、清水和岚山。",
    whyGo:
      "京都是一座碰巧装着木与砂的工作城市。寺庙是真的；不来的公交、两点结束的午餐、九点就安静的西边住宅区也是真的。住西阵、出町柳或乌丸附近——不要住祗园。订一个寺庙早晨。伏见要爬到人群变薄。不要一天叠伏见、清水和岚山。记住的是放学后的街，不是你排过的镜头队。",
    whoWillLoveIt: [
      "会坐公交且不称之为失败的人",
      "九点前要砂石路、并愿意在寺院里坐下来的步行者",
      "把午餐当正餐、接受厨房早收的人",
      "愿意待在西阵、对再盖一个寺庙章没兴趣的回头客",
    ],
    whoMayStruggle: [
      "因为房源写了花街就订祗园房间的人",
      "觉得伏见、清水、岚山能塞进早晚饭之间的人",
      "需要东京作息——晚厨房、二十四小时——或受不了湿度和公交图的人",
    ],
    shortVersion: [
      "住西阵、出町柳或乌丸附近——不要订祗园镜头带上的酒店。",
      "上第一班公交前备好 ICOCA。公交是市民脊梁。从关西机场坐 HARUKA 是成年人的到达。",
      "一个寺庙早晨。伏见：爬到人群变薄。想要寺院空间就去大德寺塔头。",
      "午餐是正餐。厨房早关。不要叠伏见＋清水＋岚山。",
      "奈良是一整天。岚山竹林是带队列的走廊——若去，走它西边的河。",
    ],
    realityCheck: [
      "伏见下层鸟居、清水参道、黄昏祗园是人群管理问题。",
      "一天叠伏见、清水和岚山是后勤错误，不是必看。",
      "八月是取消中午步行的湿热。十四点安排室内和公交。",
      "寺院里问好、放低声音。砂石不是跑道。艺伎是去上班的人。",
    ],
  },
  beforeYouGo: [
    { title: "IC card and buses", body: "ICOCA on a card or in a phone wallet before the first gate. Suica works. Buses are the civic spine. Cash on the fare box is the last century." },
    { title: "Where you sleep", body: "Nishijin, Demachiyanagi, or near Karasuma. A Gion room is a surcharge for a camera line you can walk through at 8:00 if you must." },
    { title: "One temple morning", body: "Open early. Gravel before the coaches. Last entry is earlier than the website's close. Ten stamps is a sport, not a trip." },
    { title: "Do not stack the east and the west", body: "Fushimi is a mountain. Kiyomizu is a slope. Arashiyama is a different basin edge. One of them in a day. Nara is a full extra day." },
    { title: "Lunch is the meal", body: "11:30–14:00. Kaiseki and small counters want a name. Convenience food is not a failure on HARUKA day. Dinner is earlier than Tokyo." },
  ],
  neighborhoods: [
    nbh("Nishijin", "Textile ward west of the palace grid. Low houses, dyeing workshops, dinners that end on time.", {
      bestFor: ["Repeat visitors", "Quiet nights"], price: "Mid to high", noise: "Low after 21:00",
      transit: "Bus; Imadegawa / Kitano", stayNights: "3–5",
      combineWith: "Daitoku-ji in the morning, not a Gion add-on.",
    }),
    nbh("Demachiyanagi / along the Kamo", "River paths, a station that is a hinge, dinner that ends on time.", {
      bestFor: ["First stay"], price: "Mid to high", noise: "Low; river evenings in summer",
      transit: "Keihan Demachiyanagi, buses", stayNights: "3–4",
      combineWith: "Philosopher's Path only at 7:00, not at 14:00.",
    }),
    nbh("Near Karasuma", "The civic grid. Subway, department-store basements, a walk that is not a wooden street.", {
      bestFor: ["Subway people", "First stay"], price: "High", noise: "Moderate on the arcade",
      transit: "Karasuma line, Kyoto Station if you pick the south end", stayNights: "3–4",
      combineWith: "One temple morning by bus, back for lunch. Sleep here, not in Gion.",
    }),
    nbh("Higashiyama (early only)", "The postcard slope. Sleep elsewhere. Visit at open. Out by lunch.", {
      bestFor: ["One morning"], price: "High", noise: "High after 10:00",
      transit: "Keihan; buses to Kiyomizu", stayNights: "Skip",
      combineWith: "Out by lunch. Do not stay for the lantern photos. Do not add Fushimi and Arashiyama.",
    }),
    nbh("Arashiyama (as a half-day)", "Bamboo is a corridor with a queue. The river west of it is the point if you go.", {
      bestFor: ["Extra time"], price: "Mid to high if you sleep there — don't, on a short trip", noise: "Extreme on the grove path by 10:00",
      transit: "JR Sagano / Randen", stayNights: "Skip unless the trip is the west",
      combineWith: "Morning only. Skip if your days are three. Never with Fushimi and Kiyomizu.",
    }),
    nbh("Gion / Hanamikoji (visit)", "A camera line. Sleeping here is a price for a street that does not clock off. Visit at 8:00 if you must see wood.", {
      bestFor: ["One early walk"], price: "High", noise: "Extreme at dusk",
      transit: "Buses; Keihan Gion-Shijo", stayNights: "Skip",
      combineWith: "Walk through at open. Do not chase anyone in kimono. Eat in Nishijin or Karasuma.",
    }),
  ],
  attractions: [
    att("Fushimi Inari as a mountain", "A shrine on a hill. The lower gates are a queue. The point is to climb until the crowd thins.", {
      location: "Fushimi", transport: "JR Inari from Kyoto Station",
      tips: ["Keep climbing. The lower torii are the postcard and the problem. Water. Quiet on the path."],
      mistakes: ["Only the first 200 metres. Stacking Kiyomizu and Arashiyama the same day."],
      worthIt: "Yes if you climb. No as a photo alley between trains.", tier: "essential",
    }),
    att("Daitoku-ji subtemples", "Gravel and rooms that still feel like a compound, not a slope of souvenirs. Pay the subtemple that is open. Sit.", {
      location: "North Kyoto", transport: "Bus / Kitaoji; not a casual add-on from Gion",
      tips: ["Greet. Voice down. One or two subtemples, not a stamp rally."],
      mistakes: ["Treating the compound as a park. Drones. A loud phone on gravel."],
      worthIt: "Yes if you came for Kyoto as rooms. Skip if you only wanted gates.", tier: "essential",
    }),
    att("Kiyomizu-dera (conditional)", "A veranda and a slope of shops. Go at open or skip. It is not a third stamp after Fushimi and before a train to bamboo.", {
      location: "Higashiyama", transport: "Bus; Keihan then a hill",
      tips: ["Out before the kimono rental lane fully wakes. The hall is the point; the souvenir stair is the tax."],
      mistakes: ["Fushimi + Kiyomizu + Arashiyama. Noon on the slope."],
      worthIt: "Yes at open on a day that is only the east. No as part of a three-shrine stack.", tier: "conditional",
    }),
    att("Philosopher's Path / Ginkaku-ji early", "A canal path and a silver pavilion. At 7:00 it is a walk. At 14:00 it is a queue with moss.", {
      location: "Northeast", transport: "Bus; Keihan then a walk from Demachiyanagi if you like",
      tips: ["Start at the north if you sleep in Demachiyanagi. Do not collect every side temple."],
      mistakes: ["Midday in August. A full Higashiyama south stack after."],
      worthIt: "Yes early. No as a noon canal selfie.", tier: "conditional",
    }),
    att("Arashiyama: river west of the bamboo", "The grove is a corridor with a queue. If you go west, the river and the hill are the visit. Morning only.", {
      location: "West Kyoto", transport: "JR Sagano to Saga-Arashiyama, or Randen",
      tips: ["Walk the bamboo once. Then leave it for the river. Tenryu-ji garden if you still have a ticket in you."],
      mistakes: ["The grove as the whole day. Adding Fushimi and Kiyomizu. A rickshaw as a default."],
      worthIt: "Yes as a half-day if your trip has room. Skip on a three-day first stay.", tier: "extra-time",
    }),
    att("Kyoto National Museum or a Nishijin workshop", "The civic interior when the hills are full. Objects, not a slope.", {
      location: "Higashiyama south / Nishijin", transport: "Bus or Keihan to the museum; bus in Nishijin",
      tips: ["Check closing days. Look; buy only if you want the object."],
      mistakes: ["Skipping every interior because a temple is free to photograph from the gate."],
      worthIt: "Yes when weather or crowds cancel a hill. The museum is Kyoto without a queue of gates.", tier: "extra-time",
    }),
  ],
  thingsToDo: [
    { title: "One temple, properly", body: "Sit. Do not collect stamps as a sport. Greet. Voice down.", duration: "2–3 hours", who: "Everyone" },
    { title: "A Kamo hour at 17:50", body: "The river costs nothing and is not a temple. Summer platforms if they are out.", duration: "1 hour", who: "Everyone" },
    { title: "Bus as the civic spine", body: "IC tap. Two stops of walking often beats a 25-minute wait. Learn one line, not a taxi habit.", duration: "Ongoing", who: "Everyone" },
    { title: "Lunch as the meal", body: "Obanzai, a bowl, a tofu pot. 12:15. Missing it is a planning error.", duration: "90 minutes", who: "Eaters" },
    { title: "Nishijin as a walk, not a shopping list", body: "Textile streets, low houses, a workshop window. Do not film dyers as content.", duration: "2 hours", who: "Repeat visitors" },
    { title: "A sento or a long sit in a subtemple", body: "Wash first if it is a bath. Quiet. This is infrastructure, not a spa day.", duration: "90 minutes", who: "Anyone whose feet met the slope" },
  ],
  hiddenGems: [
    { title: "A Daitoku-ji subtemple you actually sit in", body: "Pay, sit, leave. The compound is the gem, not a secret Instagram garden.", watchOut: "Which subtemples are open changes. Confirm. Voice down." },
    { title: "Demachi Masugata shotengai", body: "A covered arcade that still feeds the block. Lunch, fruit, out.", watchOut: "It is not a hidden village. It is a neighborhood mall. One weekday close is common." },
    { title: "Shimogamo in the morning", body: "A shrine in a wood at the Kamo fork. Residents jog. You walk.", watchOut: "Festival days are a different density. Do not treat the wood as a picnic set during rites." },
  ],
  localExperiences: [
    { title: "Convenience-store breakfast, then a bus", body: "This is a Kyoto morning. The temple can wait until the first bus you actually catch." },
    { title: "Nishiki as a market, not a trophy lane", body: "Buy what you will finish. Grazing ten samples in the aisle is how you become the blockage." },
    { title: "Quiet as manners in a compound", body: "Greet. Voice down. A geisha is going to work — do not follow." },
  ],
  everydayLife: [
    { title: "Morning", body: "Buses, bakeries, gravel at open. Gion is empty enough to walk if you insist on wood." },
    { title: "Afternoon", body: "The gap after lunch when kitchens rest. Heat in August is a logistics problem. Museum, bus, nap." },
    { title: "Night", body: "Dinner from 17:30. Last order is real. Nishijin goes quiet. Gion stays a camera line. Know your last bus." },
  ],
  foodIntro:
    "Kyoto eats early. Tofu, pickled vegetables, a bowl that is not a performance. Lunch is the honest meal. Dinner is often over by 21:00 in the west. Sit where the next table is not photographing the garden first. Kaiseki is a booked night, not a default.",
  dishes: [
    dish("Obanzai", "Small plates that taste like a house, not a kaiseki stage. Vegetables, a pickle, a bit of fish.", {
      localName: "おばんざい", taste: "Soy, dashi, a pickle that is the point",
      when: "Lunch", price: "¥1,200–2,500 a set", where: "A Nishijin or downtown room that still does a weekday lunch",
      howToOrder: "The set. Say what you cannot eat before they plate. Dashi is default.",
    }),
    dish("Yudofu", "Tofu in a pot. Judge the room by whether locals are there on a Tuesday.", {
      localName: "湯豆腐", taste: "Quiet, kombu, soy on the side",
      when: "Cooler months; lunch", price: "¥1,500–3,000", where: "North or west, not a garden with a view surcharge as the whole product",
      howToOrder: "A pot for the table. Do not expect it to be a spectacle.",
    }),
    dish("A noodle bowl", "Soba or udon as infrastructure between temples. Paler, not a Tokyo soy theatre.", {
      when: "Anytime the kitchen is open — which is not late", price: "¥700–1,200",
      where: "Station counters and independent shops near Karasuma", howToOrder: "A tempura on top if you want it. Last order is posted.",
    }),
    dish("Kaiseki as a booked night", "Seasonal plates, a room, a chef who is not performing for a camera. One night, not every dinner.", {
      localName: "会席 / 懐石", when: "Dinner, early", price: "¥12,000–40,000 if you booked",
      where: "A room that wants a name. Not Pontocho as a walk-in.",
      howToOrder: "Reservation. Arrive on time. Dietary limits in advance. Last bus is your problem.",
    }),
    dish("Nishin soba / a market snack you finish", "Herring on soba in season, or a pickle from Nishiki you will eat, not a bag of box snacks as the meal.", {
      when: "Lunch or a walk-around that does not replace lunch", price: "¥900–1,600 a bowl",
      where: "A soba shop, or Nishiki without blocking the lane", howToOrder: "Eat it. Do not film the counter as the course.",
    }),
  ],
  foodThemes: [
    { title: "Lunch is the meal", body: "Kitchens close. A 12:15 set is the civic truth. Missing it because you were on the Kiyomizu slope is a planning error." },
    { title: "Kaiseki is a night, not a default", body: "Book it once if that is the point. Obanzai and a bowl are Kyoto the other six meals." },
    { title: "Dashi is default", body: "Vegetarian is weaker than the temple myth. Say it clearly. Some shojin rooms exist; the izakaya will not improvise." },
    { title: "Nishiki is a market", body: "Buy what you will finish. Grazing ten samples in the lane is how you become the blockage." },
  ],
  venues: [
    venue("A Nishijin lunch", "If the next table has a supermarket bag, stay.", {
      neighborhood: "Nishijin", type: "Obanzai / small restaurant", price: "¥¥", dishes: ["Set", "Pickles"], reservation: "Lunch walk-in early; some rooms want a name",
    }),
    venue("A Karasuma noodle counter", "Between buses. Last order is posted.", {
      neighborhood: "Karasuma", type: "Soba / udon", price: "¥", reservation: "No",
    }),
    venue("A booked kaiseki, one night", "On time. Voice down. Not a garden selfie course.", {
      neighborhood: "West or a room you researched", type: "Kaiseki", price: "¥¥¥", reservation: "Required",
    }),
    venue("Depachika under a department store", "Basement as a food hall. Takeaway, a river bench, a station seat.", {
      neighborhood: "Karasuma / Kyoto Station", type: "Food hall", price: "¥¥", reservation: "No",
    }),
  ],
  shopping: [
    { title: "Nishijin and a workshop, not a Gion keyring", body: "Textile, tea, a knife if you know the rules. The slope souvenir is a tax on not leaving Higashiyama." },
    { title: "What to skip", body: "Fake antiques, matcha kits you will not use, kimono rental as a costume for the lane." },
    { title: "Tax-free", body: "Department stores handle it. Passport. The stall on the slope may not." },
  ],
  stayIntro: "Nishijin, Demachiyanagi, or near Karasuma. Gion is a camera line. Kyoto Station is a train.",
  stayAreas: [
    { name: "Nishijin", bestFor: ["Quiet nights", "Repeat visitors"], commute: "Bus", priceHint: "Mid to high", noise: "Low", safety: "High" },
    { name: "Demachiyanagi", bestFor: ["First stay", "River"], commute: "Keihan + bus", priceHint: "Mid to high", noise: "Low", safety: "High" },
    { name: "Near Karasuma", bestFor: ["Subway people"], commute: "Karasuma line", priceHint: "High", noise: "Moderate", safety: "Fine" },
    { name: "Kyoto Station (only if a train forces it)", bestFor: ["Early HARUKA", "One night"], commute: "You are in the shed", priceHint: "Mid to high", noise: "Station", safety: "Fine and soulless" },
  ],
  stayNotes: [
    "A room on Hanamikoji is a nightclub of cameras with tatami. Price Nishijin and ride the bus.",
    "Air conditioning is expected. A listing without it in August is a choice you will regret.",
    "Ryokan evenings are early. Last order and lights-out are the product. Read the house rules.",
  ],
  bestAreaFor: [
    { persona: "First stay", area: "Near Karasuma or Demachiyanagi", why: "Buses and a subway sketch. Gion is a morning walk, not a bed." },
    { persona: "Quiet nights", area: "Nishijin", why: "Textile streets. Daitoku-ji is a morning, not a commute across the basin." },
    { persona: "Temple morning", area: "Demachiyanagi for the east; a bus from Karasuma for Fushimi", why: "Do not sleep on the Higashiyama slope." },
    { persona: "Short trip with a train", area: "Karasuma south / station only if HARUKA forces it", why: "The station is a shed. One night, then move." },
  ],
  arrival: [
    { name: "KIX → HARUKA", time: "75–90 min to Kyoto Station", cost: "HARUKA ticket; ICOCA pairs exist — check current JR West offers", how: "HARUKA is the adult train. Reserved seats, bags, a destination board. A highway bus is slower in traffic.", bestFor: "Almost everyone landing at KIX", watchOut: "Do not book a 10:00 temple after a dawn landing. HARUKA is not a metro." },
    { name: "ITM → Kyoto", time: "About 1 hour", cost: "Airport limousine or trains via Osaka", how: "Itami is closer for some domestic hops. Limousine bus to Kyoto Station, or rail via the city. Not KIX.", bestFor: "Domestic arrivals", watchOut: "ITM is not the long-haul island. Do not mix the airport codes." },
    { name: "From Osaka / Tokyo", time: "Osaka 30–75 min; Tokyo ~2h15 shinkansen", cost: "JR or Hankyu from Osaka; Hikari/Kodama if Nozomi is not on your pass", how: "Arrive, drop bags, one neighborhood. Not Fushimi the same afternoon.", bestFor: "Rail arrivals", watchOut: "Kyoto Station is not the stay. Bus or Karasuma onward." },
  ],
  gettingAround: [
    { title: "Buses are the civic spine", body: "IC tap. The map is a web. Two stops of walking often beats a 25-minute wait. Subway is mostly north–south." },
    { title: "ICOCA is the city", body: "Buses, subway, JR in Kansai, many lockers and konbini. Suica works. A stack of paper tickets is the last century." },
    { title: "Taxis are rain and luggage", body: "Not the default from Kyoto Station to Kiyomizu. Daytime traffic is not a shortcut. Last bus is a real time." },
  ],
  dayTrips: [
    { name: "Nara", time: "JR or Kintetsu ~45 min; plan a full day", why: "Park, Great Buddha, a slower civic shrine town. Deer are animals, not props.", skipIf: "You only have two days in Kyoto, or you will treat the park as a 90-minute selfie between Fushimi and dinner." },
    { name: "Uji", time: "JR or Keihan ~20–30 min; a half to full day", why: "Byodo-in, tea as a room not a latte, a river. One temple, a bowl of tea.", skipIf: "You stacked Arashiyama the same day. Pick a west or a south." },
    { name: "Ohara or Kurama–Kibune", time: "Bus north, 45–70 min; a half to full day", why: "A valley, a quieter precinct, a river walk if the heat allows.", skipIf: "August at 14:00 without a plan B. Do not add it after Fushimi." },
  ],
  seasons: [
    { name: "Spring", forWhom: "First-timers who booked sleep", pros: "Bloom, usable mornings.", cons: "Hanami crush on the path and at every gate. Rooms sell out.", pack: "A layer, an indoor backup, patience that is actually a time slot." },
    { name: "Summer", forWhom: "People with A/C and a night river", pros: "Kamo platforms, late light.", cons: "Wet heat that cancels midday walking. August is a logistics problem.", pack: "Electrolytes, a museum slot at 14:00, a sento." },
    { name: "Autumn", forWhom: "Almost everyone", pros: "Maple weeks, clearer some days, food.", cons: "Coach parks at Arashiyama and the east slope. Book sleep.", pack: "A coat you can walk in." },
    { name: "Winter", forWhom: "Compounds, fewer queues some weeks", pros: "Quieter gravel; yudofu weather.", cons: "Short grey days; some gardens close or shorten.", pack: "A real coat. Indoor slippers at some lodgings." },
  ],
  weatherTips: [
    { title: "If it rains", body: "A museum, a covered arcade, a long lunch. Fushimi clay is slick. Subtemple interiors still work." },
    { title: "If it is extremely hot", body: "Temple at open, bus, sento, river at dusk. Midday on the Higashiyama slope is not a personality test. Typhoon: HARUKA can stop; eat where you slept." },
  ],
  festivals: [
    { name: "Gion Matsuri", when: "July (yamaboko, especially mid-month)", note: "Heat, crowds, a civic holiday that takes the centre. Book sleep a year out if that is the point. It is not a cooler July." },
    { name: "Aoi Matsuri", when: "15 May", note: "A procession, horses, a shrine calendar. Watch from where you are told." },
  ],
  budget: {
    currency: "JPY", asOf: "September 2026 — indicative",
    bands: [
      { name: "Shoestring", daily: "¥10,000–14,000", includes: "Business hotel, noodle bowls, buses, one paid precinct." },
      { name: "Comfortable", daily: "¥18,000–28,000", includes: "Mid hotel, a proper lunch, IC fares, one kaiseki skipped." },
      { name: "Premium", daily: "¥45,000+", includes: "Ryokan or serious hotel, booked kaiseki, taxis in rain." },
    ],
    breakdown: [
      { item: "Room", budget: "¥7,000–12,000", mid: "¥16,000–28,000", luxury: "¥50,000+" },
      { item: "Meals", budget: "¥2,500–4,000", mid: "¥5,000–9,000", luxury: "¥20,000+" },
    ],
    hidden: ["HARUKA reserved seat", "Subtemple tickets that add up", "Kimono rental you did not need"],
    worthSpending: ["One temple morning done properly", "A booked lunch", "IC on the phone"],
    worthSaving: ["Gion hotel", "A third shrine the same day", "Rickshaw in Arashiyama"],
  },
  timePlanning: [
    { title: "How many days", body: "Four in the basin. Nara is a fifth. Two is one mountain and a neighborhood." },
    { title: "Do not stack", body: "Fushimi, Kiyomizu, and Arashiyama are three different edges. One of them in a day." },
  ],
  connectivity: [
    { title: "eSIM", body: "Install before KIX. Bus times and maps are the whole game." },
    { title: "Wi-Fi", body: "Stations and hotels. Do not count on it on a mountain path." },
  ],
  payments: [
    { title: "IC and cards", body: "ICOCA / Suica for transit and many counters. Cards widely. Cash for tiny temples and stalls. Do not tip." },
  ],
  itineraries: [
    {
      title: "Three days: mountain, compound, river",
      days: 3, pace: "balanced",
      summary: "Fushimi as a climb, Daitoku-ji as a sit, a river or Nishijin day. Gion is not a day. No three-shrine stack.",
      daysPlan: [
        {
          label: "Day 1", theme: "Arrive, neighborhood, not a mountain after a dawn HARUKA",
          stops: [
            { time: "Morning", title: "HARUKA to Kyoto Station, then Nishijin or Karasuma", detail: "Drop bags. Do not book a 10:00 temple." },
            { time: "Afternoon", title: "A bowl and a walk", detail: "Shotengai or the Kamo. A nap if the flight was dawn." },
            { time: "Evening", title: "Dinner near the hotel", detail: "Early. Kyoto closes. Not Hanamikoji at dusk." },
          ],
          rainPlan: "A department-store basement and a long lunch. Skip a hill.",
        },
        {
          label: "Day 2", theme: "Fushimi as a mountain",
          stops: [
            { time: "Morning", title: "Fushimi Inari", detail: "JR Inari. Climb until the crowd thins. Down before the heat peaks." },
            { time: "Afternoon", title: "East of the river, not the Kiyomizu slope", detail: "A bowl, a nap. Do not add Kiyomizu." },
            { time: "Evening", title: "Dinner near the hotel", detail: "Early." },
          ],
          rainPlan: "A museum and a covered market. Fushimi paths are clay when wet.",
        },
        {
          label: "Day 3", theme: "North compound",
          stops: [
            { time: "Morning", title: "Daitoku-ji subtemples", detail: "Gravel. Sit. Greet. Voice down." },
            { time: "Afternoon", title: "Nishijin walk", detail: "Textile streets, not a shopping list." },
            { time: "Evening", title: "West-side dinner", detail: "21:00 is late here. Pack." },
          ],
          rainPlan: "Subtemple interiors and a long lunch.",
        },
      ],
    },
    {
      title: "Five days: add Nara as a full day",
      days: 5, pace: "slow",
      summary: "Three city days, one full day in Nara — not Uji the same day — one leftover for Arashiyama west of the bamboo or a rest.",
      daysPlan: [
        {
          label: "Days 1–3", theme: "The three-day basin",
          stops: [
            { time: "—", title: "Nishijin or Karasuma base", detail: "Fushimi climb, Daitoku-ji, a river. White space. No Gion night as a plan." },
          ],
          rainPlan: "As the three-day plan.",
        },
        {
          label: "Day 4", theme: "Nara, not a squeeze",
          stops: [
            { time: "Full day", title: "Leave after breakfast, back for a late dinner or a konbini", detail: "Kintetsu or JR. Park, Great Buddha, one more precinct. Deer are animals. No Fushimi-plus-deer stack." },
          ],
          rainPlan: "Nara interiors still work. Shrine gravel becomes soup. Trains still run.",
        },
        {
          label: "Day 5", theme: "Arashiyama west of the bamboo, or rest",
          stops: [
            { time: "Morning", title: "Arashiyama at open, or skip it", detail: "Grove once, then the river. Do not add Kiyomizu." },
            { time: "Afternoon", title: "One more bowl, or a museum", detail: "Pack." },
            { time: "Evening", title: "Station only if HARUKA forces it", detail: "Otherwise sleep in the neighborhood." },
          ],
          rainPlan: "Skip Arashiyama. The river under an umbrella is still the city. A museum if the west is soup.",
        },
      ],
    },
  ],
  visa: {
    summary: "Japan entry rules. Many passports: visa-free short stay. Confirm Immigration Services Agency.",
    details: ["An airline email is not the law.", "Visit Japan Web can speed airport QR; it is not a visa.", "A JR Pass rarely pays for Kyoto-only."],
    officialUrl: "https://www.moj.go.jp/isa/",
  },
  apps: [
    { name: "Navitime / Google Maps", purpose: "Buses, last miles, walking between hills", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: true, necessary: "before", note: "Bus times slip. Build slack. Last bus is the whole game after 21:00." },
    { name: "ICOCA / mobile IC", purpose: "Buses, subway, JR in Kansai, konbini", platforms: "iOS / Android / card", needLocalNumber: false, needLocalBank: false, offline: true, necessary: "before", note: "Set up in Wallet before you land if your phone allows it." },
    { name: "Tabelog or Google", purpose: "Whether the garden lunch is a tourist replica", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: false, necessary: "after", note: "Japanese reviews still tell the truth more often than the English listicle." },
  ],
  culture: [
    { title: "Quiet compounds", body: "Greet. Voices down. Drones nowhere. The gravel is not a runway." },
    { title: "Early kitchens", body: "Lunch is the meal. Missing it is a planning error, not a vibe. Last order is posted." },
    { title: "A geisha is going to work", body: "Do not follow, block, or chase a photo on Hanamikoji. It is a person, not a mascot." },
    { title: "Buses are civic, not a failure", body: "You are commuting with the city. IC tap. Do not treat the driver as a guide." },
  ],
  etiquette: [
    { do: "Greet and lower your voice in compounds", dont: "Film a prayer or a garden as content", why: "You are in someone else's precinct." },
    { do: "Tap IC and take the bus", dont: "Block the door with a suitcase at 8:30", why: "You are in a commute." },
    { do: "Eat lunch at lunch", dont: "Expect a serious kitchen at 21:30 in Nishijin", why: "The room has a clock. Tokyo hours are not the default." },
  ],
  taboos: [
    "Chasing or blocking a geisha / maiko for a photo",
    "Tipping",
    "Treating a temple compound as a costume rack or a stamp sport",
  ],
  safety: [
    { title: "Very safe nights", body: "Ordinary caution. The risk is heat, hills, and a bus you missed, not a street at 22:00." },
    { title: "Crowds", body: "Bag in front on the Fushimi path and the Kiyomizu slope. Pickpockets are uncommon and still not zero." },
    { title: "Heat and typhoons", body: "August is wet heat. Signals are real. Eat in the neighborhood you slept in if HARUKA stops." },
  ],
  scams: [
    { name: "Kimono-street pressure", lookFor: "Aggressive rental touts on the Higashiyama slope", prevent: "A flat no, keep walking", ifItHappens: "You do not owe a photo or a fitting" },
    { name: "Gion 'help' at dusk", lookFor: "Someone offering to lead you to a teahouse or a viewing spot", prevent: "You already have a dinner near the hotel", ifItHappens: "Walk to a lit street; do not pay a 'cover' on the pavement" },
    { name: "Airport and station touts", lookFor: "Unofficial taxis at KIX or Kyoto Station offering a flat 'city tour'", prevent: "HARUKA first. Taxi only from a rank if you accept the meter.", ifItHappens: "Pay the meter; do not add a guide" },
  ],
  emergency: [
    { label: "Police", value: "110" },
    { label: "Fire / ambulance", value: "119" },
  ],
  accessibility: [
    { title: "Buses and hills", body: "Many buses kneel; not all. Fushimi is a mountain. Kiyomizu is a slope. Karasuma subway is the kinder spine." },
    { title: "Compounds", body: "Gravel, thresholds, shoes off. Daitoku-ji is not step-free as a default. Ask the subtemple." },
  ],
  byTraveler: [
    { persona: "First-timers", tips: ["Karasuma or Demachiyanagi. One temple morning. Bus. Lunch on time. Skip Gion as a bed."] },
    { persona: "Temple people", tips: ["Fushimi as a climb or Daitoku-ji as a sit. Not both plus Kiyomizu. Voice down."] },
    { persona: "Food", tips: ["Lunch is the meal. Obanzai. Book kaiseki once. Nishiki is a market, not a tasting-menu lane."] },
    { persona: "Limited mobility", tips: ["Karasuma grid. Skip Fushimi as a mountain. Taxi in rain. Museums over slopes."] },
  ],
  touristsGetWrong: [
    "Staying in Gion because the listing said geisha",
    "Fushimi + Kiyomizu + Arashiyama in one day",
    "Only walking the first 200 metres of Fushimi",
    "Treating Arashiyama bamboo as the whole west",
    "Missing lunch",
    "Nara as an afternoon",
    "Following a geisha for a photo",
  ],
  faq: [
    { q: "Where should I stay?", a: "Nishijin, Demachiyanagi, or near Karasuma. Not Gion. Kyoto Station only if a train forces it." },
    { q: "How many temples?", a: "One proper morning plus whatever you walk past. Collecting ten is a sport, not a trip." },
    { q: "Fushimi, Kiyomizu, and Arashiyama in one day?", a: "That is a logistics error. Pick one edge." },
    { q: "HARUKA from KIX?", a: "Yes. It is the adult train to Kyoto Station. Then a bus or Karasuma to the bed." },
    { q: "Is Nara a half day?", a: "You can see a train. Give it a day, or give Nara its own night." },
    { q: "August?", a: "Wet heat. Temple at open, bus, interiors at 14:00, river at dusk. A/C is the stay." },
  ],
  phrases: [
    { original: "すみません", romanized: "sumimasen", meaning: "Excuse me / sorry / getting attention", use: "Before you order or pass someone on a path", avoid: "Barking it at staff as if it were a snap" },
    { original: "お願いします", romanized: "onegaishimasu", meaning: "Please (request)", use: "After pointing at a set or a ticket", avoid: "A long English speech over a display case" },
    { original: "静かに", romanized: "shizuka ni", meaning: "Quietly (a reminder to yourself)", use: "Entering a compound", avoid: "Saying it at other visitors as a performance" },
    { original: "カードで払えますか", romanized: "kādo de haraemasu ka", meaning: "Can I pay by card?", use: "Tiny counters and subtemple desks", avoid: "Waving a phone at a cash-only sign" },
  ],
  sources: [
    { name: "Kyoto City Official Travel Guide", url: "https://kyoto.travel/", usedFor: "Hours and civic overview" },
    { name: "JR West / HARUKA", url: "https://www.westjr.co.jp/", usedFor: "KIX trains" },
    { name: "Immigration Services Agency of Japan", url: "https://www.moj.go.jp/isa/", usedFor: "Entry" },
  ],
});
