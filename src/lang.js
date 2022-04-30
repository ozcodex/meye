const language = require("./def/language.json");

function translate(text) {
	const str = text.toString();
	return language[str] || str;
}

function format(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
	translate,format
};
