const create = require("./src/object").create;
const util = require("./src/util");
const code = require("./src/code");
const render = require("./src/render").create;
const decode = require("./src/render").create;

//test cases

const testCases = [
	{
		class: "armor",
		material: "iron",
		type: "shield",
		dimension: "3",
		thickness: 3,
		quality: 0.7,
		extra: {
			material: "steel",
			thickness: 0.5,
			origin: "banken",
			sub_type: "buckler",
			specialization: "reinforced_umbonated",
			flags: ["graphy", "alchemy", "ilusion"],
		},
		effects: [
			{
				title: "Grafia y Alquimia",
				description:
					"Grabado tratado alquimicamente para la activación automatica de su habilidad" +
					" propia. Aunque para evitar caer en su propia ilusion el portador debe " +
					"permanecer atento a su entorno y conciente de su realidad.",
			},
			{
				title: "ilusion",
				description:
					"Crea una falange ilusoria de hasta 4 copias, ocultando la verdadera posición del usuario.",
			},
		],
		modifications: {
			damage: 2,
			weight: -5,
			restrictions: [{ restriction: "C", reduction: 5 }],
		},
	},
	{
		class: "weapon",
		material: "iron",
		type: "blade",
		dimension: "3",
		thickness: "0.5",
		quality: 0.3,
		modifications: {
			damage: 2,
			weight: -5,
			restrictions: [{ restriction: "R", reduction: 5 }],
			range: [2, 3],
			price: { raw: 100, crafting: 4, fee: -200 },
			crafting_level: "divine",
			rarity: "common",
		},
	},
	{
		class: "weapon",
		material: "ferro_iron",
		type: "blade",
		dimension: "3",
		thickness: "2",
		quality: 0.7,
	},
	{
		class: "armor",
		material: "aluminium",
		type: "cuirass",
		dimension: "3",
		thickness: "4",
		quality: 1,
	},
	{
		class: "common",
		material: "platinum",
		type: "solid",
		dimension: "5",
		thickness: "0.1",
		quality: 0.9,
	},
];

//testCases.forEach((test) => console.log(create(test)));
//console.log(code.decodeBase("EELX"));
//console.log(code.decodeCustom("FK6I-62", "armor"));
console.log(create(testCases[0]));
console.log(create(testCases[1]));
//render(create(testCases[0]))

//console.log(util.randomObject('weapon'))
//console.log(util.randomObject('armor'))
