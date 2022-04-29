const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const s = require("./lang").translate;

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

async function create(params) {
	const desc = `${s(params.type)} ${s(params.size_type)}`.toCap();

	// draw card
	text(params.name || desc, [100, 200], 70, "start", "#000", "bold");
	text(desc, [100, 300], 50, "start", "#888", "italic");

	text(params.size, [1300, 200], 70, "end", "#000", "bold");
	text(params.thickness + " G", [1330, 150], 40, "start");
	text(params.dimension + " D", [1330, 220], 40, "start");

	await image("shield", [100, 400], [1300, 700]);
	text(`#${params.code}`, [110, 450], 40, "start");
	text(s(params.material).toCap(), [1350, 1050], 40, "end", "#000", "bold");

	await image(params.crafting_level, [100, 1150], [200, 200]);
	let rarity_quality = `${params.rarity}_${params.quality * 10}`;
	await image(rarity_quality, [100, 1400], [200, 200]);

	text(s("throwing").toCap(), [350, 1200], 50, "start");
	text(s("weight").toCap(), [350, 1300], 50, "start");
	text(s("damping").toCap(), [350, 1400], 50, "start");
	text(s("resistence").toCap(), [350, 1500], 50, "start");
	text(s("useful_life").toCap(), [350, 1600], 50, "start");

	text(s(params.throwing).toCap(), [1000, 1200], 50, "end");
	text(s(params.weight).toCap(), [1000, 1300], 50, "end");
	text(s(params.damping).toCap(), [1000, 1400], 50, "end");
	text(s(params.resistence).toCap(), [1000, 1500], 50, "end");
	text(s(params.useful_life).toCap(), [1000, 1600], 50, "end");

	let point = 1250;
	params.restrictions.forEach((rest) => {
		let restriction = `${-rest.reduction} ${rest.restriction}`;
		text(restriction, [1250, point], 70, "center");
		point += 100;
	});

	let range = "—";
	params.range.forEach((unit) => {
		range += `${unit}—`;
	});
	text(s("range"), [400, 1700], 40, "center", "#888");
	text(range, [400, 1800], 50, "center");

	let data = `${params.damage} / ${params.slice} / ${params.bleeding}`;
	text(data, [400, 1900], 70, "center");
	let label = `${s("damage")} / ${s("slice")} / ${s("bleeding")}`;
	text(label, [400, 1970], 30, "center", "#888");

	text(s("price"), [1150, 1700], 40, "center", "#888");
	await image("raw", [800, 1750], [150, 150]);
	await image("crafting", [1050, 1750], [150, 150]);
	await image("fee", [1300, 1750], [150, 150]);
	text(`${s(params.price.raw)} R`, [875, 1970], 40, "center");
	text(`${s(params.price.crafting)} R`, [1125, 1970], 40, "center");
	text(`${s(params.price.fee)} R`, [1375, 1970], 40, "center");

	text(s("Effectos y Habilidades"), [50, 2075], 30, "start", "#888");

	// render and save file
	const buffer = canvas.toBuffer("image/png");
	fs.writeFileSync("./test.png", buffer);
}

module.exports = {
	create,
};
