const { create, load } = require("./src/object");
const util = require("./src/util");
const code = require("./src/code");
const material = require("./src/material");
const render = require("./src/render");

//in explosive and poison, thickness is the concentration
let hasbon = create({
	material:'LA',
	quality:0.7,
	class: 'arma',
	dimension: 0.5,
	type: 'de_hoja',
	thickness: 1
})

let julio = create({
	material:'LA',
	quality:1,
	class: 'arma',
	dimension: 0.5,
	type: 'contundente',
	thickness: 3
})

let david = create({
	material: 'FE',
	quality: 0.7,
	class: 'arma',
	dimension: 0.5,
	type: 'de_tension',
	thickness: 2
})

let david2 = create({
  material: 'AZ',
  quality: 0.5,
  class: 'arma',
  dimension: 0.25,
  type: 'proyectil',
  thickness: 1
})

let david3 = create({
  material: 'FE',
  quality: 0.7,
  class: 'arma',
  dimension: 0.25,
  type: 'proyectil',
  thickness: 1
})

let martillo = create({
  material: 'AC',
  quality: 0.7,
  class: 'arma',
  dimension: 0.5,
  type: 'contundente',
  thickness: 3 
})

async function createCards() {
	await render.create_card(load("aMVX"), "Nitrurea");
	await render.create_card(load("EELX", "FK6I-62"), "EscudoKrall");
	await render.create_card(load("GArK", "FAOA"), "EspadaShishi");
	await render.create_card(load("JAk1", "GAGA"), "DagasDiperias");

}

//render.periodic_table()

//createCards()
obj = martillo
console.log(obj)

//console.log(util.randomObject('weapon'))
//console.log(util.randomObject('armor'))
