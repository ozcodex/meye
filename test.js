const { create, load } = require("./src/object");
const util = require("./src/util");
const code = require("./src/code");
const material = require("./src/material");
const render = require("./src/render").create;

(async () => {
	await render(load("EELX", "FK6I-62"), "EscudoKrall");
	await render(load("GArK", "FAOA"), "EspadaShishi");
	await render(load("JAk1", "GAGA"), "DagasDiperias");
})();

//console.log(util.randomObject('weapon'))
//console.log(util.randomObject('armor'))
