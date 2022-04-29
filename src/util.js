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
//material (64), class(8), type(16), dimension(8), thickness(8), quality(16)
// Escudo de Krall: 8,1,0,5,5,7
// 0001000 001 0000 101 101 0111 -> IIVX

function decode(code) {
	const raw = atob(code);
	const data =
		raw.charCodeAt(2) +
		(raw.charCodeAt(1) << 8) +
		(raw.charCodeAt(0) << 16);
	const item_class = getKeyByParam(dict.classes, "value", (data >> 14) & 0x7);
	const name = dict.collection[code]?.name;
	const result = {
		material: getKey(dict.materials, data >> 17),
		class: item_class,
		type: getKey(dict.classes[item_class].types, (data >> 10) & 0x7),
		dimension: getKey(dict.sizes, (data >> 7) & 0xf),
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
	result += dict.sizes[params.dimension] << 7;
	result += dict.classes[params.class][params.type] << 10;
	result += dict.classes[params.class].value << 14;
	result += dict.materials[params.material] << 17;
	return ntob(result);
}

module.exports = {
	getKey,
	getKeyByParam,
	getKeyByParamLess,
	decode,
	encode,
};
