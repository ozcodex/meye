const { create, load } = require("./src/object");
const util = require("./src/util");
const code = require("./src/code");
const material = require("./src/material");
const render = require("./src/render");

//in explosive and poison, thickness is the concentration
let obj = create({
	material:'NU',
	quality:0.7,
	class: 'explosivo',
	dimension: 0.25,
	type: 'detonante',
	thickness: 3
})

async function createCards() {
	await render.create_card(load("aMVX"), "Nitrurea");
	await render.create_card(load("EELX", "FK6I-62"), "EscudoKrall");
	await render.create_card(load("GArK", "FAOA"), "EspadaShishi");
	await render.create_card(load("JAk1", "GAGA"), "DagasDiperias");

}

//render.periodic_table()

createCards()

console.log(obj)

//console.log(util.randomObject('weapon'))
//console.log(util.randomObject('armor'))
