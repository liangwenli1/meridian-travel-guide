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
    shot("sydney", "g02.jpg", "Sydney beach in morning light", "Harbour", "street", U, U, UL, UO),
  ],
  berlin: [
    shot("berlin", "sight.jpg", "Reichstag and the lawn in front of it", "Mitte", "sight", P, P, PL, PO),
    shot("berlin", "eat.jpg", "Beer glasses on a table", "Berlin", "eat", U, U, UL, UO),
    shot("berlin", "night.jpg", "Berlin TV tower lit at night", "Alexanderplatz", "night", P, P, PL, PO),
    shot("berlin", "g02.jpg", "Berlin street and canal", "Berlin", "street", U, U, UL, UO),
  ],
  taipei: [
    shot("taipei", "g01.jpg", "Taipei 101 above the basin at dusk", "Taipei", "sight", P, P, PL, "https://www.pexels.com/photo/2506923/"),
    shot("taipei", "eat.jpg", "Taipei night market stalls", "Night market", "eat", P, P, PL, "https://www.pexels.com/photo/1134166/"),
    shot("taipei", "g02.jpg", "Taipei night market after dark", "Night market", "night", U, U, UL, UO),
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
    shot("los-angeles", "sight.jpg", "Hollywood Walk of Fame stars", "Hollywood", "sight", U, U, UL, UO),
    shot("los-angeles", "eat.jpg", "Tacos on a tray", "Los Angeles", "eat", P, P, PL, PO),
    shot("los-angeles", "g01.jpg", "Palm trees and downtown Los Angeles towers", "Downtown Los Angeles", "street", U, U, UL, UO),
    shot("los-angeles", "g02.jpg", "Los Angeles basin from a hillside", "Los Angeles", "street", U, U, UL, UO),
  ],
  chicago: [
    shot("chicago", "g01.jpg", "Chicago Loop elevated tracks from the street", "Loop", "sight", U, U, UL, UO),
    shot("chicago", "eat.jpg", "Pizza on a peel", "Chicago", "eat", U, U, UL, UO),
    shot("chicago", "night.jpg", "Chicago river and towers at night", "Chicago River", "night", P, P, PL, PO),
    shot("chicago", "g02.jpg", "Chicago River and Loop towers from a riverwalk", "Chicago River", "street", P, P, PL, PO),
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
    shot("cape-town", "g01.jpg", "Table Mountain over Cape Town", "Table Mountain", "street", U, U, UL, UO),
    shot("cape-town", "g02.jpg", "Table Mountain over the harbour", "Waterfront", "street", P, P, PL, PO),
  ],
  hanoi: [
    shot("hanoi", "g01.jpg", "Hanoi lake and Old Quarter light", "Hoan Kiem", "sight", U, U, UL, UO),
    shot("hanoi", "eat.jpg", "Pho in a bowl", "Hanoi", "eat", U, U, UL, UO),
    shot("hanoi", "g02.jpg", "Hanoi street with scooters and stalls", "Old Quarter", "street", U, U, UL, UO),
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
    shot("lisbon", "g02.jpg", "Lisbon yellow tram", "Lisbon", "sight", U, U, UL, UO),
    shot("lisbon", "eat.jpg", "Pastéis de nata", "Lisbon", "eat", U, U, UL, UO),
    shot("lisbon", "g01.jpg", "Lisbon hillside and tram streets", "Lisbon", "street", U, U, UL, UO),
  ],
  "mexico-city": [
    shot("mexico-city", "g02.jpg", "Zócalo and the Mexico City cathedral", "Centro", "sight", U, U, UL, UO),
    shot("mexico-city", "eat.jpg", "Tacos on a plate", "Mexico City", "eat", P, P, PL, PO),
    shot("mexico-city", "g01.jpg", "Mexico City street and a tree canopy", "Roma", "street", U, U, UL, UO),
  ],
};
