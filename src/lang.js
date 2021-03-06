function string_format(text) {
	let str = text?.toString() || "";
	str = str.replace("_", " ").replace("nn", "ñ");
	return str;
}

function number_format(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
	string_format,
	number_format,
};
