const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const material = require("./material");
const util = require("./util");
const s = require("./lang").string_format;
const n = require("./lang").number_format;

String.prototype.toCap = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

Array.prototype.add = function (arr) {
	var sum = this.map(function (num, idx) {
		return num + arr[idx];
	});
	return sum;
};

Number.prototype.round = function () {
	return +(Math.round(this + "e+1") + "e-1");
};

let context;
let canvas;

function multiline(text, pos, maxWidth, size, align, color, variant) {
	context.font = `${variant || "normal"} ${size}pt Sans`;
	context.textAlign = align;
	context.fillStyle = color || "#000";
	let words = text.split(" ");
	let line = "";

	for (let n = 0; n < words.length; n++) {
		let testLine = line + words[n] + " ";
		let metrics = context.measureText(testLine);
		let testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			context.fillText(line, pos[0], pos[1]);
			line = words[n] + " ";
			pos[1] += size + 15;
		} else {
			line = testLine;
		}
	}
	context.fillText(line, pos[0], pos[1]);
	return pos[1];
}

function text(text, pos, size, align, color, variant) {
	context.font = `${variant || "normal"} ${size}pt Sans`;
	context.textAlign = align;
	context.fillStyle = color || "#000";
	context.fillText(text, ...pos);
}

function strokeText(text, pos, size, align, color, variant) {
	context.font = `${variant || "normal"} ${size}pt Sans`;
	context.textAlign = align;
	context.strokeStyle = "#000";
	context.lineWidth = 10;
	context.strokeText(text, ...pos);
	context.stroke();
	context.lineWidth = 1;
	context.fillStyle = color || "#FFF";
	context.fillText(text, ...pos);
}

function image(name, pos, size) {
	loadImage(`./src/img/${name}.png`).then((img) =>
		context.drawImage(img, ...pos, ...size)
	);
}

// create card

async function front(obj, filename) {
	const width = 1500;
	const height = 2100;
	// INIT
	canvas = createCanvas(width, height);
	context = canvas.getContext("2d");

	context.fillStyle = "#fff";
	context.fillRect(0, 0, width, height);

	context.fillStyle = "#000";
	context.fillRect(0, 2020, width, height);
	const name = obj.type.toCap();
	let suffix = "";
	if (!isNaN(obj.size_type)) {
		suffix = obj.size_type == 1 ? "pieza_completa" : "pieza_completas";
	}
	const desc = [
		obj.class,
		obj.type,
		obj.class == "explosivo" ? material.get(obj.material).name : "",
		obj.extra?.sub_type,
		obj.extra?.specialization,
		obj.size_type,
		suffix,
	]
		.filter((element) => {
			return !["", "none", null, undefined].includes(element);
		})
		.join(" ")
		.toCap();
	await image("backgrounds/front", [0, 0], [width, height]);
	context.fillStyle = "#000";
	context.fillRect(0, 2020, width, height);

	// draw card title
	text(obj.name || name, [100, 200], 70, "start", "#000", "bold");
	text(s(desc), [100, 300], 40, "start", "#555", "italic");

	text("tamaño", [1200, 110], 40, "center", "#555", "bold");
	let label_size = obj.size;
	if (obj.class == "explosivo") {
		label_size = Number(obj.dimension).round();
	}
	text(label_size, [1220, 220], 80, "end", "#000", "bold");
	let label_thickness = Number(obj.thickness).round() + " G";
	if (obj.class == "explosivo") {
		label_thickness = Number(obj.thickness * 10).round() + " %";
	}
	text(label_thickness, [1230, 170], 40, "start");
	const label_dimension = +(Math.round(obj.dimension + "e+1") + "e-1") + " D";
	text(label_dimension, [1230, 220], 40, "start");

	//todo: set a color by parameter
	context.fillStyle = "#777";
	// draw origin image
	context.fillRect(90, 365, 1320, 720);
	if (obj.extra?.origin) {
		await image("origins/" + obj.extra.origin, [100, 375], [1300, 700]);
	}
	const id =
		obj.code + (obj.custom_code ? "-" : "") + (obj.custom_code || "");
	if (fs.existsSync(`./src/img/objects/${id}.png`)) {
		await image("objects/" + id, [100, 375], [1300, 700]);
	} else {
		await image("types/" + obj.type, [100, 375], [1300, 700]);
	}
	if (obj.custom_code) {
		strokeText(`#${obj.code}`, [110, 980], 40, "start", "#FFF", "bold");
		strokeText(
			`#${obj.custom_code}`,
			[110, 1050],
			40,
			"start",
			"#FFF",
			"bold"
		);
	} else {
		strokeText(`#${obj.code}`, [110, 1050], 40, "start", "#FFF", "bold");
	}
	let symbol = obj.material;
	if (obj.extra?.material) {
		symbol += "/" + obj.extra.material;
	}
	let decay = material.get(obj.material).decadency;
	if (decay != "-") {
		symbol += " → " + decay;
	}
	strokeText(symbol, [1375, 435], 40, "end", "#FFF", "bold");

	//card properties
	await image("levels/" + obj.crafting_level, [100, 1150], [200, 200]);
	let rarity_quality = `${obj.rarity}_${obj.quality * 10}`;
	await image("rarities/" + rarity_quality, [100, 1350], [200, 200]);

	text("Lance", [380, 1200], 50, "start");
	text("Peso", [380, 1280], 50, "start");
	let damping_label = obj.class == "explosivo" ? "Impacto" : "Amort.";
	text(damping_label, [380, 1360], 50, "start");
	text("Resist.", [380, 1440], 50, "start");
	text("Vida Util", [380, 1520], 50, "start");

	text(obj.throwing.toFixed(0), [1030, 1200], 50, "end");
	text(Number(obj.weight).round(), [1030, 1280], 50, "end");
	let damping = obj.damping
	if(!isNaN(damping)){
		damping = Number(damping).round()
	}
	text(damping, [1030, 1360], 50, "end");
	let resistence = obj.resistence
	if(!isNaN(resistence)){
		resistence = Number(resistence).round()
	}
	text(resistence, [1030, 1440], 50, "end");
	let useful_life = obj.useful_life
	if(!isNaN(useful_life)){
		useful_life = Number(useful_life).round()
	}
	text(useful_life, [1030, 1520], 50, "end");

	let point = 1210;
	let breaking = Math.ceil(obj.restrictions.length / 2) * 100;

	// object restrictions
	const restrictions = {};
	obj.restrictions.forEach(
		(rest) => (restrictions[rest.restriction] = util.plus(-rest.reduction))
	);
	if (restrictions["F"])
		text(restrictions["F"], [1170, 1210], 50, "center", "#000", "bold");
	if (restrictions["A"])
		text(restrictions["A"], [1170, 1310], 50, "center", "#000", "bold");
	if (restrictions["V"])
		text(restrictions["V"], [1170, 1410], 50, "center", "#000", "bold");
	if (restrictions["R"])
		text(restrictions["R"], [1170, 1510], 50, "center", "#000", "bold");
	if (restrictions["I"])
		text(restrictions["I"], [1300, 1210], 50, "center", "#000", "bold");
	if (restrictions["S"])
		text(restrictions["S"], [1300, 1310], 50, "center", "#000", "bold");
	if (restrictions["C"])
		text(restrictions["C"], [1300, 1410], 50, "center", "#000", "bold");
	if (restrictions["W"])
		text(restrictions["W"], [1300, 1510], 50, "center", "#000", "bold");

	// range and damage
	let range = "—";
	obj.range.forEach((unit) => {
		range += `${unit}—`;
	});
	text(s("rango"), [350, 1675], 40, "center", "#555", "bold");
	text(range, [350, 1775], 50, "center");

	let data = `${obj.damage} / ${obj.slice} / ${obj.bleeding}`;
	text(data, [350, 1870], 70, "center");
	let label = `${s("daño")} / ${s("corte")} / ${s("desangre")}`;
	text(label, [350, 1950], 30, "center", "#555", "bold");

	// pricing
	text(s("costos de fabricación"), [1050, 1675], 40, "center", "#555", "bold");
	await image("prices/raw", [750, 1720], [150, 150]);
	await image("prices/crafting", [1000, 1720], [150, 150]);
	await image("prices/fee", [1250, 1720], [150, 150]);
	text(`${n(Number(obj.price.raw).round())} R`, [825, 1950], 40, "center");
	const label_crafting = `${n(Number(obj.price.crafting).round())} R`;
	text(label_crafting, [1075, 1950], 40, "center");
	text(`${n(Number(obj.price.fee).round())} R`, [1325, 1950], 40, "center");

	text(s(obj.mod_code), [100, 2075], 30, "start", "#FFF", "bold");

	// put flags

	if (obj.extra?.flags) {
		await Promise.all(
			obj.extra.flags.map((flag, idx) =>
				image("flags/" + flag, [-363, 100 + 192 * idx], [380, 172])
			)
		);
	}

	// render and save file
	const buffer = canvas.toBuffer("image/png");
	fs.writeFileSync("./out/" + filename + "_front.png", buffer);
}

async function back(obj, filename) {
	const width = 1500;
	const height = 2100;
	// INIT
	canvas = createCanvas(width, height);
	context = canvas.getContext("2d");

	context.fillStyle = "#fff";
	context.fillRect(0, 0, width, height);

	context.fillStyle = "#000";
	context.fillRect(0, 2020, width, height);
	await image("backgrounds/back", [0, 0], [width, height]);
	context.fillStyle = "#000";
	context.fillRect(0, 2020, width, height);

	if (obj.extra?.flags) {
		await Promise.all(
			obj.extra.flags.map((flag, idx) =>
				image("flags/" + flag, [1164, 100 + 192 * idx], [336, 172])
			)
		);
	}

	next_y = 250;
	obj.effects?.forEach((effect, idx) => {
		text(effect.title, [100, next_y - 100], 40, "start", "#000", "bold");
		next_y = 200 + multiline(effect.description, [100, next_y], 1000, 40);
	});

	text(s("Tierras de Meye"), [1400, 2075], 30, "end", "#FFF", "bold");

	// render and save file
	const buffer = canvas.toBuffer("image/png");
	fs.writeFileSync("./out/" + filename + "_back.png", buffer);
}

async function periodic_table() {
	const width = 3500;
	const height = 2500;
	// INIT
	canvas = createCanvas(width, height);
	context = canvas.getContext("2d");

	context.fillStyle = "#fff";
	context.fillRect(0, 0, width, height);

	context.lineWidth = 5;
	context.strokeStyle = "#000";
	const init_pos = [300, 500];
	const box_width = 260;
	const box_height = 150;
	const periods = [0, 0.1, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5];
	const categories = {
		Volatil: "#538",
		Reactivo: "#a44",
		Precioso: "#bb5",
		Organico: "#8b8",
		No_Metalico: "#378",
		Mistico: "#79d",
		Metalico: "#999",
		Metal_Blando: "#98a",
		Alquimenidos: "#336",
	};

	//draw labels

	periods.forEach((period) => {
		let pos = init_pos.add([
			-80,
			periods.indexOf(Number(period)) * box_height - 20,
		]);
		text(period, pos, "65", "end", "#000", "bold");
	});

	for (let group = 10; group >= 0; group--) {
		let pos = init_pos.add([group * box_width + 50, -200]);
		text(group, pos, "65", "center", "#000", "bold");
	}

	//draw materials

	Object.values(material.all).forEach((mat) => {
		//ignore + materials
		if (mat.symbol.includes("+")) return;
		let pos = init_pos.add([
			mat.group * box_width,
			periods.indexOf(Number(mat.weight)) * box_height,
		]);

		context.fillStyle = categories[mat.category];
		context.fillRect(...pos.add([-15, -130]), box_width, box_height);

		text(mat.symbol, pos, "65", "start", "#000", "bold");
		text(mat.name, pos.add([0, -90]), "20");
		text(mat.resistence, pos.add([box_width - 30, -100]), "15", "end");
		text(mat.damping, pos.add([box_width - 30, -80]), "15", "end");
		text(mat.useful_life, pos.add([box_width - 30, -60]), "15", "end");
		let dmg_slc = `${mat.damage}/${mat.slice}`;
		text(dmg_slc, pos.add([box_width - 30, -40]), "15", "end");
		text(mat.level, pos.add([box_width - 30, -20]), "15", "end");
		text(mat.decadency, pos.add([box_width - 30, 0]), "15", "end");
		context.strokeRect(...pos.add([-15, -130]), box_width, box_height);
	});

	// render and save file
	const buffer = canvas.toBuffer("image/png");
	fs.writeFileSync("./out/table.png", buffer);
}

async function create_card(obj, filename) {
	await front(obj, filename);
	await back(obj, filename);
}

module.exports = {
	create_card,
	periodic_table,
};
