const { create, load } = require("./src/object");
const util = require("./src/util");
const code = require("./src/code");
const material = require("./src/material");
const render = require("./src/render");

(async () => {
  await render.create_card(load("ERXX", "FAKI-62"));
  await render.create_card(load("GArK", "FAOA"));
  await render.create_card(load("JAk1", "GAGA"));
  await render.create_card(load("GAg4", "EAAA"));
  await render.create_card(load("GApa", "DgCA-4a"));
})();

//render.periodic_table()
