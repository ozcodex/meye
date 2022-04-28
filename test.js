const createWeapon = require("./weapon").create;
const createArmor = require("./armor").create;

function testArmor(test_case) {
	console.log({ class: "armor", ...createArmor(test_case) });
}

function testWeapon(test_case) {
	console.log({ class: "weapon", ...createWeapon(test_case) });
}

//test cases

testWeapon({
	material: "wood",
	type: "tension",
	dimension: "1",
	thickness: "2",
	quality: 0.7,
});

testWeapon({
	material: "iron",
	type: "blade",
	dimension: "3",
	thickness: "0.25",
	quality: 0.1,
});

testArmor({
	material: "iron",
	type: "shield",
	dimension: "3",
	thickness: 3,
	quality: 0.7,
});
