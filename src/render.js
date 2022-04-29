const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const s = require("./lang").translate;

const width = 1500;
const height = 2100;
let context;
let canvas;

function text(text, pos, size, align, variant, color) {
	context.font = `${variant} ${size}pt Sans`;
	context.textAlign = align;
	context.fillStyle = color;
	context.fillText(text, ...pos);
}

// INIT

canvas = createCanvas(width, height);
context = canvas.getContext("2d");

context.fillStyle = "#fff";
context.fillRect(0, 0, width, height);

// create card

async function create(params) {
	let image;
	const desc = `${s(params.type)} ${s(params.size_type)}`;

	// draw card
	text(params.name || desc, [100, 200], 70, "start", "bold", "#000");
	text(desc, [100, 300], 50, "start", "italic", "#888");

	text(params.size, [1300, 200], 70, "end", "bold", "#000");
	text(params.thickness + " G", [1330, 150], 40, "start", "normal", "#000");
	text(params.dimension + " D", [1330, 220], 40, "start", "normal", "#000");

	image = await loadImage("./src/img/shield.png");
	context.drawImage(image, 100, 400, 1300, 700);
	text(params.code, [110, 450], 40, "start", "normal", "#000");
	text(s(params.material), [1350, 1050], 40, "end", "normal", "#000");



	// render and save file
	const buffer = canvas.toBuffer("image/png");
	fs.writeFileSync("./test.png", buffer);
}

module.exports = {
	create,
};
