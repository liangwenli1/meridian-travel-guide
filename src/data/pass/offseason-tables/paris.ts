import type { OffseasonTable } from "@/types/pass";

export const parisOffseasonTables: OffseasonTable[] = [
  {
    citySlug: "paris",
    name: {
      en: "11th: lunch formule before the evening crush",
      zh: "十一区：晚高峰前的午餐套餐",
    },
    neighborhood: {
      en: "Oberkampf / République",
      zh: "Oberkampf / 共和国广场",
    },
    why: {
      en: "January and February weekday lunches still have the same kitchen, without the 20:30 wait that Instagram made obligatory. The formule is the city's value system; use it when the terrace is empty and the staff are not performing hospitality.",
      zh: "一月、二月工作日午餐还是同一间厨房，没有 Instagram 弄成义务的八点半排队。套餐是这座城的价值系统；露台空着、店员不必表演招待的时候去用。",
    },
    howToGetIn: {
      en: "Walk from République. Arrive at 12:15, not 13:30. Book only if the room is tiny; otherwise a name at the door is enough. Skip Friday.",
      zh: "从共和国广场步行。十二点十五到，不要一点半。房间极小才预约；否则门口留名即可。避开周五。",
    },
    seasonWindow: {
      en: "Mid-Jan to late Feb, Tue–Thu lunch",
      zh: "一月中旬至二月末，周二至周四午餐",
    },
    watchOut: {
      en: "August is a different emptiness — many kitchens closed. Do not treat August like January.",
      zh: "八月是另一种空——很多厨房放假。别把八月当成一月。",
    },
  },
];
