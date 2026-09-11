import type { Localized } from "@/types/pass";

export type ArrivalCard = {
  citySlug: string;
  airport: Localized;
  title: Localized;
  minutes: Localized;
  steps: Localized[];
};

const card = (
  citySlug: string,
  airport: [string, string],
  minutes: [string, string],
  steps: [string, string][],
): ArrivalCard => ({
  citySlug,
  airport: { en: airport[0], zh: airport[1] },
  title: { en: `First four hours · ${airport[0]}`, zh: `落地四小时 · ${airport[1]}` },
  minutes: { en: minutes[0], zh: minutes[1] },
  steps: steps.map(([en, zh]) => ({ en, zh })),
});

export const arrivalCards: ArrivalCard[] = [
  card("tokyo", ["Haneda / Narita", "羽田 / 成田"], ["45–90 min to a bed", "45–90 分钟到床"], [
    ["Monorail or Keisei, not a taxi queue at 22:00 unless you are done.", "单轨或京成。夜里十点除非散了，否则不要去出租车队。"],
    ["Convenience food and water. Do not book a 10:00 interior after a dawn landing.", "便利店和水。黎明落地后不要订十点的内部。"],
    ["One neighborhood. Shower. Sleep on local time.", "一个街区。洗澡。按当地时间睡。"],
    ["Tomorrow is Meiji Jingu or nothing ambitious.", "明天是明治神宫，或不要野心。"],
  ]),
  card("paris", ["CDG / Orly", "戴高乐 / 奥利"], ["45–70 min", "45–70 分钟"], [
    ["RER B or Orlyval, with a strike backup screenshot.", "RER B 或 Orlyval，备一张罢工截图。"],
    ["Bonjour, then a bakery. Not the tower.", "先说 bonjour，然后面包店。不是铁塔。"],
    ["Drop bags in a real arrondissement.", "在真正的区放下行李。"],
    ["Walk to dinner. The Louvre is tomorrow and timed.", "走到晚饭。卢浮宫是明天，而且要定时。"],
  ]),
  card("london", ["Heathrow", "希思罗"], ["35–50 min on Elizabeth line", "伊丽莎白线 35–50 分钟"], [
    ["Purple signs. Contactless. Heathrow Express is speed you pay for.", "紫色指示。轻触。Express 是花钱买的速度。"],
    ["Do not start in Westminster.", "不要从威斯敏斯特开始。"],
    ["A park sandwich or a pub board. Then the hotel.", "公园三明治或酒馆黑板。然后酒店。"],
    ["The museum is tomorrow, one wing.", "博物馆是明天，一个侧厅。"],
  ]),
  card("rome", ["Fiumicino", "菲乌米奇诺"], ["32–50 min to Termini", "32–50 分钟到 Termini"], [
    ["Leonardo Express or regional. Official taxi rank if you land late.", "Leonardo Express 或区域列车。晚到用官方出租车站。"],
    ["Water from a nasoni. Shade. Not Trevi.", "喷泉喝水。荫凉。不是特莱维。"],
    ["Dinner at 21:00 in Monti or Testaccio.", "九点在 Monti 或 Testaccio 吃晚饭。"],
    ["Colosseum is a timed morning, not tonight.", "斗兽场是定时的早晨，不是今晚。"],
  ]),
  card("seoul", ["Incheon", "仁川"], ["43–60 min on AREX", "AREX 43–60 分钟"], [
    ["AREX all-stop is enough. T-money before the first subway.", "AREX 普通车够了。第一趟地铁前备好 T-money。"],
    ["A stew near the hotel. Not the tower.", "酒店附近一碗汤。不是塔。"],
    ["Sleep. Altitude is not the issue; jet lag and humidity are.", "睡。问题不是海拔，是时差和湿度。"],
    ["One palace at open tomorrow.", "明天开园订一座宫殿。"],
  ]),
  card("bangkok", ["Suvarnabhumi", "素万那普"], ["30–50 min", "30–50 分钟"], [
    ["Airport rail or Grab. Heat is the transfer.", "机场铁路或 Grab。热是这段路。"],
    ["Stay near BTS. A stall with office workers, not a tuk-tuk loop.", "住在 BTS 旁。去有上班族的摊，不要嘟嘟车环线。"],
    ["Water, shade, an early night if you landed at dawn.", "水、荫、黎明到就早睡。"],
    ["Grand Palace is an early covered-shoulder morning.", "大皇宫是遮肩的早场。"],
  ]),
  card("singapore", ["Changi", "樟宜"], ["30–45 min on MRT", "MRT 30–45 分钟"], [
    ["MRT is the adult arrival. A taxi is heat insurance with luggage.", "MRT 是成年人的到达。带行李时出租车是防热。"],
    ["Hawker centre, not a mall food court as the whole city.", "小贩中心，不是把商场当成整座城。"],
    ["The rules are real. Read the signs.", "规矩是真的。看指示。"],
    ["One neighborhood walk. Gardens can wait until you have slept.", "一个街区。花园等睡醒。"],
  ]),
  card("new-york", ["JFK / Newark", "JFK / 纽瓦克"], ["45–75 min", "45–75 分钟"], [
    ["AirTrain + LIRR from JFK, or AirTrain + NJ Transit from EWR. A yellow cab is traffic.", "JFK 坐 AirTrain 加 LIRR；纽瓦克坐 AirTrain 加 NJ Transit。黄的是堵车。"],
    ["Bacon-egg-and-cheese. Not an observatory.", "培根蛋芝士。不是观景台。"],
    ["Stay below 14th or in brownstone Brooklyn.", "住在 14 街以南或褐石布鲁克林。"],
    ["The Met is a timed tomorrow. Tonight is the block.", "大都会是明天定时。今晚是这条街。"],
  ]),
  card("kyoto", ["Kansai via HARUKA", "关西机场 HARUKA"], ["75–90 min", "75–90 分钟"], [
    ["HARUKA to Kyoto Station. Then a bus or a taxi up the last hill.", "HARUKA 到京都站。最后一段山用公交或出租。"],
    ["Lunch if the kitchen is open. Kyoto closes early.", "厨房开着就吃午餐。京都关得早。"],
    ["Do not start at Fushimi the same afternoon.", "当天下午不要去伏见。"],
    ["Sleep north or west of the camera belt.", "睡在镜头带的北边或西边。"],
  ]),
  card("barcelona", ["El Prat", "埃尔普拉特"], ["25–40 min", "25–40 分钟"], [
    ["Metro or Aerobús. Official taxi rank if you must.", "地铁或机场公交。必要才打官方出租。"],
    ["Off the Rambla. A market plate at 14:00 if you hit the hour.", "离开兰布拉。赶上点就十四点吃市场。"],
    ["Phone in a front pocket on Line 3.", "三号线手机放前口袋。"],
    ["Sagrada is a timed tomorrow.", "圣家堂是明天定时。"],
  ]),
  card("lisbon", ["LIS metro", "里斯本机场地铁"], ["25–40 min", "25–40 分钟"], [
    ["Red line. Bolt if you have two bags and a hill.", "红线。两个箱子加山坡就用 Bolt。"],
    ["Do not ride 28 as an arrival activity.", "不要把 28 路当到达活动。"],
    ["A pastel standing up, then the hotel.", "站着一个蛋挞，然后酒店。"],
    ["One miradouro at 18:00 if you still have knees.", "还有膝盖的话，六点一个观景台。"],
  ]),
  card("mexico-city", ["MEX", "墨西哥城机场"], ["25–60 min in traffic", "堵车里 25–60 分钟"], [
    ["Authorized taxi or Uber zone. Confirm it is MEX, not AIFA.", "官方出租或 Uber 区。确认是 MEX 不是 AIFA。"],
    ["Water. Slow. Altitude is 2,200 m.", "水。慢。海拔 2200 米。"],
    ["Comida if you hit 14:00. Otherwise a taco and sleep.", "赶上十四点就吃正餐。否则一个塔可然后睡。"],
    ["No pyramid today.", "今天不要金字塔。"],
  ]),
];

export function listArrivalCards() {
  return arrivalCards;
}
