const {create, load} = require("./src/object");
const util = require("./src/util");
const code = require("./src/code");
const render = require("./src/render").create;

//test cases

const testCases = [
	{
		name: 'Escudo de Krall',
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
			price: { raw: 100, fee: -200 },
			crafting_level: "divine",
			rarity: "common",
		},
	},
	{
		class: "weapon",
		material: "steel",
		type: "blade",
		dimension: "0.5",
		thickness: "1",
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
console.log(create(testCases[2]));
//console.log(load("EELX","FK6I-62"));
render(load("EELX","FK6I-62"))
//console.log(util.randomObject('weapon'))
//console.log(util.randomObject('armor'))
