const createWeapon = require("./src/weapon").create;
const createArmor = require("./src/armor").create;

function create(params) {
	switch (params.class) {
		case "weapon":
			return createWeapon(params)
			break;
		case "armor":
			return createArmor(params)
			break;
		default:
			console.error(`Error: Unknown class ${params.class}`);
	}
}

module.exports = {
	create
};

