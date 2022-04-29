const language = require("./def/language.json");

function translate(text) {
	const str = text.toString();
	return language[str] || str;
}

module.exports = {
	translate,
};
