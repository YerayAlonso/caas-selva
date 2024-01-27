import * as cheerio from "cheerio";
import { stat_labels } from "$lib/constants";

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
      animal.sex = details[1];
      animal.age = details[2];

      animals.push(animal);
    }
  });

  return animals;
}

export async function getAnimalDetails({ name }) {
  const url = `${CAAS_URL}/animal.php?${name}`;
  const data = await fetch(url);
  if (data.url != url) {
    return;
  }
  const html = await data.text();

  const $ = cheerio.load(html);
  const id = $("table table td:contains('Número de registre') + td").text();
  const specie = $("table table td:contains('Especie') + td").text();
  const breed = $("table table td:contains('Raça') + td").text();
  const sex = $("table table td:contains('Sexe') + td").text();
  const size = $("table table td:contains('Mida') + td").text();
  const age = $("table table td:contains('Edat') + td").text();
  const color = $("table table td:contains('Color') + td").text();
  const origin = $(
    "table table td:contains('Municipi de recollida') + td"
  ).text();
  const checkInDate = $(
    "table table td:contains('Data d'entrada al CAAS') + td"
  ).text();

  const images = [];
  $("table table td img").each((_, element) => {
    images.push(`${CAAS_URL}/${$(element).attr("src")}`);
  });

  const extraImages = $("table p img")
    .map((_, element) => {
      return `${CAAS_URL}/${$(element).attr("src")}`;
    })
    .toArray();

  const stats = stat_labels;

  $("table table td.casella_selec").each((_, element) => {
    const text = $($(element).parent().children()[0]).text();
    const value = $(element).parent().children().index($(element));
    const stat = stats.find((stat) => stat.label === text);
    if (stat) {
      stat.value = 4 - value;
    }
  });

  const animal = {
    name,
    id,
    specie,
    breed,
    sex,
    size,
    age,
    color,
    origin,
    checkInDate,
    images,
    extraImages,
    stats,
  };
  return animal;
}
