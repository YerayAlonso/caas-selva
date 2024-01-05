import * as cheerio from "cheerio";

const CAAS_URL = "https://caas.selva.cat";

export async function getAnimals() {
  const url = `${CAAS_URL}/registre.php`;
  const data = await fetch(url);
  const html = await data.text();

  const $ = cheerio.load(html);
  const animalLinks = $("table a[href^='animal.php?']");
  const animals = [];

  animalLinks.each(async (_, element) => {
    const href = `${CAAS_URL}/${$(element).attr("href")}`;
    const image = `${CAAS_URL}/${$(element).children("img").attr("src")}`;
    const name = href.split("?")[1];

    let rawDetails = $(element)
      .html()
      .trim()
      .split("\n")[1]
      .trim()
      .replace('<div class="lletra_vermella">', "");

    if (rawDetails.endsWith("<br>")) {
      rawDetails = rawDetails.slice(0, -4);
    }

    const adoptable = !rawDetails.startsWith("Encara No es pot adoptar");
    const cleanDetails = adoptable ? rawDetails : rawDetails.split("</div>")[1];

    const animal = {
      name,
      image,
      href,
      adoptable,
    };

    if (cleanDetails.startsWith("<h4>")) {
      const details = cleanDetails.split("</h4>")[1].split("<br>");
      animal.breed = details[0];
      animal.gendre = details[1];
      animal.age = details[2];

      animals.push(animal);
    }
  });

  return animals;
}

export async function getAnimalDetails({ name }) {
  const url = `https://caas.selva.cat/animal.php?${name}`;
  const data = await fetch(url);
  const html = await data.text();

  const $ = cheerio.load(html);
  const id = $("table table td:contains('Número de registre') + td").text();
  const specie = $("table table td:contains('Especie') + td").text();
  const breed = $("table table td:contains('Raça') + td").text();
  const gendre = $("table table td:contains('Sexe') + td").text();
  const size = $("table table td:contains('Mida') + td").text();
  const age = $("table table td:contains('Edat') + td").text();
  const color = $("table table td:contains('Color') + td").text();
  const origin = $(
    "table table td:contains('Municipi de recollida') + td"
  ).text();
  const checkInDate = $(
    "table table td:contains('Data d'entrada al CAAS') + td"
  ).text();

  const animal = {
    name,
    id,
    specie,
    breed,
    gendre,
    size,
    age,
    color,
    origin,
    checkInDate,
  };
  return animal;
}
