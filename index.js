import { create } from "./src/object.js";
import inquirer from "inquirer";
import { create_card as render } from "./src/render.js";
//import checkbox from "@inquirer/checkbox";
import { readFileSync } from "fs";

const material = JSON.parse(readFileSync("./src/def/materials.json"));
const dictionary = JSON.parse(readFileSync("./src/def/dictionary.json"));

const format = (string) => ({
  name: string[0].toUpperCase() + string.substring(1).replace("_", " "),
  value: string,
});

console.log("Creador de Objetos de Meye.");
console.log("Creado por el Automata Ambulante de Thonvhok");
console.log("-------");

inquirer
  .prompt([
    {
      name: "name",
      type: "input",
      message: "Nombre:",
    },
    {
      name: "class",
      type: "rawlist",
      message: "Clase:",
      loop: false,
      choices: Object.keys(dictionary.classes).map(format),
    },
    {
      name: "type",
      type: "list",
      message: "Tipo:",
      loop: false,
      choices: (answers) =>
        Object.keys(dictionary.classes[answers.class].types).map(format),
    },
    {
      name: "extra.sub_type",
      type: "list",
      message: "Subtipo:",
      loop: false,
      choices: (answers) =>
        Object.keys(dictionary.classes[answers.class].sub_types).map(format),
    },
    {
      name: "extra.specialization",
      type: "list",
      message: "Especialización:",
      loop: false,
      choices: (answers) =>
        Object.keys(dictionary.classes[answers.class].specializations).map(
          format
        ),
    },
    {
      name: "category",
      type: "list",
      message: "Tipo de Material:",
      loop: false,
      choices: [...new Set(material.map((e) => e.category))],
    },
    {
      name: "material",
      type: "list",
      message: "Material:",
      loop: false,
      choices: (answers) =>
        material
          .filter((elem) => elem.category == answers.category)
          .map((elem) => ({
            name: elem.name,
            value: elem.symbol,
          })),
    },
    {
      name: "quality",
      type: "list",
      message: "Calidad:",
      default: 6,
      loop: false,
      choices: Array.from({ length: 10 }, (v, k) => ({
        name: (k + 1) * 10 + "%",
        value: ((k + 1) * 0.1).toFixed(1),
      })),
    },
    {
      name: "dimension",
      type: "list",
      message: "Dimensión:",
      loop: false,
      choices: Object.keys(dictionary.sizes).sort(),
    },
    {
      name: "thickness",
      type: "list",
      message: "Grosor:",
      loop: false,
      choices: Object.keys(dictionary.sizes).sort(),
    },
    {
      name: "extra_material",
      type: "list",
      message: "Añadir material extra?:",
      loop: false,
      default: 1,
      choices: [
        { name: "Si", value: true },
        { name: "No", value: false },
      ],
    },
    {
      name: "extra.category",
      type: "list",
      when: (answers) => answers.extra_material,
      message: "Tipo de Material:",
      loop: false,
      choices: [...new Set(material.map((e) => e.category))],
    },
    {
      name: "extra.material",
      type: "list",
      when: (answers) => answers.extra_material,
      message: "Material:",
      loop: false,
      choices: (answers) =>
        material
          .filter((elem) => elem.category == answers.extra.category)
          .map((elem) => ({
            name: elem.name,
            value: elem.symbol,
          })),
    },
    {
      name: "extra.thickness",
      type: "list",
      when: (answers) => answers.extra_material,
      message: "Grosor:",
      loop: false,
      choices: Object.keys(dictionary.sizes).sort(),
    },
    {
      name: "extra.flags",
      type: "checkbox",
      message: "Magia o Hechiceria:",
      instructions: "Usar espacio para seleccionar, enter para finalizar",
      loop: false,
      choices: Object.keys(dictionary.flags).map(format),
    },
  ])
  .then((answers) => {
    console.log(answers);
  })
  .catch(console.error);
