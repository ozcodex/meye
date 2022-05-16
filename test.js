const { create, load } = require("./src/object");
const util = require("./src/util");
const code = require("./src/code");
const material = require("./src/material");
const render = require("./src/render");

(async () => {
	await render.create_card(load("EELX", "FK6I-62"), "EscudoKrall");
	await render.create_card(load("GArK", "FAOA"), "EspadaShishi");
	await render.create_card(load("JAk1", "GAGA"), "DagasDiperias");
})//();

render.periodic_table()


//console.log(util.randomObject('weapon'))
//console.log(util.randomObject('armor'))
