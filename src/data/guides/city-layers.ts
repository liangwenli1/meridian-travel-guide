import type { Localized } from "@/types/pass";

export type CityLayer = {
  eat: Localized;
  night: Localized;
  outdoors: Localized;
  stayNo: Localized;
};

function L(en: string, zh: string): Localized {
  return { en, zh };
}

/** Eat / after dark / outdoors / one free "do not stay" — overview modules. */
export const CITY_LAYERS: Record<string, CityLayer> = {
  tokyo: {
    eat: L(
      "Lunch is the honest meal. Last order is real. Convenience stores are a strategy, not a fallback. Queue 25 minutes for a 12-minute bowl if the bowl is the point.",
      "午餐才是诚实的那一顿。Last order 是真的。便利店是策略，不是将就。如果那碗是目的，可以排 25 分钟吃 12 分钟。",
    ),
    night: L(
      "Nightlife is vertical and signed in Japanese. Kitchens close. The last train is a fact, not a vibe. Drink in the ward you sleep in, or budget the taxi.",
      "夜里是垂直的，招牌是日文。厨房会关。末班车是事实，不是气氛。在你睡的那一区喝，或把出租车算进预算。",
    ),
    outdoors: L(
      "Tokyo's outdoors is a grove, a river path, a morning shrine — not wilderness. Go early. If you want a mountain, that is a day trip with a weather window.",
      "东京的室外是树丛、河岸、清晨的神社，不是荒野。早去。想要山，是带天气窗口的一日行程。",
    ),
    stayNo: L("Do not base in Odaiba or a theme-park hotel for a city trip.", "城市行程不要住台场或乐园酒店。"),
  },
  paris: {
    eat: L(
      "Sit down for lunch. The 16:00 pastry is not a meal. Tuesday is a museum day; many kitchens still take a real break between lunch and dinner.",
      "午饭请坐下来。下午四点的点心不是一顿饭。周二是博物馆日；许多厨房午晚之间真的休息。",
    ),
    night: L(
      "Wine bars and a late kitchen in the arrondissement you sleep in. The Métro is not 24 hours. Crossing the city at 23:30 is a taxi decision.",
      "在你睡的那一区找酒和还开的厨房。地铁不是 24 小时。23:30 穿城是出租车决定。",
    ),
    outdoors: L(
      "The river is the outdoor. One garden, not four. August heat makes the Tuileries a crossing, not a destination.",
      "河才是室外。一座花园，不要四座。八月热的时候杜乐丽是穿过，不是目的地。",
    ),
    stayNo: L("Do not stay by CDG, and do not treat the périphérique cheap ring as Paris.", "不要住戴高乐机场，也不要把环路便宜圈当成巴黎。"),
  },
  bangkok: {
    eat: L(
      "Street food is the kitchen. Eat where the line is locals. One mall food court is a rain plan, not the trip.",
      "街头才是厨房。去本地人排队的地方。商场美食城是下雨方案，不是这趟旅行。",
    ),
    night: L(
      "The city does not close at 21:00. Rooftops are a view; the real night is a soi and a late bowl. BTS/MRT last trains still matter.",
      "这座城 21:00 不会关。天台是风景；真正的夜里是巷子和一碗还开着的面。BTS/MRT 末班车仍重要。",
    ),
    outdoors: L(
      "Outdoors is the river and a park in the morning, before the heat. Islands and floating markets are day trips with a skip condition.",
      "室外是河，以及热起来之前的公园。岛和水上市场是带「什么情况下不去」的一日。",
    ),
    stayNo: L("Do not stay on a soi that is not on the BTS or the river boat.", "不要住在上不了 BTS 或船的巷子。"),
  },
  singapore: {
    eat: L(
      "Hawker first, every day. A white-tablecloth night is optional. Learn one centre near the stay and one you travel for.",
      "每天先去小贩中心。白桌布那晚可有可无。住的附近一家，专程去一家。",
    ),
    night: L(
      "The night is hawker + a bar, not a club crawl. MRT last trains are early by Asian-city standards. Gardens by the Bay after dark is a ticket.",
      "夜里是小贩中心加一家酒吧，不是夜店串。MRT 末班车按亚洲城市标准算早。滨海湾花园夜里是门票。",
    ),
    outdoors: L(
      "The island is green and humid. MacRitchie or a harbour walk in the morning. Midday outdoor is a mistake.",
      "岛是绿的，也是湿的。麦克里奇或港湾散步放早上。中午户外是错。",
    ),
    stayNo: L("Do not stay in Sentosa for a city trip.", "城市行程不要住圣淘沙。"),
  },
  "new-york": {
    eat: L(
      "A slice is infrastructure. A reservation is a different night. Do not cross boroughs for one restaurant unless that is the day.",
      "一块 pizza 是基础设施。订位是另一晚。不要为一家餐厅跨区，除非那天就是为了它。",
    ),
    night: L(
      "Subway is 24 hours; your energy is not. Drink in the pocket you can walk home from. Midtown after 21:00 is office lights, not a scene.",
      "地铁 24 小时，你的精力不是。在能走回去的口袋喝。21:00 后的中城是办公室灯，不是场面。",
    ),
    outdoors: L(
      "A park is a neighborhood, not a vista. One morning in Prospect or the Ramble beats a loop of 'see Central Park'.",
      "公园是街区，不是观景台。Prospect 或 Ramble 的一个早上，好过把中央公园走成清单。",
    ),
    stayNo: L("Do not stay in Times Square for any reason that is not a theatre week you will not leave.", "不要住时代广场，除非那周你真的不下戏院。"),
  },
  london: {
    eat: L(
      "A pub lunch is a meal. So is a market stall. Reservations matter for the rooms you actually want; the rest is walk-in.",
      "酒吧午饭是一顿饭。市场摊也是。真想去的房间才订；其余走进去。",
    ),
    night: L(
      "Last Tube is a fact. Night buses exist and are a different city. Drink near the stay or know the night-line.",
      "末班地铁是事实。夜班车存在，那是另一座城。在住的附近喝，或认得夜线。",
    ),
    outdoors: L(
      "Parks are the outdoor. Hampstead, Kew, or the river — pick one. Rain is the default; the park still works.",
      "公园就是室外。汉普斯特德、邱园或河——选一个。雨是默认；公园仍能走。",
    ),
    stayNo: L("Do not stay airside of the North Circular for a first trip.", "第一次来不要住北环以外。"),
  },
  seoul: {
    eat: L(
      "BBQ is a night. The rest is a counter: kimbap, soup, fried chicken. Palaces close; kitchens do not.",
      "烤肉是一晚。其余是柜台：紫菜包饭、汤、炸鸡。宫殿会关；厨房不会。",
    ),
    night: L(
      "The night is food first. Noraebang and a second kitchen after 22:00. Subway last trains are earlier than the city feels.",
      "夜里先是吃。22:00 后再来一间厨房或练歌房。地铁末班比城市给人的感觉更早。",
    ),
    outdoors: L(
      "A fortress wall or Bukhansan is the outdoor. Morning. The city is a basin; the hill is the weather.",
      "城墙或北汉山才是室外。早上去。城市在盆地里；山上才是天气。",
    ),
    stayNo: L("Do not stay only in Myeongdong if you want to eat after 21:00 without a tourist menu.", "如果 21:00 后还想吃非游客菜单，不要只住明洞。"),
  },
  rome: {
    eat: L(
      "Lunch is the sit-down. Cacio e pepe is a room, not a street. Many kitchens close Monday or between services.",
      "午饭请坐下来。cacio e pepe 是房间，不是街头。许多厨房周一或两餐之间关门。",
    ),
    night: L(
      "A piazza after dark is the night. Clubs are not the point. Last metro exists; taxis fill the gap and the bill.",
      "天黑后的广场就是夜里。夜店不是重点。有末班地铁；出租车补空，也补账单。",
    ),
    outdoors: L(
      "The outdoor is a park and a view — Gianicolo, Appia on a morning. Midday Forum heat is a mistake.",
      "室外是公园和视野——贾尼科洛，或清晨的阿皮亚。中午广场热是错。",
    ),
    stayNo: L("Do not stay west of Termini on the wrong side of the station, or in a Trastevere party street if you sleep.", "不要住特米尼西侧错误的一边，也不要为了睡觉住特拉斯提弗列的派对街。"),
  },
  amsterdam: {
    eat: L(
      "A café is a meal if you let it be. Indonesian and Surinamese rooms are the city's other kitchen. Reservations on canals fill.",
      "咖啡馆可以是一顿饭。印尼和苏里南是这座城的另一间厨房。运河边的订位会满。",
    ),
    night: L(
      "Brown cafés, not only the red-light postcard. Trams thin out. Bikes at 1 a.m. are still the traffic.",
      "褐咖啡馆，不只红灯区明信片。电车会疏。凌晨一点自行车仍是车流。",
    ),
    outdoors: L(
      "The canal is the outdoor. A ferry north. Rain is not a reason to skip; it is the light.",
      "运河就是室外。往北坐船。雨不是不去的理由，那是光。",
    ),
    stayNo: L("Do not stay in a party hostel on the Wallen if you want a morning city.", "想要有早晨的城市，不要住红灯区派对旅舍。"),
  },
  istanbul: {
    eat: L(
      "Breakfast is a table. Kebap is a neighborhood, not a street name. The ferry counts as a meal if you eat on it.",
      "早餐是一桌。烤肉是街区，不是街名。渡轮上吃也算一顿。",
    ),
    night: L(
      "Meyhane and the water. Sultanahmet goes to sleep; Karaköy and Kadıköy do not. Last ferries matter more than last metros.",
      "酒馆和水面。苏丹艾哈迈德会睡；卡拉科伊和卡德柯伊不会。末班船比末班地铁更重要。",
    ),
    outdoors: L(
      "The Bosphorus is the outdoor. A ferry is the hike. Princes' Islands are a full day with a skip-if-weekend rule.",
      "博斯普鲁斯就是室外。渡轮就是徒步。王子群岛是一整天，周末有跳过条件。",
    ),
    stayNo: L("Do not stay only in Sultanahmet unless the monuments are the entire trip.", "除非这趟只看古迹，不要只住苏丹艾哈迈德。"),
  },
  "hong-kong": {
    eat: L(
      "Dim sum is a morning. Dai pai dong and a mall food hall are both real. Reservations for the rooms; the rest is a ticket and a tray.",
      "早茶是早上。大排档和商场食肆都算。房间要订；其余是筹和托盘。",
    ),
    night: L(
      "The harbour is the night view. Drinking is a district: Soho, Kennedy, a hotel bar. MTR last trains are early; night buses exist.",
      "海港是夜景。喝是一个区：Soho、坚尼地、酒店吧。港铁末班早；有夜班车。",
    ),
    outdoors: L(
      "Forty percent of the territory is country park. The Peak, Sai Kung, or a harbour walk — pick one shape of day, check the weather.",
      "四成土地是郊野公园。山顶、西贡或海港——选一种日子的形状，看天气。",
    ),
    stayNo: L("Do not stay in Tung Chung unless the airport is the point.", "除非为了机场，不要住东涌。"),
  },
  sydney: {
    eat: L(
      "Seafood at a counter. A pub lunch after the beach. Reservations for the rooms with a view; the rest is a morning market.",
      "柜台海鲜。海滩后的酒吧午饭。有景的房间要订；其余是早市。",
    ),
    night: L(
      "The harbour at blue hour, then a neighborhood dining room. The city is not 24 hours. Trains thin; rideshare fills.",
      "蓝调时刻的港湾，然后一间街区餐厅。不是 24 小时的城。火车会疏；网约车补。",
    ),
    outdoors: L(
      "The beach is the outdoor, and it is a morning. Bondi at noon is a postcard crowd. Harbour walks on weekdays.",
      "海滩就是室外，而且是早上。中午的邦迪是明信片人群。港湾步道选工作日。",
    ),
    stayNo: L("Do not stay at the airport end of the train if the harbour is the trip.", "如果这趟是港湾，不要住机场那一端。"),
  },
  berlin: {
    eat: L(
      "Döner is infrastructure. The interesting rooms are in the neighborhoods, not Unter den Linden. Monday closures are common.",
      "Döner 是基础设施。有意思的房间在街区，不在菩提树下大街。周一关门很常见。",
    ),
    night: L(
      "This is a night city if you want it — clubs, bars, late kitchens. It is also a city that lets you sleep. U-Bahn is not 24 hours every night.",
      "如果你要，这是夜之城——俱乐部、酒吧、晚厨房。它也允许你睡。地铁不是每晚 24 小时。",
    ),
    outdoors: L(
      "Parks, canals, Tempelhof. The outdoor is urban green, not Alps. A lake is a half-day with S-Bahn.",
      "公园、运河、坦佩尔霍夫。室外是城里的绿，不是阿尔卑斯。湖是半日，坐快铁。",
    ),
    stayNo: L("Do not stay only at Alexanderplatz unless the train is the whole point.", "除非为了火车，不要只住亚历山大广场。"),
  },
  taipei: {
    eat: L(
      "One night market is dinner, not a tour of markets. Beef noodle and a breakfast shop are the other two meals. Rain is the default kitchen weather.",
      "一个夜市是晚饭，不是夜市巡回。牛肉面和早餐店是另外两顿。雨是默认的厨房天气。",
    ),
    night: L(
      "The night is food. 101 is optional. MRT last trains are real — EasyCard, then a taxi if you miss them. Zhongshan and Daan stay awake later than the postcard old street.",
      "夜里是吃。101 可去可不去。MRT 末班是真的——悠游卡，错过再出租车。中山和大安比明信片老街更晚睡。",
    ),
    outdoors: L(
      "Xiangshan, Beitou, or a riverside path. The basin traps weather. If the mountain is in cloud, soak instead of climb.",
      "象山、北投或河滨。盆地会困住天气。山在云里就去泡，不要爬。",
    ),
    stayNo: L("Do not stay at the airport end of the airport MRT for a city trip.", "城市行程不要住机场捷运那一端。"),
  },
  venice: {
    eat: L(
      "Cicchetti standing up. A sit-down lunch away from the San Marco funnel. Dinner is earlier than you think once kitchens staff for day-trippers.",
      "站着吃 cicchetti。午饭坐在圣马可漏斗以外。厨房为日游客排班后，晚饭比你想的早。",
    ),
    night: L(
      "After the day-trippers leave, the city is a campo and a glass. It is not a club. Vaporetti thin; know the last boat to your island or sestiere.",
      "日游客走了，城里是广场和一杯酒。不是夜店。船会疏；知道回你那一区的末班。",
    ),
    outdoors: L(
      "The outdoor is water and light. A Lido morning if you need sand. Acqua alta is a season, not a vibe.",
      "室外是水和光。需要沙子就去利多的早上。涨水是季节，不是气氛。",
    ),
    stayNo: L("Do not stay on the mainland and commute in 'to save money' unless you like losing an hour each way.", "不要为了省钱住大陆每天通勤，除非你喜欢单程少一小时。"),
  },
  marrakech: {
    eat: L(
      "Tagine is a room. Square food after 19:00 is a show. Lunch in the medina; dinner where you can hear yourself.",
      "塔吉锅是房间。19:00 后的广场食物是一场秀。午饭在麦地那；晚饭去听得见自己的地方。",
    ),
    night: L(
      "The square is the night, then a rooftop. The medina is not 24-hour. Get lost on purpose before 22:00, not after.",
      "广场是夜里，然后屋顶。麦地那不是 24 小时。22:00 前故意迷路，之后不要。",
    ),
    outdoors: L(
      "Gardens and a palm grove. The Atlas is a day with a driver and a weather check. Midday medina sun is a reason to be inside.",
      "花园和棕榈林。阿特拉斯是带司机和天气检查的一日。中午麦地那的太阳是进屋的理由。",
    ),
    stayNo: L("Do not stay in a party riad on a drum street if you need mornings.", "需要早晨的话，不要住鼓声街上的派对庄园。"),
  },
  osaka: {
    eat: L(
      "This is a kitchen city. Okonomiyaki, kushikatsu, a bowl at 23:00. Kyoto is the temple; Osaka is dinner.",
      "这是厨房之城。大阪烧、串炸、23:00 的一碗。京都是庙；大阪是晚饭。",
    ),
    night: L(
      "Dotonbori is a walk, not a meal plan. The second kitchen is the night. Last trains from Namba are the constraint.",
      "道顿堀是散步，不是吃饭计划。第二间厨房才是夜里。难波的末班车是约束。",
    ),
    outdoors: L(
      "Castle park and the river. If you want a mountain, that is Koyasan or a day out — not this stay.",
      "城公园和河。想要山，那是高野山或出城一日——不是这趟住宿。",
    ),
    stayNo: L("Do not stay only in a mega-mall hotel if you came to eat after 21:00 on foot.", "如果 21:00 后还想走路去吃，不要只住超大商场酒店。"),
  },
  "los-angeles": {
    eat: L(
      "Al pastor is infrastructure. The line is the review. K-Town after 21:00 is still a kitchen. Do not drive across the basin for one taco.",
      "Al pastor 是基础设施。队伍就是评价。韩国城 21:00 后厨房还开。不要为了一个 taco 穿过盆地。",
    ),
    night: L(
      "K-Town is the night kitchen. Santa Monica sleeps earlier than the map looks. Metro is not 24 hours. Drink in the pocket you can TAP or walk home from.",
      "韩国城是夜里的厨房。圣莫尼卡比地图看起来更早睡。地铁不是 24 小时。在能 TAP 或走回去的口袋喝。",
    ),
    outdoors: L(
      "A beach before 10:00, Griffith in the morning, canyon only if the fire season says yes. Midday outdoor is heat plus traffic.",
      "海滩放 10:00 前，格里菲斯放早上，峡谷只在火季允许时去。中午户外是热加车。",
    ),
    stayNo: L("Do not stay on Hollywood Boulevard, and do not treat LAX-adjacent as a neighborhood.", "不要住好莱坞大道，也不要把机场旁边当成一个街区。"),
  },
  chicago: {
    eat: L(
      "Tavern-style is the pizza that locals mean. A sit-down steak is a different night. Don't build a day around a stuffed-crust queue.",
      "本地人说的 pizza 是酒馆薄饼。牛排是另一晚。不要为一整天的厚饼排队。",
    ),
    night: L(
      "Jazz, a bar in the neighborhood you sleep in, a late kitchen in Logan or West Loop. The L is not 24 hours on every line.",
      "爵士、你睡的那一区的酒吧、Logan 或西环还开的厨房。高架铁路不是每条线 24 小时。",
    ),
    outdoors: L(
      "The lake is the outdoor. A path in the morning, a beach if the wind allows. Winter is a different city; believe it.",
      "湖就是室外。早上步道，风允许就海滩。冬天是另一座城；请相信。",
    ),
    stayNo: L("Do not stay airside of the Loop without a reason that is a specific restaurant or a friend.", "没有特定餐厅或朋友的理由，不要住在 Loop 外侧。"),
  },
  melbourne: {
    eat: L(
      "Coffee is a meal structure. Laneway rooms and a Vietnamese lunch in Richmond. Reservations for dinner; breakfast is walk-in.",
      "咖啡是一顿饭的结构。巷子里的房间，Richmond 的越南午饭。晚饭订；早餐走进去。",
    ),
    night: L(
      "Bars in laneways, a late kitchen, live rooms. Trams thin. The grid is walkable if the stay is the right pocket.",
      "巷子酒吧、晚厨房、现场。电车会疏。住对口袋，格子路可以走。",
    ),
    outdoors: L(
      "A bay beach or the gardens. The Great Ocean Road is a full day with a skip-if-tired rule, not a squeeze after coffee.",
      "海湾海滩或花园。大洋路是一整天，累了就跳过，不是喝完咖啡再塞。",
    ),
    stayNo: L("Do not stay at the airport end of the Tullamarine if the laneways are the trip.", "如果这趟是巷子，不要住图拉马林那一端。"),
  },
  dubai: {
    eat: L(
      "Shawarma is the honest counter. A reservation is a different room and a different bill. Friday brunch is a social fact, not a breakfast.",
      "沙威玛是诚实的柜台。订位是另一间房、另一张账单。周五早午餐是社交事实，不是早餐。",
    ),
    night: L(
      "The night is a view and a licensed room. Heat makes outdoor late. Metro last trains exist; taxis are the default after.",
      "夜里是风景和有酒牌的房间。热让户外变晚。地铁有末班；之后默认出租车。",
    ),
    outdoors: L(
      "Desert is a morning or a sunset, not midday. The creek and a waterfront walk before the heat. Indoor is not a failure.",
      "沙漠是早上或日落，不是中午。热起来之前走溪湾。进室内不是失败。",
    ),
    stayNo: L("Do not stay on the Palm for a first city trip unless the hotel is the trip.", "第一次来不要住棕榈岛，除非酒店本身就是这趟。"),
  },
  prague: {
    eat: L(
      "A sit-down Czech lunch. Tourist menus on the Old Town square are a tax. Reservations in Malá Strana fill in peak.",
      "坐下来吃捷克午饭。老城广场游客菜单是税。小城的订位旺季会满。",
    ),
    night: L(
      "Beer halls and a river walk. The castle side sleeps earlier. Trams cover the last hour better than walking the cobbles drunk.",
      "啤酒馆和河岸。城堡那边睡得早。末班电车比醉走石头路更靠谱。",
    ),
    outdoors: L(
      "Petřín and the river. A day to Karlštejn if the weather holds. The outdoor is a hill, not a wilderness.",
      "佩特任和河。天气好就去卡尔施泰因一日。室外是山丘，不是荒野。",
    ),
    stayNo: L("Do not stay inside the Old Town funnel if you want to sleep, or in a party hostel on a beer street.", "想睡觉不要住老城漏斗里，也不要住啤酒街上的派对旅舍。"),
  },
  "cape-town": {
    eat: L(
      "Seafood at a counter, a Cape Malay room, wine as a lunch if the day is the winelands. Reservations for the view rooms.",
      "柜台海鲜、开普马来房间；如果那天是酒乡，酒可以当午饭。有景的房间要订。",
    ),
    night: L(
      "The night is a dining room and a view, not a 4 a.m. city. Ubers are the late transport. Stay where dinner is.",
      "夜里是餐厅和风景，不是凌晨四点的城。晚归靠 Uber。住在晚饭所在的地方。",
    ),
    outdoors: L(
      "Table Mountain is the trip shape. Cable as a weather ticket — if the cloth is on, skip. Beaches and the peninsula are other days, not the same afternoon.",
      "桌山是这趟的形状。缆车是天气票——有桌布就跳过。海滩和半岛是别的日子，不是同一个下午。",
    ),
    stayNo: L("Do not stay on the wrong side of the mountain from your dinners without a car plan.", "没有用车计划的话，不要住在和晚饭隔山的那一侧。"),
  },
  hanoi: {
    eat: L(
      "Pho is breakfast. Bun cha is lunch. The Old Quarter is a kitchen and a trap; eat one famous bowl, then follow a line of locals.",
      "河粉是早餐。Bun cha 是午饭。老街区是厨房也是陷阱；吃一碗有名的，然后跟本地人的队。",
    ),
    night: L(
      "Bia hoi plastic stools, then sleep. The quarter gets loud, not late-club. Grab is the last ride. Stay off the loudest block.",
      "Bia hoi 塑料凳，然后睡。街区是吵，不是夜店晚。Grab 是最后一程。不要住最吵的那条。",
    ),
    outdoors: L(
      "Hoan Kiem at 6:30. West Lake as a loop. Ha Long is a full day or an overnight — not a squeeze after lunch.",
      "还剑湖 6:30。西湖一圈。下龙湾是一整天或过夜——不是午饭后塞进去。",
    ),
    stayNo: L("Do not stay on the loudest Old Quarter block, and do not treat the airport road as a neighborhood.", "不要住老街区最吵的那条，也不要把机场路当成街区。"),
  },
  athens: {
    eat: L(
      "A taverna lunch in the neighborhood, not under the Acropolis. Horiatiki is a season. Reservations for the rooms you actually want.",
      "在街区吃酒馆午饭，不要在卫城脚下。乡村沙拉有季节。真想去的房间才订。",
    ),
    night: L(
      "Wine in Pangrati or Koukaki, a late kitchen. The Acropolis lights are the view. Metro last trains exist; taxis fill Plaka's bill.",
      "在 Pangrati 或 Koukaki 喝酒，晚厨房。卫城灯是风景。有末班地铁；普拉卡的出租车会写进账单。",
    ),
    outdoors: L(
      "The Acropolis is a morning ticket. Lycabettus or a coast day if the heat allows. Midday marble is a mistake.",
      "卫城是早上的票。热允许就 Lycabettus 或海边一日。中午的大理石是错。",
    ),
    stayNo: L("Do not stay on a party street in Plaka if you came for mornings on the hill.", "如果为了山上的早晨而来，不要住普拉卡派对街。"),
  },
  florence: {
    eat: L(
      "Schiacciata and a coffee is lunch. A steak is a night and a reservation. The Duomo funnel restaurants are a tax.",
      "Schiacciata 加咖啡是午饭。牛排是一晚，要订。大教堂漏斗里的餐厅是税。",
    ),
    night: L(
      "A wine window, an Oltrarno room. The historic centre sleeps earlier than the map. Walk, or know the last bus to your stay.",
      "窗口酒、Oltrarno 的房间。历史中心比地图睡得早。走路，或知道回住处的末班公交。",
    ),
    outdoors: L(
      "Boboli or a hill town is the outdoor. Piazzale Michelangelo at sunset is a crowd. Fiesole is a half-day with a view.",
      "波波里或一座山城才是室外。米开朗基罗广场日落是人群。菲耶索莱是半日带风景。",
    ),
    stayNo: L("Do not stay across the station tracks 'to save' if your days are the centre.", "如果白天在中心，不要为了省钱住车站轨道对面。"),
  },
  barcelona: {
    eat: L(
      "Tapas is a street and a time. Paella on the Rambla is a tax. Reservations for the rooms; the rest is Blai or a market stool.",
      "Tapas 是一条街、一个时刻。兰布拉的海鲜饭是税。房间要订；其余是 Blai 或市场凳。",
    ),
    night: L(
      "Vermouth, then a late kitchen in the neighborhood. Superclubs exist and are a different trip. Metro last trains matter.",
      "苦艾酒，然后街区晚厨房。超级夜店存在，那是另一趟。地铁末班重要。",
    ),
    outdoors: L(
      "A beach that is not Barceloneta, or Collserola if you want a hill. The city is Mediterranean; midday in August is a siesta.",
      "不是巴塞洛内塔的海滩，或者想要山就去 Collserola。城是地中海的；八月中午是午休。",
    ),
    stayNo: L("Do not stay on Las Ramblas, and do not treat the airport Prat as a neighborhood.", "不要住兰布拉，也不要把普拉特机场当成街区。"),
  },
  kyoto: {
    eat: L(
      "A noodle bowl, a tofu room, a night market only if you are in that ward. Reservations for kaiseki; the rest is a ticket machine.",
      "一碗面、一间豆腐、夜市只在你住的那一区才算。怀石要订；其余是售票机。",
    ),
    night: L(
      "Gion is lanterns and an early close. Ponto-cho is a walk. Last buses from the hills are the constraint — temples are a daytime city.",
      "祇园是灯笼和早收。先斗町是散步。山上末班公交是约束——庙是白天的城。",
    ),
    outdoors: L(
      "Fushimi is a mountain, not a photo alley. Arashiyama is a morning. Rain changes the moss; it does not cancel the walk.",
      "伏见是山，不是拍照巷。岚山是早上。雨改变青苔，不取消走。",
    ),
    stayNo: L("Do not stay next to Kyoto Station if your days are the east or north temples.", "如果白天在东边或北寺，不要住京都站旁边。"),
  },
  lisbon: {
    eat: L(
      "Pastéis warm, standing. A sit-down lunch downhill from the stay. Tram 28 is not a food tour.",
      "蛋挞要热的，站着吃。午饭从住处往下坡坐下来。28 电车不是美食团。",
    ),
    night: L(
      "Fado is a room and a time. Bairro Alto is a street. Last trams and hills at 1 a.m. are a taxi. Sleep where dinner is downhill.",
      "Fado 是房间和时刻。Bairro Alto 是一条街。凌晨一点的电车和坡是出租车。睡在晚饭在下坡的地方。",
    ),
    outdoors: L(
      "A miradouro in the morning, Belém as a half-day, Sintra as a full day with a skip-if-weekend rule. The Atlantic is the light.",
      "观景台放早上，贝伦半天，辛特拉一整天、周末可跳过。大西洋是光。",
    ),
    stayNo: L("Do not stay in a party street in Bairro Alto if you need mornings, or in Belém as a base.", "需要早晨不要住 Bairro Alto 派对街，也不要把贝伦当基地。"),
  },
  "mexico-city": {
    eat: L(
      "Al pastor on the spit. A market lunch. One tasting menu is a night, not the template. Altitude makes the first meal slower.",
      "旋转烤肉。市场午饭。一顿品尝菜单是一晚，不是模板。海拔让第一顿更慢。",
    ),
    night: L(
      "Roma and Condesa stay up. Centro sleeps in patches. Metro is not a late-night plan; an app ride is. Drink where you sleep.",
      "Roma 和 Condesa 不睡。中心区一块块睡。地铁不是深夜方案；用软件叫车。在睡的地方喝。",
    ),
    outdoors: L(
      "Chapultepec is infrastructure — a lung, not a picnic photo. Teotihuacan is a morning with altitude. The city is a plateau.",
      "查普尔特佩克是基础设施——肺，不是野餐照。特奥蒂瓦坎是带海拔的早上。城在高原上。",
    ),
    stayNo: L("Do not stay on the Zócalo as a hotel strategy, and do not treat the airport road as Roma.", "不要把索卡洛当住宿策略，也不要把机场路当成 Roma。"),
  },
};

export const GUIDE_UPDATED = "2026-09-13";
