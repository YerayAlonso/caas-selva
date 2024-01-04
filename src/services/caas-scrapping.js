import { extract } from "@extractus/article-extractor";
import * as cheerio from "cheerio";

export async function getAnimals() {
  const url = "https://caas.selva.cat/registre.php";
  const data = await extract(url);
  const content = data.content;

  const $ = cheerio.load(content);
  const animalLinks = $("a[href^='https://caas.selva.cat/animal.php?']");
  const animals = [];

  animalLinks.each(async (_, element) => {
    const href = $(element).attr("href");
    const image = $(element).children("img").attr("src");
    const name = href.split("?")[1];

    const animal = {
      name,
      image,
      href,
    };

    if (!image) {
      console.log(name);
    }

    const rawDetails = $(element).html().trim().split("\n")[1].trim();

    animal.adoptable = !rawDetails.startsWith(
      "<p>Encara No es pot adoptar</p>"
    );
    const cleanDetails = animal.adoptable
      ? rawDetails
      : rawDetails.split("</p>")[1];

    if (cleanDetails.startsWith("<h4>")) {
      const details = cleanDetails.split("</h4>")[1].split("<br>");
      animal.breed = details[0];
      animal.gendre = details[1];
      animal.age = details[2];
    }

    animals.push(animal);
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
