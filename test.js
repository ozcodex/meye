const { create, load } = require("./src/object");
const util = require("./src/util");
const code = require("./src/code");
const render = require("./src/render").create;

object = {
	name: "Dagas Diperias",
	class: "weapon",
	material: "copper",
	type: "blade",
	dimension: "0.5",
	thickness: "1",
	quality: 0.5,
	extra: {
		origin: "tagyef",
		sub_type: "straight",
		specialization: "none",
		flags: ["alchemy", "lacing"],
	},
	modifications: {
		damping: 20,
		restrictions: [{ "restriction": "W", "reduction": 10 }]
	},
	effects: [
		{
			title: "Alquimia",
			description:
				"Alqumia empirica de tiempos remotos y efectos desconocidos.",
		},
		{
			title: "Lazado",
			description:
				"Lazado instintivo que dotó las dagas con la cualidad de energía oscura calida del aura de su creador",
		},
		{
			title: "Propiedad",
			description:
				"Esta arma puede cortar cualquier expresion de energía inferior a nivel 10 y genera una perdida de energia por corte igual al nivel.",
		},
		{
			title: "Historia",
			description:
				"Dagas creadas prefundación de los reinos, catalagodas por cenobitas como objeto en posesión espectral. Los registros revelan que pueden inducir a la agresividad.",
		},
		{
			title: "Transfondo",
			description:
				"Reclamadas como propias por Tagnit.",
		},
	],
};

console.log(create(object));
render(create(object));

//console.log(util.randomObject('weapon'))
//console.log(util.randomObject('armor'))
