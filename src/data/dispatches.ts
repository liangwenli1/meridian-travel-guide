export type DispatchTier = "letter-free" | "pass-briefing";

export type Dispatch = {
  slug: string;
  date: string;
  kicker: { en: string; zh: string };
  title: { en: string; zh: string };
  dek: { en: string; zh: string };
  body: { en: string; zh: string };
  tier: DispatchTier;
};

export const dispatches: Dispatch[] = [
  {
    slug: "after-the-last-train",
    date: "2026-09-04",
    kicker: { en: "Field note", zh: "田野笔记" },
    title: { en: "After the last train", zh: "末班车之后" },
    dek: {
      en: "A city tells the truth between 00:40 and 05:10. We write that hour first, then the museums.",
      zh: "一座城市最诚实的时刻，往往在 00:40 到 05:10。我们先写那几个小时，再写博物馆。",
    },
    tier: "letter-free",
    body: {
      en: `A city tells the truth between 00:40 and 05:10. The last train has already taken the office workers home, and the first train has not yet delivered the morning shift. What remains is a thinner city: delivery bikes, hotel night desks, the few kitchens that never learned how to close, and the people who move through them without needing a map.

We write that hour first because it refuses tourism. No museum is open. No viewpoint sells a ticket. If a neighborhood still feels alive when the schedule collapses, the day guide will hold. If it empties into a parking lot and a 24-hour convenience store, we say so before we recommend an afternoon itinerary.

In Tokyo that means walking from a last Yamanote connection toward a neighborhood that keeps a light on: Shimokitazawa after the clubs thin, Kichijoji when the park gates are locked, Yanaka when only the cats and the late kissaten remain. The point is not romance. The point is calibration. A city that can host you at 2 a.m. without a reservation theater is a city whose daytime advice will not pretend every street is equally walkable.

We clock shade, boredom, and the distance between stations the way other guides clock attractions. After midnight those measurements get honest. A ten-minute walk at noon with water and a phone becomes twenty minutes in the cold with closed shutters. A "lively" strip becomes a service corridor. We note which convenience stores still have seating, which stations still have staff, which alleys still have enough foot traffic that you do not feel like the only foreigner negotiating a locked door.

The same test travels. In Taipei we watch which night markets still have steam after midnight and which ones fold into metal shutters and a single scooter charging under a tarp. In Seoul we check whether the late subway feeder buses still feel like public space or like a private commute you are interrupting. In Lisbon we walk the hills after the last metro and ask whether a traveler with a suitcase would still choose that street at 1 a.m., or whether the guidebook charm ends when the tuk-tuks sleep.

Meridian does not fetishize nightlife. We do not need every city to stay loud. Quiet can be a good answer if it is a true answer. What we refuse is the soft lie: pages that describe a neighborhood as "always buzzing" when the buzz is six restaurants that close at ten and a hotel bar that cards you at the door. After the last train, those lies collapse. What remains is usable: a short list of places that keep a light on, a note about which stations still feel safe to wait in, and an honest sentence about when you should simply take a taxi and sleep.

The museums come later, on purpose. Collections do not change between editions as fast as kitchens and last-train culture do. When we finally write the museum block, it sits on top of a city we have already tested when nobody was selling tickets. That is the Meridian order: night first, daylight second, postcard never.

If you only have three days, you will still spend most of them in daylight. That is fine. The night hour is not a checklist item. It is a method. Write the thin hours first, and the thick hours behave.`,
      zh: `一座城市最诚实的时刻，往往在 00:40 到 05:10。末班车已经把上班族送回家，头班车还没把早班送进城。留下来的是一座更薄的城：外卖车、酒店夜班台、几家从来不会关的厨房，以及不需要地图也能在其间穿行的人。

我们先写那几个小时，因为它拒绝观光。博物馆不开门，观景台不卖票。如果一个街区在时刻表坍塌之后还能活着，白天的指南才站得住；如果它只剩停车场和一家二十四小时便利店，我们会在推荐下午行程之前先把这句话写出来。

在东京，这意味着从山手线末班的某个接点，走向还亮着灯的街区：俱乐部散场后的下北泽、公园门锁上之后的吉祥寺、只剩猫和深夜咖啡店的谷中。重点不是浪漫，是校准。一座能在凌晨两点不用预约剧场也能接待你的城市，它的白天建议才不会假装每条街都同样好走。

我们像别人记录景点那样，记录荫凉、无聊，以及站与站之间的距离。午夜之后，这些量度变得诚实。中午带着水和手机走十分钟的路，夜里变成关着卷帘门的二十分钟；所谓「热闹」的一条街，会露出服务走廊的底色。我们记下哪些便利店还有座位，哪些车站还有人值守，哪些巷子还有足够的行人，让你不觉得自己是唯一在跟锁着的门交涉的外国人。

同一套测试会跟着走。在台北，我们看哪些夜市过了午夜还有蒸汽，哪些已经收成铁皮门和篷布下充电的一台摩托车。在首尔，我们看深夜接驳公交还像不像公共空间，还是像你在打断别人的私人通勤。在里斯本，我们在地铁收班后走上山坡，问一个拖着箱子的旅行者凌晨一点是否还会选那条街，还是导游书里的魅力会在嘟嘟车睡着时一起结束。

Meridian 并不恋栈夜生活。我们不需要每座城都一直吵。安静可以是好答案，只要它是真答案。我们拒绝的是软谎言：把街区写成「总是热闹」，其实热闹只是六家十点关门的餐厅，外加一家门口要查证件的酒店酒吧。末班车之后，这些谎言会塌。留下来的才好用：一份还亮着灯的短名单，一句关于哪些车站还适合等候的备注，以及一句诚实的话——什么时候你该直接打车去睡觉。

博物馆故意放在后面写。馆藏不会像厨房和末班车文化那样，在版本之间变得那么快。当我们终于写下博物馆那一节，它压在一座我们已经在无人售票时测过的城市之上。这就是 Meridian 的顺序：先夜，再昼，从不写明信片。

如果你只有三天，白天仍会占掉大半。没关系。夜里那个小时不是清单项，是方法。先写薄的时刻，厚的时刻才会听话。`,
    },
  },
  {
    slug: "walk-until-the-map-fails",
    date: "2026-08-22",
    kicker: { en: "Method", zh: "方法" },
    title: { en: "Walk until the map fails", zh: "走到地图失灵" },
    dek: {
      en: "Every Meridian guide starts on foot. If a neighborhood cannot be crossed without a taxi, we say so.",
      zh: "每篇指南都从步行开始。如果一个街区离开出租车就过不去，我们会直接写出来。",
    },
    tier: "letter-free",
    body: {
      en: `Every Meridian guide starts on foot. Not because walking is virtuous, and not because we distrust transit. We walk because the map lies politely until someone tests the distance with a body.

A pin on a phone says two neighborhoods are adjacent. A traveler with a suitcase discovers a highway trench, a construction fence, or a hill that turns a "twelve-minute walk" into a negotiation with heat and pride. We write that negotiation down. If a neighborhood cannot be crossed without a taxi, we say so in the first section that recommends lodging there — not in a footnote after you have already booked.

The method is simple and slightly stubborn. We pick a station or a plaza as a hinge, then walk outward until the character of the street changes or the route becomes something you would not ask a friend to do with a daypack. That failure line becomes editorial data. It tells us where a "stay here for three nights" claim should stop, and where a day itinerary should insert a train instead of another charming alley.

Shade matters as much as meters. So do stairs, crossings without countdown signals, and sidewalks that vanish into shared lanes with scooters. In summer cities we time walks by heat, not by apps. In winter cities we time them by wind corridors and whether the route keeps you beside lit shopfronts after dark. The map does not know any of that. The map only knows geometry.

We also walk the boring connectors: the stretch between the pretty canal and the actual grocery, between the hotel cluster and the late kitchen, between the museum exit and the nearest place that will sell you water without a queue. Guides love destinations. Travelers live in connectors. When a connector fails — no shade, no bench, no clear crossing — the destination's rating in our pages drops, even if the destination itself is excellent.

This is why some famous areas get cooler language than the brochure expects. A viewpoint can be worth the ticket and still not be worth the approach if the approach is a dusty shoulder with no return bus until evening. We would rather send you to a lesser-known terrace with a clean walk home than praise a postcard you reach angry and dehydrated.

Walking until the map fails does not mean rejecting cars and trains. It means knowing exactly where the walk stops being a gift. That boundary is where Meridian starts sounding specific: take the tram one stop; cut through the department store air-conditioning; do not drag a hard-shell suitcase down this lane after rain. Specificity is the opposite of filler. It is also the opposite of the infinite scroll of "hidden gems" that all require the same exhausted transfer.

When the map fails, we do not invent a prettier route. We print the failure, then build the itinerary around what still works. That is how a guide becomes something you can trust at 4 p.m. with sore feet — which is the only trust that matters.`,
      zh: `每篇 Meridian 指南都从步行开始。不是因为走路更道德，也不是因为我们不信任公共交通。我们走路，是因为地图会客气地撒谎，直到有人用身体去量那段距离。

手机上的大头针说两个街区相邻。拖着箱子的旅行者却会撞上高速路切口、施工围挡，或一座把「十二分钟步行」变成与炎热和自尊谈判的山坡。我们把这场谈判写下来。如果一个街区离开出租车就过不去，我们会在推荐住宿的第一节就直说——而不是等你订完房，再塞进脚注。

方法很简单，也有点固执。我们选一个车站或广场当铰链，再往外走，直到街道气质变了，或路线变成你不会让朋友背着日用包去做的事。那条失灵线就是编辑数据。它告诉我们「在这里住三晚」该在哪里收住，也告诉我们一日行程该在哪里插入一班车，而不是再塞一条迷人的小巷。

荫凉和米数一样重要。楼梯、没有倒计时的斑马线、突然并进电动车共享道的人行道，也都重要。夏天的城市，我们按热度计时，不按 App；冬天的城市，我们按风廊和天黑后是否还能贴着亮着灯的店面走来计时。地图不懂这些。地图只懂几何。

我们也会走那些无聊的连接段：漂亮运河到真正杂货店之间，酒店集群到深夜厨房之间，博物馆出口到最近一处不用排队就能买水的地方之间。指南爱目的地，旅行者活在连接段里。当连接段失灵——没荫凉、没座位、没清楚的过街——目的地在我们页上的评价就会下降，哪怕目的地本身很好。

所以有些著名区域的措辞，会比宣传册冷。一个观景台可以值那张票，却仍不值那段路——如果那段路是尘土路肩，回程车要等到傍晚。我们宁可送你去一个不那么有名、但走得回家的露台，也不愿夸一张让你又气又渴才抵达的明信片。

走到地图失灵，并不等于拒绝汽车和火车。它意味着准确知道步行在哪里不再是礼物。那条边界，就是 Meridian 开始说得具体的地方：电车多坐一站；从百货公司的空调里穿过去；雨后别拖硬壳箱走这条巷。具体是注水的反面，也是无限下滑的「隐秘宝藏」的反面——那些宝藏往往需要同一次筋疲力尽的换乘。

地图失灵时，我们不发明更漂亮的路线。我们把失灵印出来，再围绕仍然成立的部分写行程。指南因此才能在下午四点、脚已经酸的时候被信任——那是唯一要紧的信任。`,
    },
  },
  {
    slug: "september-light",
    date: "2026-09-01",
    kicker: { en: "Season", zh: "时节" },
    title: { en: "September light", zh: "九月的光" },
    dek: {
      en: "Shoulder season is not a discount. It is when kitchens, hotels, and sidewalks return to locals.",
      zh: "平季不是打折季。那是厨房、旅馆和人行道重新还给当地人的时候。",
    },
    tier: "letter-free",
    body: {
      en: `Shoulder season is not a discount. Marketing loves the word because it sounds like a sale. Meridian uses it differently. September light — and the equivalent weeks in other latitudes — is when kitchens, hotels, and sidewalks return to the people who keep them running the rest of the year.

In peak weeks a city performs. Menus shorten to what photographs well. Hotel lobbies become processing centers. Sidewalks turn into single-file negotiations between tour flags and delivery bikes. None of that is immoral. It is simply a different city from the one a resident recognizes on a Tuesday in early autumn.

We write for the second city. That does not mean we ignore festivals or cherry blossoms or the weeks when everyone wants the same bridge. It means we label those weeks as high-friction, then spend our best pages on the adjacent light: the month when the same bridge has shade again, when the same kitchen will take a walk-in, when the same neighborhood bookstore still has a chair that is not occupied by a content shoot.

September in the northern temperate belt is our recurring case study. School calendars pull some families home. Heat breaks enough that walking becomes a plan rather than a dare. Staff who survived summer finally get a night off, and the service softens without disappearing. You can hear conversations at the next table. You can see the grain of a street that July buried under queues.

The trap is treating shoulder season as universally "better." Some places close. Island ferries thin. Mountain inns take renovation weeks. A beach town in shoulder season can feel like a film set after wrap — beautiful and slightly abandoned. We say that too. Meridian's job is not to sell you the cheapest flight month. It is to tell you which month still has a functioning kitchen within a walk of a bed you would actually sleep in.

Light is practical, not poetic, in our pages. Lower sun angles change photography hours, yes, but they also change how long a plaza stays usable without frying. They change whether a west-facing walk home after dinner feels golden or blinding. They change museum fatigue: cooler air means you finish the second floor instead of fleeing to the café. When we write "best months," we are writing about bodily comfort and civic rhythm, not about a color grade.

If you can only travel in peak season, take the guide's peak notes seriously and ignore anyone who shames you for crowd-sharing a famous street. If you can choose, aim for the weeks when the city is working for itself again. That is September light: not a bargain bin, a return of ordinary excellence.

We will keep shipping guides that name the friction months and the relief months with equal clarity. Shoulder season is a tool. Use it where the kitchens stay open. Skip it where the town goes dark. The light is only useful if the door is unlocked.`,
      zh: `平季不是打折季。营销喜欢这个词，因为它听起来像促销。Meridian 用它的方式不同。九月的光——以及其他纬度里对等的几周——是厨房、旅馆和人行道重新回到常年撑着它们的人手里的时候。

旺季里，城市在表演。菜单收成适合拍照的那几道；酒店大堂变成处理中心；人行道变成导游旗与外卖车之间的单列协商。这些并不不道德。它只是与居民在初秋某个周二认出的那座城，不是同一座。

我们为第二座城写作。这不表示我们忽略节日、樱花，或人人都想上同一座桥的那几周。而是把那些周标记为高摩擦，再把最好的篇幅给旁边的光：同一座桥重新有荫凉的月份，同一间厨房愿意接待散客的月份，同一家街区书店还有一张没被拍摄占用的椅子的月份。

北半球温带的九月，是我们反复使用的案例。学期把一些家庭拉回家；热度降到走路是计划而不是冒险；熬过夏天的员工终于能休一晚，服务变软，却没有消失。你听得见邻桌说话，看得见七月被队列埋住的街道纹理。

陷阱是把平季写成普遍「更好」。有些地方会关门。岛际船班变稀。山间旅馆拿来整修。平季的海滩小镇可能像杀青后的片场——漂亮，又有点被遗弃。我们也会这么写。Meridian 的工作不是把最便宜的机票月份卖给你，而是告诉你哪个月份里，步行范围内仍有还能运转的厨房，旁边还有一张你真愿意睡的床。

在我们的页面里，光是实用的，不是抒情的。低角度阳光会改变拍摄时段，没错，但它也改变广场在不被烤焦的前提下能用多久；改变晚饭后朝西走回家是金色还是刺眼；改变博物馆疲劳：空气凉一点，你就能看完二楼，而不是逃去咖啡店。当我们写「最佳月份」，写的是身体舒适与城市节律，不是调色。

如果你只能在旺季旅行，就认真对待指南里的旺季备注，别理那些因为你和别人挤在同一条著名街上就羞辱你的人。如果能选，就瞄准城市重新为自己运转的那几周。那就是九月的光：不是折扣筐，是寻常卓越的归来。

我们会继续发出把摩擦月与舒缓月写得同样清楚的指南。平季是工具。厨房还开着就用；整座镇熄灯就跳过。门没开，光再好也没用。`,
    },
  },
  {
    slug: "the-table-that-waits",
    date: "2026-09-08",
    kicker: { en: "Kitchen", zh: "厨房" },
    title: { en: "The table that waits", zh: "还在等你的那张桌" },
    dek: {
      en: "A reservation is a rumor. The places that keep a stool for walk-ins are the ones we print.",
      zh: "预订只是传闻。会给散客留一张凳子的地方，我们才印上去。",
    },
    tier: "pass-briefing",
    body: {
      en: `A reservation is a rumor until you are sitting down. Apps confirm; hosts cancel; "fully booked" sometimes means the second seating is still empty while the front-of-house protects a VIP buffer. Meridian does not hate reservations. We hate guides that pretend a booking link is the same thing as a table.

The places we print are the ones that keep a stool for walk-ins — or at least a honest window when a traveler without a three-week plan can still eat well. That stool might be at the counter. It might be the early slot before locals get off work. It might be the rainy Tuesday when the Instagram queue evaporates and the kitchen remembers how to cook for people who showed up because they were hungry.

We test this the unglamorous way. We arrive without a name on a list. We ask for one. We note whether the answer is a system or a person. Systems say "no availability." Persons say "forty minutes if you drink at the bar," or "come back at 8:40," or "sit here, but we close the grill at nine." Those sentences are gold. They go in the guide.

Pass readers get the denser version: which counters still behave this way in shoulder weeks, which famous counters have become reservation-only theater, which neighborhood spots keep a handwritten waitlist that actually moves. Public pages keep the principle and a shorter list. The principle matters more than any single address, because addresses rot and the stool habit does not — or rather, when the stool habit dies, the address should leave our pages.

Why wait for a waiting table at all? Because travel destroys planning bandwidth. Flights slip. Museums run long. Rain rewrites the afternoon. A city that only feeds the organized is a city that punishes curiosity. We want curiosity to remain edible. That means celebrating kitchens that understand walk-ins as part of the neighborhood, not as a threat to the average check.

There is a second reason. Walk-in culture correlates with places that still cook for repeat local business. If every seat is pre-sold to a global queue, the menu freezes into a greatest-hits reel. If a few seats remain for whoever comes through the door, the kitchen stays awake. You taste that difference even if you cannot articulate it between courses.

We still list reservation-only rooms when they are worth the plot. We say exactly how far ahead to try, what time local cancellation leaks open, and when to abandon the chase for something better nearby. The chase itself should be optional. Dinner should not require a second itinerary.

The table that waits is not always empty. Sometimes it is the second chance after a polite refusal, the counter seat beside a regular who nods once and returns to their newspaper, the late bowl when the rice is still correct. We write those tables because they are how a traveler joins a city for an evening without auditioning for it.

If you have Field Pass, the locker holds the current off-season counters and the notes we do not want scraped into a generic "best of" list. If you do not, take the public rule with you anyway: prefer the room that can say yes to a human at the door. The rumor can wait. The stool is the story.`,
      zh: `预订在你坐下之前都只是传闻。App 会确认，店家会取消；「订满」有时只表示第二轮还空着，而门迎在保护一道贵宾缓冲。Meridian 不讨厌预订。我们讨厌把预订链接写成等同于一张桌子的指南。

我们印上去的，是会给散客留一张凳子的地方——或至少留出一个诚实的窗口，让没有三周计划的旅行者仍能吃得好。那张凳子可能在吧台，可能是本地人下班前的早场，可能是下雨的周二，Instagram 队列蒸发，厨房重新记得为因为饿才推门进来的人做菜。

我们用不好看的方式测试。名单上没有名字就到店，开口要位置，看回答来自系统还是来自人。系统说「没有空位」。人说「先在吧台喝四十分钟」，或「八点四十再来」，或「坐这儿，但烤架九点收」。这些句子是金子，会进指南。

Pass 读者会看到更密的版本：哪些吧台在平季几周仍这样运转，哪些名店已变成只能预订的剧场，哪些街区小店还留着一张真的会往前挪的手写候位。公开页保留原则和更短的名单。原则比任何一个地址更重要，因为地址会烂，留凳子的习惯不会——或者说，当留凳子的习惯死了，地址就该离开我们的页面。

为什么非要等一张还在等你的桌？因为旅行会毁掉规划带宽。航班延误，博物馆拖堂，雨改写下午。一座只喂养有组织者的城市，是在惩罚好奇。我们希望好奇仍然可食用。这意味着珍视那些把散客理解成街区一部分、而不是人均威胁的厨房。

还有第二个理由。散客文化，往往与仍为回头本地生意做饭的地方相关。如果每个位子都预售给全球队列，菜单会冻成精选回放；如果还留几个位子给推门进来的人，厨房会保持清醒。哪怕你说不清道道之间的差别，也能尝出来。

我们仍会列出值得那番周折的只接受预订的房间。我们会写清要提前多久试、本地取消何时漏出空位、何时该放弃去追附近更好的东西。追逐本身该是可选项。晚饭不该需要第二套行程。

还在等你的那张桌，并不总是空的。它有时是礼貌拒绝后的第二次机会，是邻座常客点一下头又低头看报的吧台位，是米饭仍然正确的那碗晚点。我们写这些桌子，因为那是旅行者加入一座城过一个晚上、却不必先去试镜的方式。

如果你有 Field Pass，储物柜里放着当下的淡季吧台，以及我们不想被刮进通用「最佳」清单的笔记。如果没有，也请把公开规则带走：优先选择还能对门口的人说「可以」的房间。传闻可以再等。凳子才是故事。`,
    },
  },
];

export function getDispatch(slug: string): Dispatch | undefined {
  return dispatches.find((item) => item.slug === slug);
}

export function listDispatches(): Dispatch[] {
  return [...dispatches].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
