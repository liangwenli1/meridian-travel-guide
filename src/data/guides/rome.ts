import { assembleGuide, att, dish, nbh, venue } from "./assemble";

export const romeGuide = assembleGuide({
  citySlug: "rome",
  countrySlug: "italy",
  title: "Rome Travel Guide",
  subtitle: "Book Colosseum and Vatican as separate mornings. Stay Testaccio, Monti, or a quiet Trastevere street. Trevi is a fountain you walk past.",
  seoTitle: "Rome Travel Guide 2026: Testaccio, Monti, Colosseum Slots, FCO Trains",
  seoDescription:
    "A Rome guide for people who will sleep in Testaccio or Monti, book one ruin morning, skip a Colosseum-view hotel, and treat Ostia or Tivoli as a full extra day.",
  hero: {
    url: "https://resource.tapzm.com/media/cities/rome/hero.jpg",
    alt: "Colosseum in Rome under a clear sky",
    source: "Unsplash",
    author: "David Köhler",
    license: "Unsplash License",
    originalUrl: "https://unsplash.com/photos/colosseum-italy",
    location: "Colosseo, Rome",
  },
  snapshot: {
    country: "Italy",
    languages: "Italian (English at hotels and major interiors; greet at the counter)",
    currency: "Euro (€)",
    timezone: "CET/CEST (UTC+1/+2)",
    population: "About 2.8 million in the city; the walls are the map that matters",
    dailyCost: "€70–95 shoestring · €140–220 comfortable · €350+ premium",
    bestMonths: "April–early June, late September–October. August is a furnace.",
    typicalStay: "4 days inside the walls; Ostia or Tivoli is a full extra day",
    airports: "Fiumicino (FCO) default; Ciampino (CIA) for some low-cost flights",
    stations: "Termini, Tiburtina, Ostiense, Trastevere",
    visaSummary: "Schengen / ETIAS when applicable. Confirm official sources.",
    plugType: "Type F / L",
    voltage: "230V, 50Hz",
    emergency: "112",
    tipping: "Service is often included. A euro or two on the table is optional, not 20%.",
    cashVsCard: "Cards widely. Keep coins for tiny bars and some market stalls.",
    diningHours: "Lunch 13:00 · dinner from 20:00. Kitchens close. 18:00 is a tourist sitting.",
    walkability: "Excellent and tiring. Cobbles, heat, no grid. Distances the map understates.",
    transitQuality: "Metro is a sketch. Buses and trams do the rest. Walking wins inside the walls.",
    travelStyle: "Ruin-morning, neighborhood-evening — punishes a fountain checklist and a Colosseum-view hotel",
  },
  whyGo:
    "Rome is a living capital with ruins in the way. The Forum is a field in the sun; so is a 20:00 carbonara, a bus that does not come, and a Testaccio lunch the offices already claimed. Stay in Testaccio, Monti, or a quiet Trastevere street — not a hotel facing the Colosseum. Book the arena and the Vatican as separate mornings. Trevi is a fountain you walk past. The city you remember is a table after dark, not a selfie at noon without a ticket.",
  whoWillLoveIt: [
    "Walkers who will cross the river twice and not call it a hike",
    "People who eat standing at 13:00 and sit for dinner at 20:00",
    "Travelers who will book one timed ruin and walk the rest",
    "Return visitors happy in Testaccio and uninterested in another fountain",
  ],
  whoMayStruggle: [
    "Anyone who booked a Colosseum-view room because the listing said historic centre",
    "Visitors who think the arena and the Vatican fit in one day, and Trevi is a destination",
    "People who wilt in August at 14:00 without shutters, or who need dinner at 18:00",
    "Travelers hoping the streets around Trevi feel like a neighborhood",
  ],
  shortVersion: [
    "Stay in Testaccio, Monti, or a quiet Trastevere street — not a hotel facing the Colosseum.",
    "Colosseum one morning, Vatican another. The Forum is a field in the sun. Trevi is a walk-past.",
    "Leonardo Express is the dearer FCO train to Termini. The regional is slower and enough. Roma Pass is optional math.",
    "Lunch at 13:00. Dinner at 20:00. August is a furnace and many kitchens close.",
    "Ostia or Tivoli is a full extra day. Gladiator photos and bracelet sellers are a no, then walk.",
  ],
  realityCheck: [
    "Colosseum at noon without a ticket is a logistics error, not a must-see.",
    "Trevi, the Spanish Steps, and the chain-gelato belt are a crowd-management problem, not Rome.",
    "August empties kitchens and fills the remaining tourist ones. Do not treat August like April.",
    "A 'skip the line' seller on the pavement is a tour. Gladiators at the arena are a photo product.",
    "The Forum in July at 14:00 is a field with no shade. Water, a hat, out by lunch.",
  ],
  zh: {
    title: "罗马旅行指南",
    subtitle: "斗兽场和梵蒂冈分开两个上午。住 Testaccio、Monti，或安静的 Trastevere 小巷。特莱维是路过的喷泉。",
    whyGo:
      "罗马是一座废墟挡路的活首都。广场是太阳下的一片地；八点的碳拉、不来的公交、已被上班族占住的 Testaccio 午餐也是。住 Testaccio、Monti，或安静的 Trastevere 街——不要订对着斗兽场的酒店。竞技场和梵蒂冈分成两个上午。特莱维是路过的喷泉。记住的是天黑之后的桌子，不是中午没票的自拍。",
    whoWillLoveIt: [
      "过河两次也不叫远足的步行者",
      "一点站着吃、八点才坐下来吃晚饭的人",
      "会订一处定时废墟、其余走路的人",
      "愿意待在 Testaccio、对再看一座喷泉没兴趣的回头客",
    ],
    whoMayStruggle: [
      "因为房源写了历史中心就订斗兽场景观房的人",
      "觉得竞技场和梵蒂冈能塞进一天、特莱维是目的地的人",
      "八月下午两点没有百叶窗就会融化、或必须六点吃晚饭的人",
    ],
    shortVersion: [
      "住 Testaccio、Monti，或安静的 Trastevere 小巷——不要订对着斗兽场的酒店。",
      "斗兽场一个上午，梵蒂冈另一个。广场是太阳下的地。特莱维是路过。",
      "Leonardo Express 是去 Termini 更贵的 FCO 车。区域列车更慢也够用。Roma Pass 是可选算术。",
      "午餐一点。晚饭八点。八月是炉子，许多厨房关门。",
      "Ostia 或 Tivoli 是额外一整天。角斗士合影和手链摊贩：拒绝，然后走。",
    ],
    realityCheck: [
      "中午没票去斗兽场是后勤错误，不是必看。",
      "特莱维、西班牙阶梯、连锁凝胶ato带是人群管理问题，不是罗马。",
      "八月空掉厨房，填满剩下的游客店。不要把八月当成四月。",
      "人行道上卖「插队」的是旅行团。竞技场边的角斗士是拍照产品。",
    ],
  },
  beforeYouGo: [
    { title: "Two mornings, not one day", body: "Colosseum and Vatican are official timed tickets on separate mornings. Screenshot the QR. A pavement 'skip' is a tour. Do not stack them." },
    { title: "Where you sleep", body: "Testaccio, Monti, or a Trastevere street off the piazza. A Colosseum-view room is a surcharge for a ruin you will visit once, at open, with a ticket." },
    { title: "FCO trains", body: "Leonardo Express is the dearer nonstop to Termini. The regional (FL1) is cheaper and stops at Trastevere and Ostiense — often the better match. They are not interchangeable with a taxi queue at 22:00." },
    { title: "Roma Pass math", body: "Optional. It pays if you already planned two paid interiors and will ride enough. Most four-day trips walk more than they ride. Do not buy it as a default." },
    { title: "Hours and heat", body: "Lunch 13:00, dinner 20:00. August is a furnace; many kitchens close for Ferragosto. Nasoni are drinkable. Carry a bottle." },
  ],
  neighborhoods: [
    nbh("Testaccio", "A working quarter of slaughterhouse memory, a market, and kitchens that feed the same people at 13:00 tomorrow.", {
      bestFor: ["Food", "Repeat visitors"], price: "Mid", noise: "Low after dinner; market mornings",
      transit: "Piramide (B), buses along the river", stayNights: "3–5",
      combineWith: "Market morning, Pyramid and cemetery, dinner downstairs. Do not climb back to Trevi.",
    }),
    nbh("Monti", "A village between the Forum and Termini that still has streets you can sleep on.", {
      bestFor: ["First stay"], price: "Mid to high", noise: "Moderate; drops a street off the main lanes",
      transit: "Cavour, Colosseo (B)", stayNights: "3–4",
      combineWith: "Forum morning, Monti dinner. Do not add Trevi the same day.",
    }),
    nbh("Trastevere (quiet street)", "Cobbles and kitchens. Stay off the main piazza after 20:00 if you want to sleep.", {
      bestFor: ["Evenings"], price: "High", noise: "High on the piazzas; low a street west",
      transit: "Trastevere station / tram 8", stayNights: "3–4",
      combineWith: "Janiculum at dusk, then one table. Not a bar crawl mapped by a blog.",
    }),
    nbh("Prati", "Grid streets north of the Vatican. Useful if that interior is your morning; dull if it is your whole trip.", {
      bestFor: ["Vatican logistics"], price: "High", noise: "Low at night",
      transit: "Ottaviano, Lepanto", stayNights: "1–2 if the museums force it",
      combineWith: "One Vatican morning, then leave Prati to eat.",
    }),
    nbh("Garbatella / Ostiense", "Garden courtyards, a working south, Ostiense as a rail hinge. Not a ruin view.", {
      bestFor: ["Repeat visitors", "Quieter nights"], price: "Mid", noise: "Low",
      transit: "Garbatella (B), Ostiense", stayNights: "3–4",
      combineWith: "Testaccio for dinner; the centro is a metro hop, not a base.",
    }),
    nbh("Centro / Trevi belt (visit)", "The machine. Fountains, bracelet sellers, menus in five languages. Visit. Do not sleep here.", {
      bestFor: ["One walk-past"], price: "High", noise: "Extreme",
      transit: "You are already in the scrum", stayNights: "Skip",
      combineWith: "Walk past Trevi once if you must. Eat in Testaccio or Monti.",
    }),
  ],
  attractions: [
    att("Colosseum as a timed morning", "The civic ruin. A slot at open. Noon without a ticket is a logistics error, not a must-see.", {
      location: "Colosseo", transport: "Colosseo (B) or a walk from Monti",
      tips: ["Screenshot the QR. Water before you enter. Gladiator costumes are a photo product — a flat no."],
      mistakes: ["Arriving at noon without a ticket. Stacking the Vatican the same day. Paying a pavement 'skip'."],
      worthIt: "Yes with a morning slot. No as a Colosseum-view hotel justification.", tier: "essential",
    }),
    att("Forum and Palatine", "A field in the sun, then a hill. The civic wreck. Shade is not the design. Out by lunch in summer.", {
      location: "Via dei Fori Imperiali / Palatine", transport: "Colosseo (B); confirm the current bundle with the arena",
      tips: ["Hat, nasoni before you enter, a plan for one path not every plaque."],
      mistakes: ["July at 14:00. Treating it as a selfie loop between fountains."],
      worthIt: "Yes in the morning. No as a midday add-on after the arena queues.", tier: "essential",
    }),
    att("Pantheon", "A working interior that still earns the detour if you go when the square is not a show.", {
      location: "Piazza della Rotonda", transport: "Walk; buses on the corso",
      tips: ["The hole in the roof is the point. The square is the tax."],
      mistakes: ["Rushing it between Trevi and a gelato chain."],
      worthIt: "Yes as a short interior. The piazza at noon is optional.", tier: "essential",
    }),
    att("Vatican Museums as a separate morning", "A logistics day, not a photo stop after the Colosseum. Sistine at the end of a march. St Peter's is another queue.", {
      location: "Vatican / Prati", transport: "Ottaviano; do not taxi the last 400 metres into the crush unless mobility requires it",
      tips: ["Pick a wing. Official timed ticket. Dress for the basilica. Leave Prati to eat."],
      mistakes: ["Colosseum plus Vatican in one day. A pavement tour. Shorts in the basilica as a surprise."],
      worthIt: "Yes as its own morning. No as a squeeze after the Forum.", tier: "essential",
    }),
    att("Galleria Borghese", "The one museum that justifies a reservation more than another ruin. Finite rooms. Timed entry is the whole game.", {
      location: "Villa Borghese", transport: "Bus to the park; a walk through the gardens",
      tips: ["Book weeks ahead in season. The park is the air after."],
      mistakes: ["Walk-up. Stacking it after the Vatican march."],
      worthIt: "Yes if you will look at objects. The park alone is free and kinder some days.", tier: "extra-time",
    }),
    att("Appia Antica", "A road of tombs and catacombs. Stone without the same arena queue. A half to full day; not an hour between fountains.", {
      location: "South of the walls", transport: "Bus / Appia Antica shuttle — check current weekend closures to cars",
      tips: ["Water. Shade is thin. Catacombs often need a slot."],
      mistakes: ["A taxi 'quick look' from the Colosseum. Treating tombs as a backdrop."],
      worthIt: "Yes as a dedicated stretch. No as a checkbox from Termini.", tier: "conditional",
    }),
  ],
  thingsToDo: [
    { title: "Walk past Trevi, do not stage it", body: "A fountain. One glance if the lane allows. The photo scrum is not a civic duty.", duration: "10 minutes", who: "Everyone who insists" },
    { title: "Testaccio market at 13:00 lunch", body: "A kitchen, not a set. Eat where the next table has a receipt from the stall.", duration: "2 hours", who: "Eaters" },
    { title: "Nasoni as infrastructure", body: "Drink from the taps. Buying water at every ruin is a tax on not knowing.", duration: "Ongoing", who: "Everyone" },
    { title: "A counter lunch, then a nap", body: "Pizza al taglio or a trattoria at 13:00. The afternoon is heat and shutters.", duration: "90 minutes", who: "Anyone in season" },
    { title: "Janiculum at dusk", body: "A hill, a view, then down to a Trastevere table off the piazza.", duration: "90 minutes", who: "Walkers" },
    { title: "One interior you booked, then stop", body: "Borghese or San Clemente if you still care. A third ruin is how you remember none.", duration: "2 hours", who: "Rain, return visitors" },
  ],
  hiddenGems: [
    { title: "Non-Catholic Cemetery", body: "Pyramid, shade, cats, Keats. A quiet stone next to Testaccio.", watchOut: "Hours are finite. It is a cemetery, not a picnic set." },
    { title: "Garbatella courtyards", body: "Garden blocks south of Ostiense. A walk, not a viewpoint with a ticket.", watchOut: "People live here. Do not film washing as colour." },
    { title: "San Clemente", body: "A church on a church on a Mithraeum. Layers, a ticket, a finite hour.", watchOut: "Last entry is real. It is not a secret; it is off the fountain loop." },
  ],
  localExperiences: [
    { title: "Coffee standing at 8:00", body: "Espresso at the bar. Sitting is a surcharge. Cappuccino after lunch is the visitor tell." },
    { title: "Aperitivo that is not a buffet raid", body: "A drink and a small plate around 18:30. Then dinner at 20:00, or not." },
    { title: "Passeggiata on a street that is not Trevi", body: "Walking as the evening. Monti or the river. The centro scrum is a different sport." },
  ],
  everydayLife: [
    { title: "Morning", body: "Bars, your timed slot, nasoni. The Forum is already a workplace for umbrellas and gladiators." },
    { title: "Afternoon", body: "Kitchens rest. Churches, a nap, shutters. Heat in July and August is a logistics problem." },
    { title: "Night", body: "Dinner from 20:00. Testaccio keeps a neighborhood. The Trevi belt keeps a crowd. A taxi after 23:30 is ordinary." },
  ],
  foodIntro:
    "Rome is a 13:00 lunch city that pretends to be a dinner city. The offices tell the truth. Carbonara is a Roman plate, not a personality. Cacio e pepe is the room test. Sit where the next table is speaking Italian, at 20:00, not facing a fountain at 18:00.",
  dishes: [
    dish("Cacio e pepe", "Cheese, pepper, pasta water. Judge the room by this, not by a carbonara photo.", {
      localName: "cacio e pepe", taste: "Pecorino, heat, starch. If it is a cream sauce, walk.",
      when: "Lunch or dinner", price: "€12–18", where: "Testaccio or a trattoria that still does 13:00 for the block",
      howToOrder: "As a primi. You do not need a second pasta.",
    }),
    dish("Carbonara", "Egg, pecorino, guanciale, pepper. No cream. The tourist plate that is still a local plate if the room is right.", {
      localName: "carbonara", taste: "Pork fat, cheese, a sauce that is eggs not dairy",
      when: "Dinner", price: "€13–20", where: "A room speaking Italian at 20:30, not a menu in five languages on the piazza",
      howToOrder: "One plate. Guanciale is the point; bacon is a different dish.",
    }),
    dish("Pizza al taglio", "A square you eat walking. Lunch infrastructure. Weight, not a sit-down performance.", {
      localName: "pizza al taglio", when: "11:30–14:00", price: "€4–8",
      where: "A counter with a queue of people on lunch break", howToOrder: "Point, they cut, they weigh. Stand.",
    }),
    dish("Carciofi", "Jewish-style fried or alla romana, in season. Do not order it in August because a menu still lists it.", {
      localName: "carciofi alla giudia / alla romana", when: "Winter–spring", price: "€8–14",
      where: "Ghetto trattorie or a Testaccio kitchen that still follows the market",
      howToOrder: "Ask if they are in season. If the answer is a shrug, pick something else.",
    }),
    dish("Coda alla vaccinara", "Oxtail, celery, tomato, time. Testaccio's slaughterhouse memory on a plate.", {
      localName: "coda alla vaccinara", when: "Dinner, cooler months", price: "€16–24", where: "Testaccio",
      howToOrder: "A second after a light primi. It is heavy. You do not also need carbonara.",
    }),
  ],
  foodThemes: [
    { title: "13:00 is the honest meal", body: "Offices eat then. A 13:00 trattoria in Testaccio will teach you the right lesson. An 18:00 'early bird' facing Trevi will teach you the wrong one." },
    { title: "Dinner at 20:00", body: "20:30 in rooms you care about. 18:00 is for tourists and children. The kitchen is not a lounge." },
    { title: "Four pastas are not a personality", body: "Cacio e pepe, carbonara, gricia, amatriciana. Pick one. A second pasta is how the table goes numb." },
    { title: "Vegetarian", body: "Carciofi in season, pizza, cacio e pepe. Guanciale is default in the famous plates. Ask. August produce is a different city." },
  ],
  venues: [
    venue("A Testaccio lunch", "If the next table has receipts and work badges, stay.", {
      neighborhood: "Testaccio", type: "Trattoria", price: "€€", dishes: ["Cacio e pepe", "Coda"], reservation: "Lunch walk-in early; dinner yes in season",
    }),
    venue("Pizza al taglio near Monti", "Weight, standing, out.", {
      neighborhood: "Monti", type: "Pizza al taglio", price: "€", reservation: "No",
    }),
    venue("A Monti dinner at 20:30", "A room off the main lane. Italian in the room.", {
      neighborhood: "Monti", type: "Trattoria", price: "€€", reservation: "Yes in season",
    }),
    venue("Market stall, then sit if they have stools", "Coffee, a trapizzino or a plate, no itinerary.", {
      neighborhood: "Testaccio market", type: "Market", price: "€", reservation: "No", note: "Saturday is denser. Monday hours vary.",
    }),
  ],
  shopping: [
    { title: "Testaccio market, not a fountain belt", body: "Food you will eat. A knife if you know the rules. Trevi keyrings are a tax on not leaving the scrum." },
    { title: "What to skip", body: "Gladiator selfies as a purchase, fake designer on Via Nazionale, anything a man with a clipboard is holding." },
    { title: "Sunday and August", body: "Many shops shut. Food and some centro retail stay open for visitors. Plan laundry accordingly." },
  ],
  stayIntro: "Testaccio, Monti, or a quiet Trastevere street. A Colosseum-view hotel is a surcharge. Termini is a station, not a neighborhood.",
  stayAreas: [
    { name: "Testaccio", bestFor: ["Food", "Repeat visitors"], commute: "Metro B + walk", priceHint: "Mid", noise: "Low at night", safety: "Ordinary and fine" },
    { name: "Monti", bestFor: ["First stay"], commute: "Walk to the Forum", priceHint: "Mid to high", noise: "Moderate", safety: "Busy; bags in crowds" },
    { name: "Trastevere side street", bestFor: ["Evenings"], commute: "Tram 8", priceHint: "High", noise: "High on piazzas; low a street off", safety: "Watch bags on the square" },
    { name: "Prati", bestFor: ["Vatican morning"], commute: "Ottaviano", priceHint: "High", noise: "Low", safety: "Fine" },
  ],
  stayNotes: [
    "A room facing the Colosseum is a nightclub of tour groups with a minibar. Price a quieter street and walk.",
    "City tax per person per night. Stairs in palazzi; read the listing. A/C in August is the stay.",
    "Termini is useful for one night if a train forces it. It is not a base.",
  ],
  bestAreaFor: [
    { persona: "First stay", area: "Monti", why: "Walk to the Forum. Sleep on a street with a grocer." },
    { persona: "Food", area: "Testaccio", why: "Market and kitchens. The centro is a commute." },
    { persona: "Quiet evenings", area: "Trastevere side street", why: "The piazza is a show. A lane west of it is a stay." },
    { persona: "Vatican logistics", area: "Prati, one night", why: "Useful, dull. Eat elsewhere." },
  ],
  arrival: [
    { name: "FCO → Leonardo Express", time: "32 min to Termini", cost: "Premium nonstop fare", how: "Airport station, Trenitalia. Bags, a destination board. Not a metro.", bestFor: "Termini / Monti hotels if you will pay for speed", watchOut: "Unlicensed rides at arrivals. Official taxi rank has a fixed fare to the centro — confirm the posted rate." },
    { name: "FCO → regional (FL1)", time: "45–55 min depending on stop", cost: "Cheaper than the Express", how: "FL1 toward the city: Trastevere, Ostiense, Tiburtina. Often the better match for Testaccio or Trastevere beds.", bestFor: "South-bank and Ostiense stays", watchOut: "It is not the Express. Check the stop. Do not assume Termini." },
    { name: "CIA → bus", time: "40–60 min", cost: "Scheduled bus", how: "Coach to Termini. Ciampino is not closer in any way that matters. Taxi is a metre plus traffic.", bestFor: "Low-cost arrivals", watchOut: "Build slack. Do not book a 10:00 interior after a dawn landing." },
  ],
  gettingAround: [
    { title: "Walk inside the walls", body: "Metro is two-plus lines and a sketch. A 25-minute walk is often the correct transfer. Cobbles are not a rumour." },
    { title: "Tap, do not collect paper", body: "Contactless bank card or the official app. Do not buy a paper day-pass from a man at Termini. Roma Pass is optional math, not a default." },
    { title: "Buses and trams do the rest", body: "Tram 8 across the river. Buses when the metro sketch fails. Validate. Taxis from official ranks late, not touts." },
  ],
  dayTrips: [
    { name: "Ostia Antica", time: "Train from Ostiense / Piramide ~30 min; plan a full day", why: "A Roman town you can walk, brick, shade in places. Not a beach afternoon unless the beach is the point — it is a different Ostia.", skipIf: "You only have three days in the walls, or you will treat it as 90 minutes between fountains." },
    { name: "Tivoli", time: "Train or bus ~1 hour; plan a full day", why: "Villa d'Este or Hadrian's Villa. One estate. Fountains that are gardens, not Trevi.", skipIf: "You wanted Ostia the same day. Pick. Heat in August is a logistics problem on those terraces." },
    { name: "Castelli Romani", time: "Regional train ~40 min; a half to full day", why: "Hills, a table, wine as a pause. Not another ruin.", skipIf: "Your days are four and you have not walked Testaccio yet." },
  ],
  seasons: [
    { name: "Spring", forWhom: "First-timers", pros: "Usable walking, artichokes, slots still bookable if you are not last-minute.", cons: "Easter and May weekends crush the Forum.", pack: "A layer, shoes for cobbles." },
    { name: "Summer", forWhom: "People with A/C and dawn tickets", pros: "Long light, late tables.", cons: "August is a furnace; many kitchens close; the Forum is a field with no shade.", pack: "A/C, 8:00 tickets, electrolytes, a nap." },
    { name: "Autumn", forWhom: "Almost everyone", pros: "Walking weather, food season, fewer coaches some weeks.", cons: "Weekend day-trippers still pack Trevi.", pack: "A coat you can walk in." },
    { name: "Winter", forWhom: "Interiors, fewer queues some weeks", pros: "Rooms without the same scrum; carbonara weather.", cons: "Short damp days; some hours shorten.", pack: "A real coat. Stone holds the cold." },
  ],
  weatherTips: [
    { title: "If it rains", body: "Your slot still works. Pantheon, Borghese, a long lunch. The Forum can take a light rain; it cannot take a flood and a tantrum." },
    { title: "If it is extremely hot", body: "Ruin at open, interiors, shutters at 14:00, dinner at 20:00. Midday at the Forum is not a personality test. August kitchens close." },
  ],
  festivals: [
    { name: "Ferragosto", when: "15 August", note: "A national pause. Many kitchens closed. The remaining tourist rooms are packed. Do not treat it as April." },
    { name: "Estate Romana", when: "Summer", note: "Civic outdoor events, uneven quality. A Testaccio table still beats a stage you did not research." },
  ],
  budget: {
    currency: "EUR", asOf: "September 2026 — indicative",
    bands: [
      { name: "Shoestring", daily: "€70–95", includes: "Cheap room, pizza al taglio, nasoni, one timed ruin." },
      { name: "Comfortable", daily: "€140–220", includes: "Mid hotel, trattoria dinners, Colosseum slot." },
      { name: "Premium", daily: "€350+", includes: "Serious hotel, taxis, a booked dinner, FCO car." },
    ],
    breakdown: [
      { item: "Room", budget: "€50–90", mid: "€140–220", luxury: "€400+" },
      { item: "Meals", budget: "€25–40", mid: "€55–95", luxury: "€200+" },
    ],
    hidden: ["City tax", "Leonardo Express premium over the regional", "Bottled water at ruins"],
    worthSpending: ["One timed ruin morning", "A Testaccio dinner at 20:30"],
    worthSaving: ["Colosseum-view hotel", "Roma Pass if you will walk", "Trevi gelato"],
  },
  timePlanning: [
    { title: "How many days", body: "Four inside the walls. Ostia or Tivoli is a fifth. Two is one ruin morning and a neighborhood." },
    { title: "Colosseum and Vatican", body: "Separate mornings. One day is a queue plus a queue plus a tantrum." },
  ],
  connectivity: [
    { title: "eSIM", body: "Install before FCO. Maps, tickets, and ATAC times are the whole game." },
    { title: "Wi-Fi", body: "Hotels and some bars. Do not count on it in the Forum." },
  ],
  payments: [
    { title: "Cards", body: "Contactless is the default. Keep coins for a tiny bar and some market stalls. Pay in EUR, not DCC." },
  ],
  itineraries: [
    {
      title: "Three days: ruin, river, kitchen",
      days: 3, pace: "balanced",
      summary: "One Colosseum morning, one Vatican morning, one Testaccio day. No fountain loop. No Ostia squeeze.",
      daysPlan: [
        {
          label: "Day 1", theme: "Stone, then Monti",
          stops: [
            { time: "Morning", title: "Colosseum + Forum at open", detail: "Timed ticket. Water, hat, out by lunch. Gladiators: no." },
            { time: "Afternoon", title: "Monti streets", detail: "Shade, a counter, a nap if the heat wins. Do not add Trevi as a reward." },
            { time: "Evening", title: "Dinner in Monti at 20:00", detail: "Walk past Trevi only if you are already moving through. Then leave." },
          ],
          rainPlan: "Pantheon and a covered lunch. The Forum can take light rain; skip Palatine if it is soup.",
        },
        {
          label: "Day 2", theme: "Vatican as its own morning",
          stops: [
            { time: "Morning", title: "Vatican Museums", detail: "Official slot. Dress for the basilica if you continue. Not the Colosseum day." },
            { time: "Afternoon", title: "Prati lunch then leave", detail: "Do not shop the same street twice. A nap." },
            { time: "Evening", title: "Trastevere west of the piazza", detail: "One table. Walk the river home." },
          ],
          rainPlan: "The booked interior is the day. A long lunch. Skip the square.",
        },
        {
          label: "Day 3", theme: "Testaccio",
          stops: [
            { time: "Morning", title: "Market", detail: "Coffee, a stall, no itinerary." },
            { time: "Afternoon", title: "Pyramid / cemetery / river", detail: "Quiet stone without a headset." },
            { time: "Evening", title: "Last dinner in Testaccio at 20:00", detail: "Pack. Do not add Tivoli unless you already had four days." },
          ],
          rainPlan: "Market under the roof and a trattoria lunch that runs long.",
        },
      ],
    },
    {
      title: "Five days: add Ostia or Tivoli as a full day",
      days: 5, pace: "slow",
      summary: "Three city days, one full day in Ostia or Tivoli — not both — one leftover for Borghese or Appia.",
      daysPlan: [
        {
          label: "Days 1–3", theme: "The three-day core",
          stops: [
            { time: "—", title: "Monti or Testaccio base", detail: "Colosseum morning, Vatican morning, Testaccio. White space for heat. Trevi is a walk-past." },
          ],
          rainPlan: "As the three-day plan.",
        },
        {
          label: "Day 4", theme: "Ostia or Tivoli, not both",
          stops: [
            { time: "Full day", title: "Leave after breakfast, back for a late dinner", detail: "Ostia Antica from Piramide, or Tivoli for one villa. Do not stack a fountain evening on return." },
          ],
          rainPlan: "Ostia brick still works in light rain. Tivoli terraces become a long indoor lunch — still a day if the rooms are the point.",
        },
        {
          label: "Day 5", theme: "Borghese or Appia, then leftover Rome",
          stops: [
            { time: "Morning", title: "Borghese if you booked it, or Appia if you want stone without a queue", detail: "Pick one." },
            { time: "Afternoon", title: "A nap or San Clemente", detail: "No third museum unless you care." },
            { time: "Evening", title: "Last trattoria near the hotel", detail: "Pack for FCO. Regional or Express matching where you slept." },
          ],
          rainPlan: "Borghese is the rain plan. Skip Appia if it is mud.",
        },
      ],
    },
  ],
  visa: {
    summary: "Schengen / ETIAS when applicable. Confirm official sources, not an airline email.",
    details: ["An airline email is not the law.", "Passport validity rules for Schengen are specific — read them.", "Roma Pass is not an entry document."],
    officialUrl: "https://vistoperitalia.esteri.it/",
  },
  apps: [
    { name: "Trenitalia", purpose: "FCO Express vs regional, Ostia and Tivoli trains", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: false, necessary: "before", note: "Leonardo Express is a ticket, not a metro tap. Screenshot." },
    { name: "Moovit / ATAC / Google Maps", purpose: "Buses, tram 8, walking times the map understates", platforms: "iOS / Android", needLocalNumber: false, needLocalBank: false, offline: true, necessary: "before", note: "Contactless or official tap. Not a paper pass from a stranger at Termini." },
    { name: "Coopculture / Vatican official tickets", purpose: "Colosseum and Vatican QR", platforms: "Web", needLocalNumber: false, needLocalBank: false, offline: false, necessary: "before", note: "Pavement is a tour. Separate mornings." },
  ],
  culture: [
    { title: "Buongiorno before the order", body: "Italian first. The English sentence can wait. You are in someone's bar." },
    { title: "The clock is civic", body: "Lunch 13:00, dinner 20:00. Arriving at 18:00 for a carbonara is how you sit in the fountain belt." },
    { title: "Ruins are in the way", body: "Residents commute past the Forum. You booked a slot; you are not owed a gladiator." },
    { title: "A fountain is a fountain", body: "Trevi is hydraulics and a crowd. Walk past. The neighborhood is Testaccio after dark." },
  ],
  etiquette: [
    { do: "Book official timed slots and greet before you order", dont: "Buy skip-the-line from a pavement clipboard or pose with a gladiator", why: "The official QR is the line you already skipped. The costume is a product." },
    { do: "Eat at 13:00 and 20:00", dont: "Expect a serious kitchen at 18:00", why: "The room has a clock." },
    { do: "Watch the bag on Line A and at Trevi", dont: "Put a phone on a cafe table edge facing the fountain", why: "Pickpockets work here. Bracelet sellers are the opening move." },
  ],
  taboos: [
    "Treating Trevi as a destination you must linger in",
    "Tipping 20%",
    "Touching ruins, fountains, or a gladiator's sword as a pose",
  ],
  safety: [
    { title: "Crowds and bags", body: "Line A, Termini, Trevi, any queue that photographs well. Bag in front. The crime story is theft, not a general menace." },
    { title: "Heat and cobbles", body: "Ankles, August, the Forum with no shade. Water from nasoni. Midday is for shutters." },
    { title: "Nights", body: "Testaccio and Monti are ordinary. Empty centro side streets at 2 a.m. are not charming — take a taxi." },
  ],
  scams: [
    { name: "Gladiator photos", lookFor: "Costumes at the Colosseum offering a pose, then a price", prevent: "A flat no, keep walking", ifItHappens: "You do not owe a photo or a fee; walk to the official gate" },
    { name: "Bracelet / petition", lookFor: "Friendly approach at Trevi, Forum, or Spanish Steps", prevent: "Hands off, keep walking", ifItHappens: "Check pockets and zips immediately" },
    { name: "Pavement skip-the-line", lookFor: "Clipboards at Colosseum or Vatican", prevent: "You already have an official QR", ifItHappens: "Walk to the official door. Do not argue on the pavement." },
  ],
  emergency: [
    { label: "Emergency", value: "112" },
    { label: "Police", value: "113" },
    { label: "Ambulance", value: "118" },
  ],
  accessibility: [
    { title: "Cobbles and stairs", body: "The city is not step-free. Metro elevators fail. Buses can be kinder. Forum and Palatine are a field and a hill." },
    { title: "Interiors", body: "Colosseum has some lifts; confirm. Vatican is a march. Borghese is finite and kinder." },
  ],
  byTraveler: [
    { persona: "First-timers", tips: ["Monti or Testaccio. One ruin morning. Vatican another morning. Trevi is a walk-past."] },
    { persona: "Food", tips: ["Testaccio. Lunch at 13:00. Dinner at 20:00. Skip the fountain-belt menus."] },
    { persona: "Families", tips: ["Borghese park. Gelato as infrastructure. Colosseum early. Midday shutters in July."] },
    { persona: "Limited mobility", tips: ["Cobbles are not a rumour. Taxi ranks after interiors. Skip Palatine as a hill."] },
  ],
  touristsGetWrong: [
    "Colosseum at noon without a ticket",
    "Trevi as a destination rather than a fountain you walk past",
    "Colosseum and Vatican on the same day",
    "A hotel facing the Colosseum",
    "Dinner at 18:00",
    "Roma Pass as a default",
    "Ostia as an afternoon",
  ],
  faq: [
    { q: "Where should I stay?", a: "Testaccio, Monti, or a quiet Trastevere street. Not a hotel facing the Colosseum because the map looks central." },
    { q: "Roma Pass?", a: "Optional math. It pays if you already planned two paid interiors and will ride enough. Most trips walk more than they ride." },
    { q: "Leonardo Express or regional?", a: "Express is faster to Termini and dearer. FL1 is cheaper and better if you sleep in Trastevere, Ostiense, or Testaccio." },
    { q: "Can I do Colosseum and Vatican in one day?", a: "You can collect two queues. Give them separate mornings." },
    { q: "Is Trevi worth it?", a: "It is a fountain. Walk past. Do not build a morning around it." },
    { q: "August?", a: "A furnace. Many kitchens closed. Interiors at open, shutters at 14:00, dinner at 20:00 if you find a room that is cooking." },
  ],
  phrases: [
    { original: "Buongiorno", romanized: "bwon-jor-no", meaning: "Good day", use: "Before you order or ask", avoid: "Starting in English at a neighborhood bar" },
    { original: "Un caffè, per favore", romanized: "oon kaff-eh per fa-vo-reh", meaning: "An espresso, please", use: "Standing at the bar", avoid: "A cappuccino after lunch unless you do not mind the tell" },
    { original: "Il conto", romanized: "eel kon-to", meaning: "The bill", use: "When you are ready", avoid: "Snapping fingers" },
    { original: "No, grazie", romanized: "no grat-syeh", meaning: "No, thank you", use: "Gladiators, bracelets, clipboards", avoid: "Engaging long enough for a wrist to get involved" },
  ],
  sources: [
    { name: "Coopculture", url: "https://www.coopculture.it/", usedFor: "Colosseum / Forum tickets" },
    { name: "ATAC", url: "https://www.atac.roma.it/", usedFor: "City transport" },
    { name: "Trenitalia", url: "https://www.trenitalia.com/", usedFor: "FCO trains, Ostia, Tivoli" },
  ],
});
