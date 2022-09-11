const { create } = require("./src/object");
const inquirer = require("inquirer");
const render = require("./src/render");

const material = require("./src/def/materials");
const dictionary = require("./src/def/dictionary");

const format = (string) => ({
  name: string[0].toUpperCase() + string.substring(1),
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
      choices: Object.keys(dictionary.classes).map(format),
    },
    {
      name: "type",
      type: "list",
      message: "Tipo:",
      choices: (answers) =>
        Object.keys(dictionary.classes[answers.class].types).map(format),
    },
    {
      name: "sub_type",
      type: "list",
      message: "Tipo:",
      choices: (answers) =>
        Object.keys(dictionary.classes[answers.class].sub_types).map(format),
    },
    {
      name: "quality",
      type: "list",
      message: "Calidad:",
      choices: Array.from({ length: 10 }, (v, k) => ({
        name: (k + 1) * 10 + "%",
        value: (k + 1) * 0.1,
      })),
    },

    {
      name: "category",
      type: "list",
      message: "Tipo de Material:",
      choices: [...new Set(material.map((e) => e.category))],
    },
    {
      name: "material",
      type: "list",
      message: "Material:",
      choices: (answers) =>
        material
          .filter((elem) => elem.category == answers.category)
          .map((elem) => ({
            name: elem.name,
            value: elem.symbol,
          })),
    },
  ])
  .then((answers) => {
    console.log(answers);
  })
  .catch(console.error);
