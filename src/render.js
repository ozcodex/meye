const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const materials = require("./def/materials");
const util = require("./util");
const s = require("./lang").translate;
const n = require("./lang").format;

String.prototype.toCap = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

const width = 1500;
const height = 2100;
let context;
let canvas;

function text(text, pos, size, align, color, variant) {
	context.font = `${variant || "normal"} ${size}pt Sans`;
	context.textAlign = align;
	context.fillStyle = color || "#000";
	context.fillText(text, ...pos);
}

function image(name, pos, size) {
	loadImage(`./src/img/${name}.png`).then((img) =>
		context.drawImage(img, ...pos, ...size)
	);
}

// INIT

canvas = createCanvas(width, height);
context = canvas.getContext("2d");

context.fillStyle = "#fff";
context.fillRect(0, 0, width, height);

context.fillStyle = "#000";
context.fillRect(0, 2020, width, height);

// create card

async function create(obj) {
	const name = `${s(obj.type)}`.toCap();
	let suffix = "";
	if (!isNaN(obj.size_type)) {
		suffix = obj.size_type == 1 ? "piece" : "pieces";
	}
	const desc = `${s(obj.type)} ${s(obj.size_type)} ${s(suffix)}`.toCap();

	await image("background", [0, 0], [width, height]);
	context.fillStyle = "#000";
	context.fillRect(0, 2020, width, height);

	// draw card
	text(obj.name || name, [100, 200], 70, "start", "#000", "bold");
	text(desc, [100, 300], 50, "start", "#555", "italic");

	text(s("size"), [1220, 150], 40, "center", "#555", "bold");
	text(obj.size + 5, [1220, 270], 80, "end", "#000", "bold");
	const thickness = +(Math.round(obj.thickness + "e+1") + "e-1");
	text(thickness + " G", [1230, 220], 40, "start");
	const dimension = +(Math.round(obj.dimension + "e+1") + "e-1");
	text(dimension + " D", [1230, 270], 40, "start");

	//todo: set a color by parameter
	context.fillStyle = "#777";
	context.fillRect(90, 365, 1310, 710);
	await image(obj.extra.origin, [100, 375], [1300, 700]);
	const id =
		obj.code +
		(obj.custom_code ? "-" : "") +
		(obj.custom_code || "");
	if (fs.existsSync(`./src/img/${id}.png`)) {
		await image(id, [100, 375], [1300, 700]);
	} else {
		await image(obj.type, [100, 375], [1300, 700]);
	}
	if (obj.custom_code) {
		text(`#${obj.code}`, [110, 980], 40, "start");
		text(`#${obj.custom_code}`, [110, 1050], 40, "start");
	} else {
		text(`#${obj.code}`, [110, 1050], 40, "start");
	}
	let material = materials[obj.material].symbol;
	if (obj.extra.material) {
		material += "," + materials[obj.extra.material].symbol;
	}
	text(material, [1375, 435], 40, "end", "#000", "bold");

	await image(obj.crafting_level, [100, 1150], [200, 200]);
	let rarity_quality = `${obj.rarity}_${obj.quality * 10}`;
	await image(rarity_quality, [100, 1350], [200, 200]);

	text(s("throwing").toCap(), [380, 1200], 50, "start");
	text(s("weight").toCap(), [380, 1280], 50, "start");
	text(s("damping").toCap(), [380, 1360], 50, "start");
	text(s("resistence").toCap(), [380, 1440], 50, "start");
	text(s("useful_life").toCap(), [380, 1520], 50, "start");

	text(obj.throwing, [1030, 1200], 50, "end");
	text(obj.weight, [1030, 1280], 50, "end");
	text(obj.damping, [1030, 1360], 50, "end");
	text(obj.resistence, [1030, 1440], 50, "end");
	text(obj.useful_life, [1030, 1520], 50, "end");

	let point = 1210;
	let breaking = Math.ceil(obj.restrictions.length / 2) * 100;

	const restrictions = {};
	obj.restrictions.forEach(
		(rest) => (restrictions[rest.restriction] = util.plus(-rest.reduction))
	);
	if (restrictions["R"]) text(restrictions["R"], [1170, 1210], 50, "center");
	if (restrictions["F"]) text(restrictions["F"], [1170, 1310], 50, "center");
	if (restrictions["A"]) text(restrictions["A"], [1170, 1410], 50, "center");
	if (restrictions["V"]) text(restrictions["V"], [1170, 1510], 50, "center");
	if (restrictions["C"]) text(restrictions["C"], [1300, 1210], 50, "center");
	if (restrictions["I"]) text(restrictions["I"], [1300, 1310], 50, "center");
	if (restrictions["S"]) text(restrictions["S"], [1300, 1410], 50, "center");
	if (restrictions["W"]) text(restrictions["W"], [1300, 1510], 50, "center");

	let range = "—";
	obj.range.forEach((unit) => {
		range += `${unit}—`;
	});
	text(s("range"), [350, 1675], 40, "center", "#555", "bold");
	text(range, [350, 1775], 50, "center");

	let data = `${obj.damage} / ${obj.slice} / ${obj.bleeding}`;
	text(data, [350, 1870], 70, "center");
	let label = `${s("damage")} / ${s("slice")} / ${s("bleeding")}`;
	text(label, [350, 1950], 30, "center", "#555", "bold");

	text(s("price"), [1050, 1675], 40, "center", "#555", "bold");
	await image("raw", [750, 1720], [150, 150]);
	await image("crafting", [1000, 1720], [150, 150]);
	await image("fee", [1250, 1720], [150, 150]);
	text(`${n(obj.price.raw)} R`, [825, 1950], 40, "center");
	text(`${n(obj.price.crafting)} R`, [1075, 1950], 40, "center");
	text(`${n(obj.price.fee)} R`, [1325, 1950], 40, "center");

	text(s(obj.mod_code), [50, 2075], 30, "start", "#555");

	// render and save file
	const buffer = canvas.toBuffer("image/png");
	fs.writeFileSync("./test.png", buffer);
}

module.exports = {
	create,
};
