import { create } from "./src/object.js";
import chalk from "chalk";
import { string_format as s, toCap } from "./src/lang.js";
import { create_card as render } from "./src/render.js";
import checkbox from "@inquirer/checkbox";
import select from "@inquirer/select";
import input from "@inquirer/input";
import { readFileSync } from "fs";

const material = JSON.parse(readFileSync("./src/def/materials.json"));
const dictionary = JSON.parse(readFileSync("./src/def/dictionary.json"));

const format = (string) => ({
  name: toCap(s(string)),
  value: string,
});

console.log("Creador de Objetos de Meye.");
console.log("Creado por el Automata Ambulante de Thonvhok");
console.log("-------");
(async () => {
  const answer = {};

  answer.name = await input({ message: "Nombre:" });

  answer.class = await select({
    message: "Clase:",
    choices: Object.keys(dictionary.classes).map(format),
  });

  answer.type = await select({
    message: "Tipo:",
    choices: Object.keys(dictionary.classes[answer.class].types).map(format),
  });

  answer.extra = {};

  answer.extra.sub_type = await select({
    message: "Subtipo:",
    choices: Object.keys(dictionary.classes[answer.class].sub_types).map(
      format
    ),
  });

  answer.extra.specialization = await select({
    message: "Especialización:",
    choices: Object.keys(dictionary.classes[answer.class].specializations).map(
      format
    ),
  });

  answer.category = await select({
    message: "Tipo de Material:",
    choices: [...new Set(material.map((e) => e.category))].map(format),
  });

  answer.material = await select({
    message: "Material:",
    choices: material
      .filter((elem) => elem.category == answer.category)
      .map((elem) => ({
        name: elem.name,
        value: elem.symbol,
      })),
  });

  answer.quality = await select({
    message: "Calidad:",
    choices: Array.from({ length: 10 }, (v, k) => ({
      name: (k + 1) * 10 + "%",
      value: ((k + 1) * 0.1).toFixed(1),
    })),
  });

  answer.dimension = await select({
    message: "Dimensión:",
    choices: Object.keys(dictionary.sizes).sort().map(format),
  });

  answer.thickness = await select({
    message: "Grosor:",
    choices: Object.keys(dictionary.sizes).sort().map(format),
  });

  answer.extra.origin = await select({
    message: "Origen:",
    choices: Object.keys(dictionary.origins).map(format),
  });

  answer.extra_material = await select({
    message: "Añadir material extra?:",
    choices: [
      { name: "Si", value: true },
      { name: "No", value: false },
    ],
  });

  if (answer.extra_material) {
    answer.extra.category = await select({
      message: "Tipo de Material:",
      choices: [...new Set(material.map((e) => e.category))].map(format),
    });
    answer.extra.material = await select({
      message: "Material:",
      choices: material
        .filter((elem) => elem.category == answer.extra.category)
        .map((elem) => ({
          name: elem.name,
          value: elem.symbol,
        })),
    });
    answer.extra.thickness = await select({
      message: "Grosor:",
      choices: Object.keys(dictionary.sizes).sort().map(format),
    });
  }
  answer.extra.flags = await checkbox({
    message: "Magia o Hechiceria:",
    instructions: chalk.dim(" (Use space key)"),
    choices: Object.keys(dictionary.flags).map(format),
  });

  answer.effects = [];

  for (const effect of [
    "transfondo",
    "disenno",
    "construccion",
    "historia",
    ...answer.extra.flags,
  ]) {
    const title = toCap(s(effect));
    const description = await input({ message: title + ":" });
    if (description) {
      answer.effects.push({
        title,
        description,
      });
    }
  }

  answer.modifications = {};

  const modifications = await checkbox({
    message: "Modificaciones:",
    instructions: chalk.dim(" (Use space key)"),
    choices: Object.keys(dictionary.modifications).map(format),
  });

  //TODO: Make all this dynamic
  for (const mod of modifications) {
    switch (mod) {
      case "restrictions":
        const restrictions = await checkbox({
          message: "Restricciónes:",
          instructions: chalk.dim(" (Use space key)"),
          choices: [
            { value: "F", name: "Fuerza" },
            { value: "A", name: "Agilidad" },
            { value: "V", name: "Velocidad" },
            { value: "R", name: "Resistencia" },
            { value: "I", name: "Inteligencia" },
            { value: "S", name: "Sabidura" },
            { value: "C", name: "Concentración" },
            { value: "W", name: "Voluntad" },
          ],
        });
        if (restrictions) answer.modifications.restrictions = [];
        for (const res of restrictions) {
          answer.modifications.restrictions.push({
            restriction: res,
            reduction: await input({
              message: res,
            }),
          });
        }
        break;
      case "range":
        const range = await input({ message: "Modificación del rango:" });
        answer.modifications.range = range.slice(",");
        break;
      case "price":
        answer.modifications.price = {};
        answer.modifications.price.raw = await input({
          message: "Precio del Material:",
        });
        answer.modifications.price.crafting = await input({
          message: "Precio de Construccion:",
        });
        answer.modifications.price.fee = await input({
          message: "Precio Honorarios:",
        });
        break;
      case "crafting_level":
        //aprendiz 0
        //funcion 1
        //disciplina 2
        //ciencia 3
        //mistico 4
        //divino 5
        break;
      case "rarity":
        //TODO: make this dynamic
        answer.extra.origin = await select({
          message: "Origen:",
          choices: [
            { value: "comun", name: "Común" },
            { value: "raro", name: "Raro" },
            { value: "magistral", name: "Magistral" },
            { value: "especial", name: "Especial" },
            { value: "sobrenatural", name: "Sobrenatural" },
            { value: "legendario", name: "Legendario" },
          ],
        });
        break;
      default:
        answer.modifications[mod] = await input({
          message: toCap(s(mod)) + ":",
        });
    }
  }

  console.log("-------");
  console.log(answer);
  console.log(answer.modifications.restrictions);
})();
