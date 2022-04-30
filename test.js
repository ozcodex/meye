const create = require("./src/object").create;
const decode = require("./src/util").decode;
const render = require("./src/render").create;

//test cases

const testCases = [
	{
		class: "armor",
		material: "iron",
		type: "shield",
		dimension: "3",
		thickness: 3,
		quality: 0.7,
	},
	{
		class: "weapon",
		material: "iron",
		type: "blade",
		dimension: "3",
		thickness: "0.5",
		quality: 0.3,
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
];

testCases.forEach((test) => console.log(create(test)));

render(create(testCases[3]))
