const { create, load } = require("./src/object");
const util = require("./src/util");
const code = require("./src/code");
const material = require("./src/material");
const render = require("./src/render");
const obj_def = require("./obj");
let obj = create(obj_def)

card_name = obj.name

render.create_card(obj,card_name);