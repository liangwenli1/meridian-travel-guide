import type { MediaAsset } from "@/types/guide";

const U = "Unsplash";
const UL = "Unsplash License";
const P = "Pexels";
const PL = "Pexels License";
const UO = "https://unsplash.com";
const PO = "https://www.pexels.com";

function shot(
  slug: string,
  file: string,
  alt: string,
  location: string,
  kind: MediaAsset["kind"],
  source: string,
  author: string,
  license: string,
  originalUrl: string,
  extra: { caption?: string; section?: string } = {},
): MediaAsset {
  return {
    url: `https://resource.tapzm.com/media/cities/${slug}/${file}`,
    alt,
    source,
    author,
    license,
    originalUrl,
    location,
    kind,
    caption: extra.caption,
    section: extra.section,
  };
}

export const CITY_GALLERY: Record<string, MediaAsset[]> = {
  tokyo: [
    shot("tokyo", "g01.jpg", "Senso-ji temple gate in Asakusa", "Asakusa", "sight", U, "Su San Lee", UL, UO),
    shot("tokyo", "g02.jpg", "Ramen bowl on a counter", "Tokyo", "eat", U, "Warren Wong", UL, UO),
    shot("tokyo", "g03.jpg", "Tokyo night streets with neon", "Shinjuku", "night", U, "Jezael Melgoza", UL, UO),
    shot("tokyo", "street.jpg", "Shibuya scramble at night", "Shibuya", "street", P, P, PL, PO),
  ],
  paris: [
    shot("paris", "g01.jpg", "Eiffel Tower from the Seine", "7th arrondissement", "sight", U, "Chris Karidis", UL, UO),
    shot("paris", "g02.jpg", "Paris cafe terrace", "Left Bank", "eat", U, "Anthony DELANOIX", UL, UO),
    shot("paris", "night.jpg", "Eiffel Tower lit at night", "Champ de Mars", "night", P, P, PL, PO),
    shot("paris", "g03.jpg", "Louvre pyramid at dusk", "Louvre", "street", U, "Dan Perez", UL, UO),
  ],
  bangkok: [
    shot("bangkok", "g01.jpg", "Wat Arun at dusk", "Chao Phraya", "sight", U, "Florian Wehde", UL, UO),
    shot("bangkok", "g03.jpg", "Street food plates", "Bangkok", "eat", U, "Brooke Lark", UL, UO),
    shot("bangkok", "g02.jpg", "Grand Palace spires", "Rattanakosin", "sight", U, "Nitish Meena", UL, UO),
    shot("bangkok", "street.jpg", "Tuk-tuks in Bangkok traffic", "Bangkok", "street", P, P, PL, PO),
  ],
  singapore: [
    shot("singapore", "g02.jpg", "Gardens by the Bay light trees", "Gardens by the Bay", "sight", U, "Suhyeon Choi", UL, UO),
    shot("singapore", "g03.jpg", "Hawker food on a tray", "Hawker centre", "eat", U, "Lily Banse", UL, UO),
    shot("singapore", "night.jpg", "Marina Bay lights after dark", "Marina Bay", "night", P, P, PL, PO),
    shot("singapore", "g01.jpg", "Marina Bay skyline", "Marina Bay", "street", U, "Hu Chen", UL, UO),
  ],
  "new-york": [
    shot("new-york", "g02.jpg", "Brooklyn Bridge walkway", "Brooklyn Bridge", "sight", U, "Andrés Nieto Porras", UL, UO),
    shot("new-york", "g03.jpg", "New York pizza slice", "New York", "eat", U, "Chad Montano", UL, UO),
    shot("new-york", "night.jpg", "Empire State Building at night", "Midtown", "night", P, P, PL, PO),
    shot("new-york", "g01.jpg", "New York street with yellow cabs", "Manhattan", "street", U, "Luca Bravo", UL, UO),
  ],
  london: [
    shot("london", "g01.jpg", "Westminster and Big Ben", "Westminster", "sight", U, "Benjamin Davies", UL, UO),
    shot("london", "eat.jpg", "Pints on a pub table", "London", "eat", U, U, UL, UO),
    shot("london", "night.jpg", "London Eye and Parliament at night", "South Bank", "night", P, P, PL, PO),
    shot("london", "g02.jpg", "London red bus on a wet street", "London", "street", U, "Luca Bravo", UL, UO),
  ],
  seoul: [
    shot("seoul", "g02.jpg", "Gyeongbokgung palace grounds", "Gyeongbokgung", "sight", U, "Jeongin Cho", UL, UO),
    shot("seoul", "g03.jpg", "Korean barbecue table", "Seoul", "eat", U, "Charles Deluvio", UL, UO),
    shot("seoul", "g01.jpg", "Seoul at night", "Seoul", "night", U, "Patrick Conroy", UL, UO),
    shot("seoul", "street.jpg", "N Seoul Tower over the city at night", "Yongsan", "street", U, U, UL, UO),
  ],
  rome: [
    shot("rome", "g01.jpg", "Colosseum", "Colosseum", "sight", U, "David Kohler", UL, UO),
    shot("rome", "g03.jpg", "Pasta on a Roman table", "Rome", "eat", U, "Dan Gold", UL, UO),
    shot("rome", "night.jpg", "Trevi Fountain", "Trevi", "night", P, P, PL, PO),
    shot("rome", "g02.jpg", "Roman street with ochre buildings", "Rome", "street", U, "Chris Czermak", UL, UO),
  ],
  amsterdam: [
    shot("amsterdam", "g01.jpg", "Amsterdam canal houses and a houseboat", "Canal ring", "sight", P, P, PL, "https://www.pexels.com/photo/2031706/"),
    shot("amsterdam", "eat.jpg", "Coffee on a café table", "Amsterdam", "eat", U, U, UL, UO),
    shot("amsterdam", "night.jpg", "Amsterdam canal after dark", "Canal ring", "night", P, P, PL, PO),
    shot("amsterdam", "street.jpg", "Bikes along an Amsterdam canal", "Jordaan", "street", P, P, PL, PO),
  ],
  istanbul: [
    shot("istanbul", "g01.jpg", "Hagia Sophia and the old city", "Sultanahmet", "sight", U, U, UL, UO),
    shot("istanbul", "eat.jpg", "Meze and bread on a table", "Istanbul", "eat", P, P, PL, PO),
    shot("istanbul", "street.jpg", "Grand Bazaar lanes", "Grand Bazaar", "street", P, P, PL, PO),
    shot("istanbul", "g02.jpg", "Istanbul ferry on the Bosphorus", "Bosphorus", "street", U, U, UL, UO),
  ],
  "hong-kong": [
    shot("hong-kong", "g01.jpg", "Hong Kong harbour towers", "Victoria Harbour", "sight", U, U, UL, UO),
    shot("hong-kong", "eat.jpg", "Dim sum baskets", "Hong Kong", "eat", U, U, UL, UO),
    shot("hong-kong", "night.jpg", "Hong Kong harbour at night", "Victoria Harbour", "night", P, P, PL, PO),
    shot("hong-kong", "street.jpg", "Hong Kong street with taxis", "Hong Kong Island", "street", P, P, PL, PO),
  ],
  sydney: [
    shot("sydney", "g01.jpg", "Sydney Opera House on the harbour", "Circular Quay", "sight", U, U, UL, UO),
    shot("sydney", "eat.jpg", "Oysters and seafood on ice", "Sydney", "eat", P, P, PL, PO),
    shot("sydney", "g02.jpg", "Sydney beach in morning light", "Harbour", "nature", U, U, UL, UO),
  ],
  berlin: [
    shot("berlin", "sight.jpg", "Reichstag and the lawn in front of it", "Mitte", "sight", P, P, PL, PO),
    shot("berlin", "eat.jpg", "Beer glasses on a table", "Berlin", "eat", U, U, UL, UO),
    shot("berlin", "night.jpg", "Berlin TV tower lit at night", "Alexanderplatz", "night", P, P, PL, PO),
    shot("berlin", "g02.jpg", "Berlin street and canal", "Berlin", "street", U, U, UL, UO),
  ],
  taipei: [
    shot("taipei", "hero-v2.jpg", "Taipei 101 above the Xinyi basin from Xiangshan", "Xiangshan", "sight", "Wikimedia Commons", "Wikimedia Commons", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Taipei_Skyline_2022.06.29.jpg", { caption: "101 is optional. The basin is the city. Go up Xiangshan if the weather holds.", section: "things-to-do" }),
    shot("taipei", "g01-v2.jpg", "Taipei 101 at sunset from the hills", "Xiangshan", "nature", "Wikimedia Commons", "Wikimedia Commons", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Taipei_101_sunset_skyline_2015.jpg", { caption: "Outdoor here is a hillside hour, not a national park. Skip if the basin is in cloud.", section: "things-to-do" }),
    shot("taipei", "eat.jpg", "Taipei night market stalls", "Night market", "eat", P, P, PL, "https://www.pexels.com/photo/1134166/", { caption: "One night market is dinner. Not a checklist of markets.", section: "food" }),
    shot("taipei", "g02.jpg", "Taipei night market after dark", "Night market", "night", U, U, UL, UO, { caption: "This is the night: food, not bars. MRT last trains are real.", section: "overview" }),
  ],
  venice: [
    shot("venice", "g01.jpg", "Venice canal and palazzi", "Venice", "sight", U, U, UL, UO),
    shot("venice", "eat.jpg", "Gelato in a cup", "Venice", "eat", P, P, PL, PO),
    shot("venice", "g02.jpg", "Venetian side canal", "Dorsoduro", "street", U, U, UL, UO),
  ],
  marrakech: [
    shot("marrakech", "g01.jpg", "Marrakech medina walls and alley", "Medina", "sight", U, U, UL, UO),
    shot("marrakech", "eat.jpg", "Spice bowls in a souk", "Medina", "eat", P, P, PL, PO),
    shot("marrakech", "tagine.jpg", "Tagine and bread on a table", "Marrakech", "eat", P, P, PL, PO),
    shot("marrakech", "g02.jpg", "Marrakech medina lane with a passing crowd", "Jemaa el-Fnaa", "street", P, P, PL, "https://www.pexels.com/photo/3889843/"),
  ],
  osaka: [
    shot("osaka", "g02.jpg", "Osaka Castle keep and stone walls", "Osaka Castle", "sight", U, U, UL, UO),
    shot("osaka", "eat.jpg", "Ramen in a bowl", "Osaka", "eat", P, P, PL, PO),
    shot("osaka", "g01.jpg", "Dotonbori canal neon at night", "Dotonbori", "night", U, U, UL, UO),
    shot("osaka", "street.jpg", "Lanterns over a food street", "Namba", "street", P, P, PL, PO),
  ],
  "los-angeles": [
    shot("los-angeles", "hero-v2.jpg", "Downtown Los Angeles skyline", "Downtown", "sight", "Wikimedia Commons", "Wikimedia Commons", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Skyline_of_Los_Angeles,_Downtown_Los_Angeles,_California_13.jpg", { caption: "This is one pocket. Do not treat the basin as a stroll.", section: "neighborhoods" }),
    shot("los-angeles", "g01-v2.jpg", "Griffith Observatory over the basin", "Griffith Observatory", "nature", "Wikimedia Commons", "Wikimedia Commons", "Wikimedia Commons", "https://en.wikipedia.org/wiki/Griffith_Observatory", { caption: "Griffith in the morning. Midday heat cooks the hill.", section: "things-to-do" }),
    shot("los-angeles", "eat.jpg", "Tacos on a tray", "Los Angeles", "eat", P, P, PL, PO, { caption: "Al pastor is infrastructure. The line is the review.", section: "food" }),
    shot("los-angeles", "sight.jpg", "Hollywood Walk of Fame stars", "Hollywood", "street", U, U, UL, UO, { caption: "Hollywood Boulevard is optional. Skip it if the stay is a pocket.", section: "things-to-do" }),
  ],
  chicago: [
    shot("chicago", "g01.jpg", "Chicago Theatre on State Street", "Chicago Theatre", "sight", U, U, UL, UO),
    shot("chicago", "eat.jpg", "Pizza on a peel", "Chicago", "eat", U, U, UL, UO),
    shot("chicago", "willis.jpg", "Willis Tower over the Loop", "Willis Tower", "sight", "Wikimedia Commons", "Wikimedia Commons", "Wikimedia Commons", "https://en.wikipedia.org/wiki/Architecture_of_Chicago"),
    shot("chicago", "river.jpg", "Chicago River from the riverwalk", "Chicago River", "street", "Wikimedia Commons", "Wikimedia Commons", "Wikimedia Commons", "https://en.wikipedia.org/wiki/Chicago"),
  ],
  melbourne: [
    shot("melbourne", "g01.jpg", "Melbourne tram and street", "CBD", "sight", U, U, UL, UO),
    shot("melbourne", "eat.jpg", "Coffee in a cup", "Melbourne", "eat", U, U, UL, UO),
    shot("melbourne", "g02.jpg", "Melbourne laneway walls", "Laneways", "street", U, U, UL, UO),
  ],
  dubai: [
    shot("dubai", "g01.jpg", "Burj Al Arab on the water", "Jumeirah", "sight", U, U, UL, UO),
    shot("dubai", "eat.jpg", "Mezze and hummus", "Dubai", "eat", P, P, PL, PO),
    shot("dubai", "g02.jpg", "Burj Khalifa and downtown towers at blue hour", "Downtown", "night", P, P, PL, PO),
  ],
  prague: [
    shot("prague", "g02.jpg", "Charles Bridge in morning light", "Charles Bridge", "sight", U, U, UL, UO),
    shot("prague", "eat.jpg", "Beer glasses on a table", "Prague", "eat", U, U, UL, UO),
    shot("prague", "night.jpg", "Charles Bridge after dark", "Charles Bridge", "night", P, P, PL, PO),
    shot("prague", "g01.jpg", "Prague rooftops and towers", "Old Town", "street", U, U, UL, UO),
  ],
  "cape-town": [
    shot("cape-town", "sight.jpg", "Bo-Kaap houses against Signal Hill", "Bo-Kaap", "sight", P, P, PL, PO),
    shot("cape-town", "eat.jpg", "Oysters and seafood on ice", "Cape Town", "eat", P, P, PL, PO),
    shot("cape-town", "g01.jpg", "Table Mountain over Cape Town", "Table Mountain", "nature", U, U, UL, UO),
    shot("cape-town", "g02.jpg", "Table Mountain over the harbour", "Waterfront", "nature", P, P, PL, PO),
  ],
  hanoi: [
    shot("hanoi", "hero-v2.jpg", "Turtle Tower on Hoan Kiem Lake", "Hoan Kiem", "sight", "Wikimedia Commons", "Wikimedia Commons", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Thap_Rua.jpg", { caption: "Walk the lake at 6:30. By 9:00 it is a souvenir ring.", section: "things-to-do" }),
    shot("hanoi", "eat.jpg", "Pho in a bowl", "Hanoi", "eat", U, U, UL, UO, { caption: "Pho is breakfast. Do not wait until dinner.", section: "food" }),
    shot("hanoi", "street-v2.jpg", "Scooters and a Hang Ma shop in the Old Quarter", "Old Quarter", "street", "Wikimedia Commons", "Wikimedia Commons", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Scooters_in_the_Old_Town_of_Hanoi,_20240204_1453_5838.jpg", { caption: "Stay off the loudest Old Quarter block. Cross like a scooter.", section: "neighborhoods" }),
  ],
  athens: [
    shot("athens", "g01.jpg", "The Acropolis above Athens", "Acropolis", "sight", U, U, UL, UO),
    shot("athens", "eat.jpg", "Greek salad with feta", "Athens", "eat", P, P, PL, PO),
    shot("athens", "night.jpg", "The Acropolis lit at night", "Acropolis", "night", P, P, PL, PO),
    shot("athens", "g02.jpg", "Athens hillside neighbourhood", "Plaka", "street", U, U, UL, UO),
  ],
  florence: [
    shot("florence", "g01.jpg", "Florence rooftops and Duomo", "Duomo", "sight", U, U, UL, UO),
    shot("florence", "eat.jpg", "Gelato in a cup", "Florence", "eat", P, P, PL, PO),
    shot("florence", "g02.jpg", "Ponte Vecchio over the Arno", "Arno", "street", U, U, UL, UO),
  ],
  barcelona: [
    shot("barcelona", "g01.jpg", "Sagrada Família from the street", "Eixample", "sight", U, U, UL, UO),
    shot("barcelona", "eat.jpg", "Paella in a pan", "Barcelona", "eat", P, P, PL, PO),
    shot("barcelona", "night.jpg", "Magic Fountain at Montjuïc at night", "Montjuïc", "night", P, P, PL, PO),
    shot("barcelona", "g02.jpg", "Park Güell mosaic benches", "Park Güell", "street", U, U, UL, UO),
  ],
  kyoto: [
    shot("kyoto", "sight.jpg", "Fushimi Inari shrine gates", "Fushimi Inari", "sight", P, P, PL, PO),
    shot("kyoto", "eat.jpg", "Sushi on a board", "Kyoto", "eat", U, U, UL, UO),
    shot("kyoto", "night.jpg", "Paper lanterns on a street", "Gion", "night", P, P, PL, PO),
    shot("kyoto", "g01.jpg", "Pagoda and wooden streets in Kyoto", "Kyoto", "street", U, "Su San Lee", UL, UO),
  ],
  lisbon: [
    shot("lisbon", "hero-v2.jpg", "Lisbon waterfront toward Santa Engrácia and the Tagus", "Baixa", "sight", "Wikimedia Commons", "Wikimedia Commons", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Lisbon_alfalma.jpg", { caption: "Hills, then downhill to dinner. Tram 28 is a commute.", section: "neighborhoods" }),
    shot("lisbon", "g02.jpg", "Lisbon yellow tram", "Lisbon", "street", U, U, UL, UO, { caption: "Ride a tram that is going somewhere you need. Skip the 28 as a tour.", section: "transport" }),
    shot("lisbon", "eat.jpg", "Pastéis de nata", "Lisbon", "eat", U, U, UL, UO, { caption: "Eat them warm, standing. The famous queue is not the only oven.", section: "food" }),
  ],
  "mexico-city": [
    shot("mexico-city", "hero-v2.jpg", "Palacio de Bellas Artes", "Centro", "sight", "Wikimedia Commons", "Wikimedia Commons", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Bellas_Artes_01.jpg", { caption: "One museum a day. Altitude is the first fact.", section: "things-to-do" }),
    shot("mexico-city", "g02-v2.jpg", "The Zócalo, cathedral and National Palace", "Zócalo", "street", "Wikimedia Commons", "Wikimedia Commons", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Zócalo,_Ciudad_de_México_(32846556446)_(cropped).jpg", { caption: "The square is civic, not a stay. Sleep in Roma or Condesa.", section: "neighborhoods" }),
    shot("mexico-city", "eat.jpg", "Tacos on a plate", "Mexico City", "eat", P, P, PL, PO, { caption: "Al pastor on the spit. Stand. The line is the review.", section: "food" }),
  ],
};
