const language = require("./def/language.json");

function translate(text) {
	return language[text] || text;
}

module.exports = {
	translate,
};
