const { create, load } = require("./src/object");
const util = require("./src/util");
const code = require("./src/code");
const render = require("./src/render").create;

object = {
	name: "Espada Shishi",
	class: "weapon",
	material: "steel",
	type: "blade",
	dimension: "3",
	thickness: "2",
	quality: 1,
	extra: {
		origin: "sujfi",
		sub_type: "straight",
		specialization: "none",
		flags: ["alchemy", "graphy", "lacing"],
	},
	modifications: {
		slice: 7,
		restrictions: [{ restriction: "C", reduction: 10 }],
	},
	effects: [
		{
			title: "Alquimia",
			description:
				"La espada ha sido tratada alquimicamente para poder contener una habilidad activa, ademas de mejorar su corte.",
		},
		{
			title: "Grafia",
			description:
				"El grabado al rebedorde la guarda absorbe energia del ambiente y la acumula en forma de calor en la pieza central",
		},
		{
			title: "Lazado",
			description:
				"El calor acumulado en la pieza central es transferido a la hoja concediedole 20 de corte y daño por calor, a voluntad del portador.",
		},{
			title: "Historia",
			description:
				"Arma insignia de la guardia del sujmar del publo shishi. Representa el honor y la responsabilidad de protejer las tradiciones de los sujfi.",
		},
	],
};

console.log(create(object));
render(load("EELX","FK6I-62"));

//console.log(util.randomObject('weapon'))
//console.log(util.randomObject('armor'))
