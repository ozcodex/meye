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

	await image("background", [0, 0], [width, height]);
	context.fillStyle = "#000";
	context.fillRect(0, 2020, width, height);

	// draw card
	text(params.name || desc, [100, 200], 70, "start", "#000", "bold");
	text(desc, [100, 300], 50, "start", "#555", "italic");

	text(s("size"), [1220, 150], 40, "center", "#555", "bold");
	text(params.size + 5, [1220, 270], 80, "end", "#000", "bold");
	const thickness = +(Math.round(params.thickness + "e+1") + "e-1");
	text(thickness + " G", [1230, 220], 40, "start");
	const dimension = +(Math.round(params.dimension + "e+1") + "e-1");
	text(dimension + " D", [1230, 270], 40, "start");

	context.fillStyle = "#777";
	context.fillRect(100, 375, 1300, 700);
	await image("shield", [100, 375], [1300, 700]);
	text(`#${params.code}`, [110, 425], 40, "start");
	text(s(params.material).toCap(), [1375, 1050], 40, "end", "#000", "bold");

	await image(params.crafting_level, [100, 1150], [200, 200]);
	let rarity_quality = `${params.rarity}_${params.quality * 10}`;
	await image(rarity_quality, [100, 1350], [200, 200]);

	text(s("throwing").toCap(), [400, 1200], 50, "start");
	text(s("weight").toCap(), [400, 1280], 50, "start");
	text(s("damping").toCap(), [400, 1360], 50, "start");
	text(s("resistence").toCap(), [400, 1440], 50, "start");
	text(s("useful_life").toCap(), [400, 1520], 50, "start");

	text(s(params.throwing).toCap(), [920, 1200], 50, "end");
	text(s(params.weight).toCap(), [920, 1280], 50, "end");
	text(s(params.damping).toCap(), [920, 1360], 50, "end");
	text(s(params.resistence).toCap(), [920, 1440], 50, "end");
	text(s(params.useful_life).toCap(), [920, 1520], 50, "end");

	let point = 1210;
	let breaking = Math.ceil(params.restrictions.length / 2) * 100;
	params.restrictions.forEach((rest) => {
		let restriction = `${-rest.reduction} ${rest.restriction}`;
		if (point >= breaking + 1210) {
			text(restriction, [1300, point - breaking], 50, "center");
		} else {
			text(restriction, [1100, point], 50, "center");
		}
		point += 100;
	});

	let range = "—";
	params.range.forEach((unit) => {
		range += `${unit}—`;
	});
	text(s("range"), [400, 1675], 40, "center", "#555", "bold");
	text(range, [400, 1775], 50, "center");

	let data = `${params.damage} / ${params.slice} / ${params.bleeding}`;
	text(data, [400, 1870], 70, "center");
	let label = `${s("damage")} / ${s("slice")} / ${s("bleeding")}`;
	text(label, [400, 1950], 30, "center", "#555", "bold");

	text(s("price"), [1050, 1675], 40, "center", "#555", "bold");
	await image("raw", [750, 1720], [150, 150]);
	await image("crafting", [1000, 1720], [150, 150]);
	await image("fee", [1250, 1720], [150, 150]);
	text(`${s(params.price.raw)} R`, [825, 1950], 40, "center");
	text(`${s(params.price.crafting)} R`, [1075, 1950], 40, "center");
	text(`${s(params.price.fee)} R`, [1325, 1950], 40, "center");

	text(s("Effectos y Habilidades"), [50, 2075], 30, "start", "#555");

	// render and save file
	const buffer = canvas.toBuffer("image/png");
	fs.writeFileSync("./test.png", buffer);
}

module.exports = {
	create,
};
