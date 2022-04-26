const createWeapon = require("./weapon").create;

//test cases
function testWeapon(test_case) {
	console.log({ class: "weapon", ...test_case, ...createWeapon(test_case) });
}

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
