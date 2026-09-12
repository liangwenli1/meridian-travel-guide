import type { Localized } from "@/types/pass";

const L = (en: string, zh: string): Localized => ({ en, zh });

export type Party = "solo" | "couple" | "family";

export type BookNow = {
  name: Localized;
  leadDays: number;
  skipIfLate: Localized;
};

export type TripCitySpec = {
  citySlug: string;
  bookNow: BookNow[];
  closed: { weekday: number; places: Localized }[];
  stayYes: { name: Localized; who: Localized }[];
  stayNo: { name: Localized; why: Localized };
  waste: Localized[];
  wallet: Localized[];
  arrival: Localized[];
  season: { months: number[]; note: Localized }[];
  party: Record<Party, Localized>;
  skipPass: Localized;
};

export const tripCities: TripCitySpec[] = [
  {
    citySlug: "tokyo",
    bookNow: [
      { name: L("Ghibli Museum (lottery)", "吉卜力美术馆（抽签）"), leadDays: 45, skipIfLate: L("Skip. Mitaka is still a good walk without the museum.", "别硬挤。没有美术馆，三鹰仍然值得走。") },
      { name: L("teamLab Planets / Borderless", "teamLab Planets / Borderless"), leadDays: 14, skipIfLate: L("Walk a garden instead. Do not buy a same-week reseller.", "去花园。不要买黄牛的当周票。") },
      { name: L("Sukiyabashi Jiro-class counters", "次郎级柜台"), leadDays: 21, skipIfLate: L("Eat excellent sushi without a famous name.", "吃没有大名的好寿司。") },
    ],
    closed: [
      { weekday: 1, places: L("Many museums (Tokyo National, some wards). Check the one you care about.", "许多博物馆周一休。核对你要去的那座。") },
    ],
    stayYes: [
      { name: L("Yanaka / Nezu", "谷中 / 根津"), who: L("First stay, quiet mornings", "第一次住，早晨安静") },
      { name: L("Kiyosumi / Monzen-nakacho", "清澄 / 门前仲町"), who: L("East side, good food, fewer cameras", "东边，吃得好，镜头少") },
    ],
    stayNo: { name: L("Kabukicho as a first hotel", "把歌舞伎町当第一晚"), why: L("You will walk it once. You do not need to sleep in it.", "走一次够了，不必睡在里面。") },
    waste: [
      L("Narita taxi at 22:00. Keisei or N'EX is the adult move.", "夜里十点成田出租车。京成或 N'EX 才是成年人。"),
      L("A 72-hour subway-only pass if you already have Suica. JR is half the city.", "已经有 Suica 就别买 72 小时仅地铁通票。JR 是半座城。"),
      L("Airport greeters holding a sign with your name you did not book.", "举着你名字、你没订过的接机牌。"),
    ],
    wallet: [
      L("Suica or Pasmo on the phone before you land. 7-Eleven ATM for yen.", "落地前把 Suica/Pasmo 装进手机。日元用 7-Eleven ATM。"),
      L("Do not tip. IC for trains, convenience food, many taxis.", "不要小费。火车、便利店、许多出租用 IC。"),
    ],
    arrival: [
      L("Monorail or Keisei, not a taxi queue unless you are finished.", "单轨或京成。除非散了，否则不要去出租车队。"),
      L("One neighborhood. Shower. Sleep on local time.", "一个街区。洗澡。按当地时间睡。"),
    ],
    season: [
      { months: [6], note: L("Baiu rain. Indoor mornings, shrine walks between bands.", "梅雨。上午室内，阵雨间隙走神社。") },
      { months: [8], note: L("Heat and Obon crowds. Start at 7:00 or do not start.", "热和盂兰盆。七点开始，否则别开始。") },
      { months: [3, 4], note: L("Sakura prices. Book beds now; parks are the event.", "樱花房价。现在订床；公园才是活动。") },
    ],
    party: {
      solo: L("Counters and depachika. You will not eat alone — you will eat at a counter.", "柜台和地下食品层。你不是一个人吃，是坐在柜台。"),
      couple: L("One timed thing a day. Walk the same ward after dark.", "一天一个定时的东西。天黑后走同一个区。"),
      family: L("Skip teamLab if anyone is under the height line. Parks and trains are the city.", "有人身高不够就跳过 teamLab。公园和电车才是这座城。"),
    },
    skipPass: L("Do not buy a Tokyo subway tourist pass if your phone can hold Suica.", "手机能装 Suica，就别买东京地铁观光通票。"),
  },
  {
    citySlug: "paris",
    bookNow: [
      { name: L("Louvre timed entry", "卢浮宫定时票"), leadDays: 10, skipIfLate: L("Orsay or a garden. Do not buy a street tout for the pyramid.", "奥赛或花园。不要在金字塔外买黄牛票。") },
      { name: L("Catacombs", "地下墓穴"), leadDays: 14, skipIfLate: L("Skip. The line without a ticket is the whole afternoon.", "别去。没票的队是整个下午。") },
      { name: L("Eiffel summit", "埃菲尔峰顶"), leadDays: 14, skipIfLate: L("Second floor, or Trocadéro at dusk, or neither.", "二层，或黄昏特罗卡德罗，或都不要。") },
    ],
    closed: [
      { weekday: 2, places: L("Louvre and many national museums. Do not stack Tuesday as 'museum day'.", "卢浮宫和许多国立博物馆。不要把星期二当成博物馆日。") },
      { weekday: 1, places: L("Some smaller museums. Orsay is closed Monday.", "部分小馆。奥赛周一休。") },
    ],
    stayYes: [
      { name: L("10th / 11th east of Canal Saint-Martin", "十区 / 十一区，圣马丁运河东"), who: L("Walk to dinner, real streets", "走到晚饭，真正的街") },
      { name: L("18th below the basilica, not on it", "十八区在圣心堂下面，不要在上面"), who: L("If you want hills and quieter nights", "要坡和安静的夜") },
    ],
    stayNo: { name: L("A hotel whose only pitch is the tower view", "卖点只有铁塔景的酒店"), why: L("You will look at it once and then fight the 7th for bread.", "看一次，然后在七区为面包打仗。") },
    waste: [
      L("CDG unofficial taxi. Official rank or RER B with a strike screenshot.", "戴高乐黑车。官方站或带着罢工截图坐 RER B。"),
      L("The Paris Museum Pass if you are here three nights and one is Tuesday.", "只待三晚且有一个星期二，博物馆通票不划算。"),
      L("A dinner cruise. Walk the river instead.", "游船晚餐。沿着河走。"),
    ],
    wallet: [
      L("Contactless on metro. Navigo Easy if you dislike tapping a foreign card.", "地铁可轻触。不喜欢刷外卡就买 Navigo Easy。"),
      L("Service is included. Extra tip is a round-up, not 20%.", "服务费已含。小费是凑整，不是 20%。"),
    ],
    arrival: [
      L("Bonjour, bakery, bags in a real arrondissement. The tower is not day one.", "Bonjour，面包店，行李放在真正的区。铁塔不是第一天。"),
    ],
    season: [
      { months: [8], note: L("August: some kitchens closed. Markets and bistros that stay open are the city.", "八月部分厨房关门。还开的市场和酒馆才是城。") },
      { months: [11, 12, 1], note: L("Dark at 17:00. Museums earn their keep; parks do not.", "五点天黑。博物馆值钱，公园不值。") },
    ],
    party: {
      solo: L("Lunch counters and a long bookshop. You do not need a reservation to eat well.", "午餐柜台和一家长书店。吃得好不必订位。"),
      couple: L("One museum, one long dinner. Not both at tourist-o'clock.", "一座博物馆，一顿长晚饭。不要都挤在游客点。"),
      family: L("Luxembourg gardens beat a second museum. Bring snacks; kitchens open late.", "卢森堡花园胜过第二座博物馆。带零食；厨房开得晚。"),
    },
    skipPass: L("Buy timed tickets, not a pass that assumes you will sprint.", "买定时票，不要买假设你会狂奔的通票。"),
  },
  {
    citySlug: "london",
    bookNow: [
      { name: L("Tower of London / Warner if that is the point", "伦敦塔 / 若为华纳"), leadDays: 7, skipIfLate: L("Walk the river. The Tower is a ticketed morning, not a walk-up.", "沿河走。塔是定时早晨，不是即买即进。") },
      { name: L("A West End show you actually want", "你真正想看的西区剧"), leadDays: 10, skipIfLate: L("Same-day TKTS for the second choice, not the first.", "当日 TKTS 给第二选择，不是第一。") },
    ],
    closed: [
      { weekday: 1, places: L("Some smaller museums. The big nationals are often open — still check.", "部分小馆。大馆常开——仍要核对。") },
    ],
    stayYes: [
      { name: L("Zone 2 with a tube stop: Hackney, Peckham, Queen's Park", "2 区有地铁：Hackney、Peckham、Queen's Park"), who: L("Sleep and dinner, then in for one thing", "睡觉吃饭，进城做一件事") },
    ],
    stayNo: { name: L("A Paddington arrival hotel for the whole stay", "整段行程都住帕丁顿到达酒店"), why: L("Fine for a night-before flight. Grim as a base.", "出发前一晚可以。当基地很惨。") },
    waste: [
      L("Heathrow Express unless you are paid to save 12 minutes.", "除非有人付钱让你省 12 分钟，否则别坐 Heathrow Express。"),
      L("The London Pass if your list is free museums and one tower.", "清单是免费博物馆加一座塔，就别买 London Pass。"),
      L("A black cab from Heathrow with four people and no rush — still check the Elizabeth line.", "希思罗黑出租车，四个人也不赶——仍先看伊丽莎白线。"),
    ],
    wallet: [
      L("Contactless. Cap is automatic. Do not buy a paper Travelcard for three days.", "轻触。封顶自动。三天行程不要买纸质 Travelcard。"),
    ],
    arrival: [
      L("Purple signs, Elizabeth line, a park sandwich. Not Westminster at 16:00.", "紫色指示，伊丽莎白线，公园三明治。不要下午四点去威斯敏斯特。"),
    ],
    season: [
      { months: [11, 12, 1, 2], note: L("Wet and early dark. Museums and pubs are the plan; parks are punctuation.", "湿，天黑早。博物馆和酒馆是计划，公园是标点。") },
    ],
    party: {
      solo: L("A gallery at open, a walk, a pub board. You will not be lonely in this city.", "开馆进美术馆，走一段，酒馆黑板。这座城不会让你孤独。"),
      couple: L("One ticketed thing. Then a neighborhood that is not the South Bank loop.", "一个要票的东西。然后一个不是南岸环线的街区。"),
      family: L("The parks are not filler. They are why the city works with children.", "公园不是填充。有孩子时城靠它们运转。"),
    },
    skipPass: L("Contactless capping beats most tourist cards for a short stay.", "短住用轻触封顶，胜过多数观光卡。"),
  },
  {
    citySlug: "rome",
    bookNow: [
      { name: L("Colosseum / Forum timed", "斗兽场 / 广场定时"), leadDays: 14, skipIfLate: L("The Palatine view from outside still works. Do not buy a tout in the square.", "从外面看帕拉蒂诺仍然成立。不要在广场买黄牛。") },
      { name: L("Vatican museums", "梵蒂冈博物馆"), leadDays: 14, skipIfLate: L("St Peter's without the museums is allowed. The Sistine is not a walk-up.", "可以只去圣彼得。西斯廷不是即买即进。") },
    ],
    closed: [
      { weekday: 1, places: L("Many museums. The Vatican has its own calendar — check Sunday / papal days.", "许多博物馆周一休。梵蒂冈自己排期——核对着日。") },
    ],
    stayYes: [
      { name: L("Testaccio or Monti", "Testaccio 或 Monti"), who: L("Dinner you walk to, not a tour bus hotel", "走到晚饭，不是旅游车酒店") },
    ],
    stayNo: { name: L("A hotel that faces the Trevi", "对着特莱维的酒店"), why: L("You will hear it all night and eat worse.", "整晚听见它，吃得更差。") },
    waste: [
      L("Unlicensed Fiumicino rides. Leonardo Express or the official taxi rank.", "菲乌米奇诺黑车。Leonardo Express 或官方出租站。"),
      L("A hop-on bus for a city this walkable in the center.", "中心步行友好，观光巴士多余。"),
    ],
    wallet: [
      L("Tap metro. Carry some cash for tiny bars. No ice in the tap water — drink the nasoni.", "地铁轻触。小酒吧带点现金。自来水不必加冰——喝喷泉。"),
    ],
    arrival: [
      L("Water, shade, dinner at 21:00. The Colosseum is a timed morning.", "水、荫、九点晚饭。斗兽场是定时的早晨。"),
    ],
    season: [
      { months: [7, 8], note: L("Heat. Churches in the morning, interiors at noon, outside after 18:00.", "热。上午教堂，中午室内，六点后户外。") },
    ],
    party: {
      solo: L("One ruin, one long lunch. Rome punishes lists.", "一处遗址，一顿长午餐。罗马惩罚清单。"),
      couple: L("Walk at 21:00. Reservations for the room you care about, not for Trastevere at large.", "九点走。订你在乎的那间，不要订整个特拉斯提弗列。"),
      family: L("Gelato is logistics. Fountains and shade beat a second ticketed site.", "凝胶是后勤。喷泉和荫凉胜过第二张票。"),
    },
    skipPass: L("Timed official tickets beat a Roma Pass you will not fill.", "官方定时票胜过你用不完的 Roma Pass。"),
  },
  {
    citySlug: "seoul",
    bookNow: [
      { name: L("A palace at open if you want empty courts", "想要空院子就开园订宫殿"), leadDays: 3, skipIfLate: L("Still go. Palaces are not Ghibli.", "仍然去。宫殿不是吉卜力。") },
      { name: L("A famous BBQ or tasting-menu room", "有名的烤肉或品尝菜单"), leadDays: 7, skipIfLate: L("The second-best room on the same block is the point of Seoul.", "同一条街第二好的那间才是首尔。") },
    ],
    closed: [
      { weekday: 1, places: L("Some palaces rotate closed days. Check the one you picked.", "部分宫殿轮休。核对你选的那座。") },
    ],
    stayYes: [
      { name: L("Ikseon-dong / Ikseon side of Jongno, or Yeonnam", "益善洞 / 钟路一侧，或延南"), who: L("Walk to food, subway one hop to palaces", "走到吃的，地铁一站到宫殿") },
    ],
    stayNo: { name: L("Myongdong as a base beyond one night", "把明洞当超过一晚的基地"), why: L("Fine for a first shop. Loud and thin after that.", "第一次购物可以。之后吵而薄。") },
    waste: [
      L("Incheon taxi as a default. AREX all-stop is enough.", "默认仁川出租车。AREX 普通车够了。"),
      L("A city pass of attractions you will not stack.", "用不完的景点通票。"),
    ],
    wallet: [
      L("T-money before the first subway. Tipping is not the culture.", "第一趟地铁前备好 T-money。小费不是这里的文化。"),
    ],
    arrival: [
      L("A stew near the hotel. Not the tower. Sleep.", "酒店附近一碗汤。不是塔。睡。"),
    ],
    season: [
      { months: [7, 8], note: L("Monsoon humidity. Palaces at open, cafés as infrastructure.", "梅雨湿度。开园进宫殿，咖啡店是基础设施。") },
      { months: [12, 1], note: L("Cold and clear. Mountains on the metro if you have the clothes.", "冷而晴。有衣服就坐地铁去山。") },
    ],
    party: {
      solo: L("Singing rooms, counters, late soup. The city is built for one.", "练歌房、柜台、深夜汤。这座城为一个人建。"),
      couple: L("One palace, one neighborhood dinner. Hongdae at night is optional.", "一座宫殿，一顿街区晚饭。弘大的夜可选。"),
      family: L("Palaces and rivers. Avoid the loudest basement floors with small children at 22:00.", "宫殿和河。晚上十点不要带小孩去最吵的地下室。"),
    },
    skipPass: L("T-money plus a palace ticket. Skip the bundled attraction pass.", "T-money 加一张宫殿票。跳过打包景点通票。"),
  },
  {
    citySlug: "bangkok",
    bookNow: [
      { name: L("Grand Palace early, covered shoulders", "大皇宫要早，遮肩"), leadDays: 1, skipIfLate: L("Still go at open. Heat is the queue.", "仍然开园去。热才是队。") },
      { name: L("A serious dinner you care about", "你在乎的那顿晚饭"), leadDays: 5, skipIfLate: L("Office-worker stalls are the better Bangkok anyway.", "上班族的摊本来就是更好的曼谷。") },
    ],
    closed: [],
    stayYes: [
      { name: L("Near BTS: Ari, Thonglor, or a river stop you can walk", "靠 BTS：Ari、Thonglor，或能走的河边站"), who: L("Heat is the transfer. Stay on the rail.", "热是换乘。住在轨道上。") },
    ],
    stayNo: { name: L("Khao San as a base if you are not 22 and on a bus", "不是 22 岁坐巴士就别把考山当基地"), why: L("You will spend the trip leaving it.", "整趟旅行都在离开它。") },
    waste: [
      L("Tuk-tuk 'closed palace' loops. Grab or BTS.", "嘟嘟车「宫殿关门」环线。用 Grab 或 BTS。"),
      L("A city pass of temples you can walk between.", "能走着去的庙，不必通票。"),
    ],
    wallet: [
      L("Grab, BTS rabbit or contactless where it works, cash for stalls.", "Grab、BTS rabbit 或能用的轻触，摊位用现金。"),
    ],
    arrival: [
      L("Airport rail or Grab. Water, shade, an early night if you landed at dawn.", "机场铁路或 Grab。水、荫、黎明到就早睡。"),
    ],
    season: [
      { months: [4], note: L("Hottest month. Interiors and rivers. Do not collect temples at noon.", "最热的月。室内和河。中午不要收集寺庙。") },
      { months: [9, 10], note: L("Rain in bands. Plan the palace for a clear morning, not a stubborn one.", "阵雨。宫殿选晴朗早晨，不要硬撑。") },
    ],
    party: {
      solo: L("Stalls with office workers. You will be fed and left alone in the good way.", "有上班族的摊。会把你喂饱，然后好好地不管你。"),
      couple: L("One river, one palace morning, dinners in one neighborhood.", "一条河，一个宫殿早晨，晚饭在同一个街区。"),
      family: L("Malls are air-con infrastructure, not the city. Parks and boats.", "商场是空调基础设施，不是城。公园和船。"),
    },
    skipPass: L("BTS plus Grab. Attraction bundles rarely beat heat-aware planning.", "BTS 加 Grab。景点包很少比得上怕热的规划。"),
  },
  {
    citySlug: "singapore",
    bookNow: [
      { name: L("Gardens by the Bay light show only if that is the point", "滨海湾花园灯光——若那就是目的"), leadDays: 3, skipIfLate: L("A hawker centre is the better first night.", "小贩中心是更好的第一晚。") },
      { name: L("A hawker stall that now takes a queue number", "开始取号的小贩摊"), leadDays: 0, skipIfLate: L("Go early or pick the next stall. Pride is expensive here.", "早去或选隔壁。这里面子很贵。") },
    ],
    closed: [],
    stayYes: [
      { name: L("Tiong Bahru, Jalan Besar, or a MRT-honest Chinatown edge", "中峇鲁、惹兰勿刹，或靠谱地铁的牛车水边缘"), who: L("Walk to dinner, MRT for the rest", "走到晚饭，其余坐地铁") },
    ],
    stayNo: { name: L("Orchard as the whole trip", "把乌节当成整趟旅行"), why: L("You will think the city is a mall.", "你会以为这座城是商场。") },
    waste: [
      L("Jewel as an arrival project. It is an airport mall.", "把星耀樟宜当到达项目。它是机场商场。"),
      L("Every Sentosa add-on stacked in one day.", "圣淘沙所有附加项目堆在一天。"),
    ],
    wallet: [
      L("SimplyGo / contactless. The rules on food and gum are real — read the signs.", "SimplyGo / 轻触。食物和口香糖的规矩是真的——看指示。"),
    ],
    arrival: [
      L("MRT is the adult arrival. Hawker centre, not a mall food court as the whole city.", "MRT 是成年人的到达。小贩中心，不是把商场当成整座城。"),
    ],
    season: [
      { months: [11, 12, 1], note: L("Monsoon squalls. Hawker centres are the plan; outdoor shows are optional.", "季风阵雨。小贩中心是计划，户外表演可选。") },
    ],
    party: {
      solo: L("One hawker, one neighborhood walk. The city is easy to do well alone.", "一个小贩中心，一段街区。独自也能做好。"),
      couple: L("Hawker plus one garden after you have slept. Not both on landing day.", "小贩中心，睡醒后再加一个园。落地当天不要两样都做。"),
      family: L("Hawker trays scale. Gardens after nap. Sentosa is a maybe.", "小贩托盘可分享。午睡后再去园。圣淘沙是也许。"),
    },
    skipPass: L("MRT and a hawker. Attraction passes assume you will collect ticketed rooms.", "地铁加小贩。通票假设你会收集售票房间。"),
  },
  {
    citySlug: "new-york",
    bookNow: [
      { name: L("The Met / MoMA if you care — timed where required", "大都会 / MoMA——需要定时就定时"), leadDays: 5, skipIfLate: L("Walk in at open on a weekday. Do not buy a CityPASS you will not finish.", "工作日开馆走进去。不要买用不完的 CityPASS。") },
      { name: L("A Broadway show you actually want", "你真正想看的百老汇"), leadDays: 10, skipIfLate: L("TKTS for the second choice. The first choice is a decision, not a lottery you skip.", "TKTS 给第二选择。第一选择是决定，不是你跳过的抽签。") },
    ],
    closed: [
      { weekday: 1, places: L("Some museums (MoMA often Tuesday; check). The Met is often open.", "部分博物馆（MoMA 常星期二休；核对）。大都会常开。") },
    ],
    stayYes: [
      { name: L("Below 14th, or brownstone Brooklyn with a train", "14 街以南，或有地铁的褐石布鲁克林"), who: L("Walk to dinner, one train to the museum", "走到晚饭，一班车到博物馆") },
    ],
    stayNo: { name: L("Times Square as a base", "把时代广场当基地"), why: L("You will spend the trip leaving it, loudly.", "整趟旅行都在大声地离开它。") },
    waste: [
      L("JFK yellow cab as a reflex. AirTrain + LIRR is the adult move most hours.", "把 JFK 黄的当反射。多数时段 AirTrain 加 LIRR 才是成年人。"),
      L("An observatory if you already have a high floor or a bridge walk.", "已经有高楼层或桥上的走，就别买观景台。"),
      L("CityPASS math unless you will actually stack three ticketed rooms.", "除非真的堆三间售票馆，否则 CityPASS 算不过来。"),
    ],
    wallet: [
      L("OMNY / contactless. Tip in sit-down rooms. Subway late is ordinary, not brave.", "OMNY / 轻触。坐下来的餐厅给小费。地铁深夜是日常，不是勇敢。"),
    ],
    arrival: [
      L("Bacon-egg-and-cheese. Not an observatory. The Met is a timed tomorrow.", "培根蛋芝士。不是观景台。大都会是明天定时。"),
    ],
    season: [
      { months: [7, 8], note: L("Humid. Museums and early walks. The park at 8:00, not 14:00.", "湿。博物馆和早走。公园八点，不是十四点。") },
      { months: [12, 1], note: L("Wind. Interiors earn their keep. Bridges still work with gloves.", "风。室内值钱。戴手套桥仍然成立。") },
    ],
    party: {
      solo: L("Counters, bookshops, a museum at open. You will not eat alone unless you want to.", "柜台、书店、开馆进博物馆。除非你想，否则不会独自吃饭。"),
      couple: L("One ticketed room, one neighborhood dinner. Skip the second observatory.", "一间售票馆，一顿街区晚饭。跳过第二个观景台。"),
      family: L("The park is not filler. Choose one museum. Strollers on the subway are a skill.", "公园不是填充。选一座博物馆。地铁推车是技能。"),
    },
    skipPass: L("OMNY plus the one museum you care about. CityPASS is a trap if your list is short.", "OMNY 加你在乎的那座博物馆。清单短时 CityPASS 是陷阱。"),
  },
  {
    citySlug: "kyoto",
    bookNow: [
      { name: L("A kaiseki or tea you actually want", "你真正想要的怀石或茶"), leadDays: 14, skipIfLate: L("Convenience food is not a failure. The second-best kappo is still Kyoto.", "便利店不是失败。第二好的割烹仍是京都。") },
      { name: L("Fushimi at open — not a ticket, a clock", "伏见要开园——不是票，是钟"), leadDays: 0, skipIfLate: L("Go at 7:00 or skip the gates and walk the canal.", "七点去，否则跳过千鸟居，走运河。") },
    ],
    closed: [
      { weekday: 1, places: L("Some temples rotate. Check the one you built the morning around.", "部分寺院轮休。核对你围着它建早晨的那座。") },
    ],
    stayYes: [
      { name: L("North or west of the camera belt: Nishijin, along the Kamogawa", "镜头带以北或西：西阵、沿鸭川"), who: L("Sleep where the city still closes", "睡在城还会打烊的地方") },
    ],
    stayNo: { name: L("A hotel whose only pitch is Gion at 20:00", "卖点只有晚上八点祗园的酒店"), why: L("You will stand in a lane of phones.", "你会站在一条手机巷里。") },
    waste: [
      L("A taxi from KIX as a default. HARUKA, then a short hop.", "默认关西机场出租车。HARUKA，然后一小段。"),
      L("Kimono rental as the whole afternoon.", "把和服租赁当成整个下午。"),
    ],
    wallet: [
      L("IC card. Bus is the last mile. Kitchens close early — eat on time.", "IC 卡。公交是最后一公里。厨房关得早——按时吃。"),
    ],
    arrival: [
      L("HARUKA to Kyoto Station. Lunch if the kitchen is open. Not Fushimi the same afternoon.", "HARUKA 到京都站。厨房开着就吃午餐。当天下午不要去伏见。"),
    ],
    season: [
      { months: [10, 11], note: L("Maple crowds. Dawn or nothing at the famous gates.", "红叶人潮。有名的门要么黎明要么不去。") },
      { months: [3, 4], note: L("Sakura prices and paths. One famous site at open, then leave the belt.", "樱花房价和步道。开园去一处名胜，然后离开镜头带。") },
    ],
    party: {
      solo: L("Temples at open, a long lunch, early night. Kyoto rewards one person who is quiet.", "开园进寺，一顿长午餐，早睡。京都奖励安静的一个人。"),
      couple: L("One kaiseki if you booked. Walk the river after, not Gion at peak.", "订了就一顿怀石。之后沿河走，不要高峰去祗园。"),
      family: L("Gardens and trains. Skip the crowded gates with a tired child at 14:00.", "园和电车。十四点别带累了的孩子去拥挤的门。"),
    },
    skipPass: L("IC plus one temple ticket. Bus day passes only if you will actually bus.", "IC 加一张寺院票。真会坐公交再买公交日票。"),
  },
  {
    citySlug: "barcelona",
    bookNow: [
      { name: L("Sagrada Família timed", "圣家堂定时"), leadDays: 14, skipIfLate: L("Look from the outside and go to a market. Do not buy a street QR.", "从外面看，然后去市场。不要买街上的二维码。") },
      { name: L("Park Güell timed zone", "奎尔公园定时区"), leadDays: 7, skipIfLate: L("The free park around it still works.", "周围免费的公园仍然成立。") },
    ],
    closed: [
      { weekday: 1, places: L("Some museums. Markets have their own morning hours — not Monday assumptions.", "部分博物馆。市场有自己的上午——不要用星期一假设。") },
    ],
    stayYes: [
      { name: L("Gràcia or Poble-sec", "Gràcia 或 Poble-sec"), who: L("Dinner you walk to, metro one hop", "走到晚饭，地铁一站") },
    ],
    stayNo: { name: L("On the Rambla", "兰布拉上面"), why: L("You will spend the trip guarding a bag.", "整趟旅行都在护着包。") },
    waste: [
      L("Unlicensed airport rides. Metro, Aerobús, or the official rank.", "机场黑车。地铁、机场公交或官方站。"),
      L("A hop-on bus for a compact center.", "紧凑的中心不必观光巴士。"),
    ],
    wallet: [
      L("T-casual or contactless where it works. Phone in a front pocket on Line 3.", "T-casual 或能用的轻触。三号线手机放前口袋。"),
    ],
    arrival: [
      L("Off the Rambla. A market plate at 14:00 if you hit the hour. Sagrada is tomorrow.", "离开兰布拉。赶上点就十四点吃市场。圣家堂是明天。"),
    ],
    season: [
      { months: [8], note: L("Many locals leave. Heat. Beaches early, interiors noon.", "许多本地人离开。热。海滩要早，中午室内。") },
    ],
    party: {
      solo: L("Markets and Gràcia. You will eat well without a reservation if you go at 14:00.", "市场和 Gràcia。十四点去，没有订位也能吃好。"),
      couple: L("One Gaudí ticket. Then a neighborhood that is not the Gothic loop.", "一张高迪票。然后一个不是哥特区环线的街区。"),
      family: L("Beaches and parks. One ticketed site. Watch pockets on the metro.", "海滩和公园。一个售票点。地铁看口袋。"),
    },
    skipPass: L("Timed Sagrada plus a T-casual. Hola BCN math fails on a short stay.", "定时圣家堂加 T-casual。短住 Hola BCN 算不过来。"),
  },
  {
    citySlug: "lisbon",
    bookNow: [
      { name: L("A miradouro sunset is a clock, not a ticket", "观景台日落是钟，不是票"), leadDays: 0, skipIfLate: L("Go anyway. Knees are the constraint.", "仍然去。膝盖才是限制。") },
      { name: L("A room with a view you will actually sit in", "一间你会真的坐着看的景"), leadDays: 14, skipIfLate: L("A hill street is the view. Do not overpay for a postcard window.", "坡上的街就是景。不要为明信片窗户溢价。") },
    ],
    closed: [
      { weekday: 1, places: L("Many museums. Palácio da Pena if you day-trip Sintra — check the palace day.", "许多博物馆周一休。去辛特拉要核 Palácio da Pena 的日子。") },
    ],
    stayYes: [
      { name: L("Príncipe Real, Estrela, or Graça if you like stairs", "Príncipe Real、Estrela，或喜欢楼梯就 Graça"), who: L("Hills you chose, not hills you were sold", "你选的坡，不是被卖的坡") },
    ],
    stayNo: { name: L("A 'central' hotel that is only central to tram 28", "只对 28 路来说算中心的酒店"), why: L("You will queue for a tram you should not ride as an activity.", "你会去排队坐不该当活动的电车。") },
    waste: [
      L("Tram 28 as an arrival activity. Walk or 28 as transport only.", "把 28 路当到达活动。走，或只当交通。"),
      L("Unlicensed airport rides.", "机场黑车。"),
    ],
    wallet: [
      L("Viva / Navegante visitor. Hills: Bolt with two bags is not a moral failure.", "Viva / 访客 Navegante。两个箱子用 Bolt 不是道德失败。"),
    ],
    arrival: [
      L("Red line. A pastel standing up, then the hotel. One miradouro at 18:00 if you have knees.", "红线。站着一个蛋挞，然后酒店。还有膝盖就六点一个观景台。"),
    ],
    season: [
      { months: [7, 8], note: L("Cruise days and heat. Miradouros early or late, not at 14:00.", "邮轮日和热。观景台要早或晚，不要十四点。") },
    ],
    party: {
      solo: L("Hills and counters. You will be tired and well fed.", "坡和柜台。你会累，也会吃饱。"),
      couple: L("One miradouro, one long dinner. Sintra is a maybe, not a default day.", "一个观景台，一顿长晚饭。辛特拉是也许，不是默认的一天。"),
      family: L("Trams as transport, not rides. Pick one hill, not four.", "电车当交通，不当游乐。选一座坡，不要四座。"),
    },
    skipPass: L("A 24h transit ticket if you will ride. Lisboa Card only if museums are the trip.", "会坐车再买 24 小时票。博物馆才是行程再买 Lisboa Card。"),
  },
  {
    citySlug: "mexico-city",
    bookNow: [
      { name: L("Anthropology museum — go early, not as a ticket race", "人类学博物馆——要早，不是抢票"), leadDays: 0, skipIfLate: L("Still go at open. It is a morning, not an hour.", "仍然开馆去。它是一个上午，不是一小时。") },
      { name: L("A tasting-menu room you care about", "你在乎的品尝菜单"), leadDays: 14, skipIfLate: L("Comida at 14:00 is the better Mexico City anyway.", "十四点的正餐本来就是更好的墨西哥城。") },
    ],
    closed: [
      { weekday: 1, places: L("Many museums. Confirm the anthropology day you built around.", "许多博物馆周一休。核对你围着转的人类学馆。") },
    ],
    stayYes: [
      { name: L("Roma / Condesa, or a walkable slice of Centro you chose", "Roma / Condesa，或你选的可走的市中心一角"), who: L("Altitude plus walkable dinners", "海拔加上走得到的晚饭") },
    ],
    stayNo: { name: L("A hotel you picked only because it is next to a pyramid tour bus", "只因为靠近金字塔旅游车而选的酒店"), why: L("The pyramids are a day trip. Your nights are the city.", "金字塔是一日行程。夜晚才是这座城。") },
    waste: [
      L("Airport lobby brokers. Official taxi rank or the Uber zone. Confirm MEX not AIFA.", "机场大堂黄牛。官方出租或 Uber 区。确认是 MEX 不是 AIFA。"),
      L("A pyramid on landing day. Altitude first.", "落地当天去金字塔。先适应海拔。"),
    ],
    wallet: [
      L("Cards widely, cash for stalls. Water you trust. Tipping is ordinary in sit-down rooms.", "卡很普遍，摊位用现金。喝你信的水。坐下来的餐厅小费是平常。"),
    ],
    arrival: [
      L("Water. Slow. 2,200 m. Comida if you hit 14:00. No pyramid today.", "水。慢。海拔 2200 米。赶上十四点就吃正餐。今天不要金字塔。"),
    ],
    season: [
      { months: [5, 6, 7, 8, 9], note: L("Rain in the afternoon. Museums and comida as the spine; outdoor sites early.", "下午雨。博物馆和正餐是脊梁；户外点要早。") },
    ],
    party: {
      solo: L("Counters, bookshops, a museum morning. The city is generous to one.", "柜台、书店、博物馆上午。这座城对一个人慷慨。"),
      couple: L("One museum, one long comida. Roma at night, not a show you will forget.", "一座博物馆，一顿长正餐。晚上在 Roma，不是一场会忘掉的秀。"),
      family: L("Parks and the anthropology museum in slices. Altitude is slower with children.", "公园，人类学博物馆要切片。有孩子时海拔更慢。"),
    },
    skipPass: L("Metro / Uber plus the museum you came for. Skip bundled pyramid + show packages from the lobby.", "地铁 / Uber 加你来看的博物馆。跳过大堂里的金字塔加演出打包。"),
  },
];

export function getTripSpec(citySlug: string): TripCitySpec | undefined {
  return tripCities.find((row) => row.citySlug === citySlug);
}
