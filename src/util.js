const dict = require("./def/dictionary.json");
const ntob = require('number-to-base64').ntob 

function getKey(obj, value) {
	return Object.keys(obj).find((key) => obj[key] == value);
}

function getKeyByParam(obj, param_name, value) {
	return Object.keys(obj).find((key) => obj[key][param_name] == value);
}

function getKeyByParamLess(obj, param_name, value) {
	return Object.keys(obj).find((key) => obj[key][param_name] >= value);
}

//Item code functionality
//material (32), class(8), type(8), dimension(16), thickness(16), quality(16)
// Escudo de Krall: 8,1,0,5,5,7
// 001000 001 000 0101 0101 0111 -> IIVX
// HEX: 208557
// DEC: 2131287

function decode(code) {
	const raw = atob(code);
	const data =
		raw.charCodeAt(2) +
		(raw.charCodeAt(1) << 8) +
		(raw.charCodeAt(0) << 16);
	const item_class = getKeyByParam(dict.classes, "value", (data >> 15) & 0x7);
	const name = dict.collection[code].name;
	const result = {
		material: getKey(dict.materials, data >> 18),
		class: item_class,
		type: getKey(dict.classes[item_class].types, (data >> 12) & 0x7),
		dimension: getKey(dict.sizes, (data >> 8) & 0xf),
		thickness: getKey(dict.sizes, (data >> 4) & 0xf),
		quality: ((data & 0xf) * 0.1).toFixed(1),
	};
	if (name) {
		result.name = name;
	}
	return result;
}

function encode(params) {
	let result = 0;
	result = params.quality * 10;
	result += dict.sizes[params.thickness] << 4;
	result += dict.sizes[params.dimension] << 8;
	result += dict.classes[params.class][params.type] << 12;
	result += dict.classes[params.class].value << 15;
	result += dict.materials[params.material] << 18;
	return ntob(result);
}

module.exports = {
	getKey,
	getKeyByParam,
	getKeyByParamLess,
	decode,
	encode,
};
