const collection = require("./def/collection.json");
const dict = require("./def/dictionary.json");
const ntob = require("number-to-base64").ntob;
const util = require("./util");

// Item code
// material (128), class(8), type(16), dimension(8), thickness(8), quality(16)
// Escudo de Krall: 8,1,0,5,5,7
// 0001000 001 0000 101 101 0111 -> EELX

function decodeBase(code) {
	const raw = atob(code);
	const data =
		raw.charCodeAt(2) +
		(raw.charCodeAt(1) << 8) +
		(raw.charCodeAt(0) << 16);
	const item_class = util.getKeyByParam(
		dict.classes,
		"value",
		(data >> 14) & 0x7
	);
	const name = collection[code]?.name;
	const result = {
		material: util.getKey(dict.materials, data >> 17),
		class: item_class,
		type: util.getKey(dict.classes[item_class].types, (data >> 10) & 0xf),
		dimension: util.getKey(dict.sizes, (data >> 7) & 0x7),
		thickness: util.getKey(dict.sizes, (data >> 4) & 0x7),
		quality: ((data & 0xf) * 0.1).toFixed(1),
	};
	if (name) {
		result.name = name;
	}
	return result;
}

function encodeBase(params) {
	let result = 0;
	result = params.quality * 10;
	result += dict.sizes[params.thickness] << 4;
	result += dict.sizes[params.dimension] << 7;
	result += dict.classes[params.class].types[params.type] << 10;
	result += dict.classes[params.class].value << 14;
	result += dict.materials[params.material] << 17;
	return ntob(result);
}

// Item customization code
// origen (128), sub-type(16), specialization (8), flags(10)
// flags: grafia, lazado, alquimia, cenobia, energia pura, objetos, ilusion, mental, potenciacion, vital
// origen:banken(10) , sub-type:rodela(5), spec:reforzado_umbonado(3),grafia,alquimia,ilusion
// Escudo de Krall: 10,5,3,1,0,1,0,0,0,1,0,0,0
// 0001010 0101 011 1010001000 = FK6I
// Extra
// material (32), thickness (8)
// steel: 12, thickness: 2
// 01100 010 = 0x62

function decodeCustom(code, item_class) {
	const extra = code.split("-")[1];
	const raw = atob(code.split("-")[0]);
	const data =
		raw.charCodeAt(2) +
		(raw.charCodeAt(1) << 8) +
		(raw.charCodeAt(0) << 16);

	const result = {
		origin: util.getKey(dict.origins, (data >> 17) & 0xf),
		sub_type: util.getKey(
			dict.classes[item_class].sub_types,
			(data >> 13) & 0xf
		),
		specialization: util.getKey(
			dict.classes[item_class].specializations,
			(data >> 10) & 0x7
		),
		flags: {
			graphy: (data >> 9) & 0x1,
			lacing: (data >> 8) & 0x1,
			alchemy: (data >> 7) & 0x1,
			cenobism: (data >> 6) & 0x1,
			energy: (data >> 5) & 0x1,
			object_manipulation: (data >> 4) & 0x1,
			ilusion: (data >> 3) & 0x1,
			mental_manipulation: (data >> 2) & 0x1,
			potentiation: (data >> 1) & 0x1,
			vital_cotrol: data & 0x1,
		},
	};
	result.flags = Object.keys(result.flags).filter((key) => result.flags[key]);
	if (extra) {
		const hex_data = parseInt(extra, 16);
		result.material = util.getKey(dict.materials, hex_data >> 3);
		result.thickness = util.getKey(dict.sizes, hex_data & 0x7);
	}
	return result;
}

function encodeCustom(params) {
	let result = 0;
	result = dict.origins[params.extra.origin] << 17;
	result += dict.classes[params.class].sub_types[params.extra.sub_type] << 13;
	result +=
		dict.classes[params.class].specializations[
			params.extra.specialization
		] << 10;
	result += params.extra.flags.includes("graphy") << 9;
	result += params.extra.flags.includes("lacing") << 8;
	result += params.extra.flags.includes("alchemy") << 7;
	result += params.extra.flags.includes("cenobism") << 6;
	result += params.extra.flags.includes("energy") << 5;
	result += params.extra.flags.includes("object_manipulation") << 4;
	result += params.extra.flags.includes("ilusion") << 3;
	result += params.extra.flags.includes("mental_manipulation") << 2;
	result += params.extra.flags.includes("potentiation") << 1;
	result += params.extra.flags.includes("vital_cotrol");
	result = ntob(result);
	if (params.extra.material && params.extra.thickness) {
		let hex = dict.materials[params.extra.material] << 3;
		hex += dict.sizes[params.extra.thickness];
		result += "-" + hex.toString(16);
	}
	return result;
}

// Mod string
// abbreviations of all modifications object has

function modString(params) {
	let result = "";
	Object.keys(params.modifications).forEach((mod) => {
		value = params.modifications[mod];
		name = dict.modifications[mod];
		result += name + " ";
	});

	return "tbd";
}

module.exports = {
	decodeBase,
	encodeBase,
	decodeCustom,
	encodeCustom,
	modString,
};
