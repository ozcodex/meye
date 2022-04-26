const materials = require("./materials.json");
const weapons = require("./weapons.json");

/*
input:
	{
		material
		dimension
		thickness
	}
output:
	{
		weight
		price
		size
	}
*/

function createRaw(params) {
	const dimension_value = weapons.dimension[params.dimension].value;
	const size = dimension_value * params.thickness;
	const material = materials[params.material];
	return {
		weight: material.weight * size,
		price: material.price.base * size,
		size,
	};
}

/*
input:
	{
		material
		dimension
		thickness
		quality
	}
output:
	level
*/

function calculateRequiredLevelWeapon(params) {
	let quality_score = Infinity;
	const dimension_value = weapons.dimension[params.dimension].value;
	Object.values(weapons.level).forEach((e) => {
		if (e.quality >= params.quality && e.score < quality_score) {
			quality_score = e.score;
		}
	});
	const out_of_limits =
		(params.thickness < Math.floor(dimension_value / 2)) *
		weapons.level["mystic"].score;
	const score = Math.max(
		materials[params.material].level,
		weapons.dimension[params.dimension].level,
		quality_score,
		out_of_limits
	);
	return Object.keys(weapons.level).find(
		(k) => weapons.level[k].score == score
	);
}

/*
input:
	{
		material
		type
		dimension
		thickness
		quality
	}
output:
	damage
*/
function calculateDamage(params) {
	let base_damage;
	const material = materials[params.material];
	const dimension_value = weapons.dimension[params.dimension].value;
	const raw_material = createRaw(params);
	const weapon_type = weapons.type[params.type];
	const variable_damage = weapon_type.variable_damage;
	const damping = calculateDamping(params);
	switch (params.type) {
		case "blunt":
			//calculations based on weight
			base_damage = raw_material.weight;
			break;
		case "tension":
			//damage calculed by damping
			base_damage = Math.max(
				0,
				Math.round((calculateDamping(params) * dimension_value) / 10)
			);
			break;
		default:
			base_damage = Math.round(
				weapon_type.damage[0] +
					weapon_type.damage[1] * dimension_value +
					weapon_type.damage[2] * dimension_value ** 2
			);
			break;
	}
	base_damage = Math.min(material.damage, base_damage);
	//reduce variable damage percent by quality
	damage = base_damage * (1 - variable_damage * (1 - params.quality));
	return Math.round(damage);
}

/*
input:
	{
		thickness
		type
	}
output:
	slice
*/
function calculateSlice(params) {
	let slice;
	const weapon_type = weapons.type[params.type];
	const thickness = params.thickness;
	switch (params.type) {
		case "blunt":
		case "tension":
			slice = 0;
			break;
		default:
			slice = Math.round(
				weapon_type.slice[0] +
					weapon_type.slice[1] * thickness +
					weapon_type.slice[2] * thickness ** 2
			);
			break;
	}
	return slice;
}

/*
input:
	{
		thickness
		type
	}
output:
	bleeding
*/
function calculateBleeding(params) {
	let bleeding;
	const weapon_type = weapons.type[params.type];
	const thickness = params.thickness;
	switch (params.type) {
		case "blunt":
		case "tension":
			bleeding = 0;
			break;
		default:
			bleeding = Math.round(
				weapon_type.bleeding[0] +
					weapon_type.bleeding[1] * thickness +
					weapon_type.bleeding[2] * thickness ** 2
			);
			break;
	}
	return bleeding;
}
/*
input:
	{
		dimension
		type
	}
output:
	[range]
*/

function calculateRange(params) {
	let range, range_max;
	const dimension_value = weapons.dimension[params.dimension].value;
	const weapon_type = weapons.type[params.type];
	switch (params.type) {
		case "tension":
			range_max = Math.round(Math.abs(290 + 140 * Math.log(dimension_value)) / 10) * 10;
			break;
		default:
			range_max = Math.round(dimension_value * weapon_type.range);
			break;
	}
	range = Math.floor(range_max / 2);
	return [range, range_max];
}
/*
input:
	{
		dimension
		thickness
		material
	}
output:
	[
		{
			restriction
			reduction
		}
	]
*/
function calculateRestrictions(params) {
	let restrictions = weapons.dimension[params.dimension].restrictions;
	const raw_material = createRaw(params);
	const weight = raw_material.weight;
	const reduction = Math.floor(weight / restrictions.length);

	restrictions = restrictions.map((r) => ({ restriction: r, reduction }));
	const missing = weight - reduction * restrictions.length;
	for (let i = 0; i < missing; i++) {
		restrictions[i].reduction++;
	}
	return restrictions;
}
/*
input:
	{
		material
		thickness
	}
output:
	damping
*/

function calculateDamping(params) {
	const material = materials[params.material];
	const damping = Math.min(
		(params.thickness / 5) * material.damping,
		material.damping
	);
	return damping;
}

/*
input:
	{
		material
		type
		dimension
		thickness
		quality
	}
output:
	{
		damage
		resistence
		slice
		bleeding
		size
		throwing
		weight
		restrictions
		range
		damping
		useful_life
		crafting_level
		price
	}
*/

function createWeapon(params) {
	const material = materials[params.material];
	const dimension_value = weapons.dimension[params.dimension].value;
	const raw_material = createRaw(params);
	const useful_life = params.quality * material.useful_life;
	const weapon_type = weapons.type[params.type];
	const level = calculateRequiredLevelWeapon(params);
	return {
		damage: calculateDamage(params),
		slice: calculateSlice(params),
		bleeding: calculateBleeding(params),
		resistence: material.resistence,
		size: raw_material.size,
		throwing: raw_material.weight * weapon_type.throwing,
		weight: raw_material.weight,
		restrictions: calculateRestrictions(params),
		range: calculateRange(params),
		damping: calculateDamping(params),
		useful_life: Math.floor(useful_life),
		crafting_level: level,
		price: {
			raw: raw_material.price,
			crafting:
				material.price.useful_life * useful_life +
				raw_material.price * Math.abs(dimension_value - params.thickness),
			fee: weapons.level[level].fee,
		},
	};
}

//test cases
function testWeapon(test_case) {
	console.log(test_case);
	console.log(createWeapon(test_case));
}

testWeapon({
	material: "wood",
	type: "tension",
	dimension: "short",
	thickness: "2",
	quality: 0.7,
});

testWeapon({
	material: "iron",
	type: "blade",
	dimension: "large",
	thickness: "0.25",
	quality: 0.1,
});

//exports
module.exports = {
	createRaw,
	createWeapon,
};
