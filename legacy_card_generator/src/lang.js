function string_format(text) {
	let str = text?.toString() || "";
	str = str.replace(/_/g, " ").replace("nn", "ñ");
	return str;
}

function number_format(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toCap(string) {
	if (string == '') return string;
	return string[0].toUpperCase() + string.substring(1);
}

export { string_format, number_format, toCap };
