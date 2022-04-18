const materials = require("./materials.json");
const weapons = require("./weapons.json");
const min = Math.min;
const max = Math.max;
const floor = Math.floor;
const abs = Math.abs;
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
		quality
	}
output:
	level
*/

function getRequiredLevel(params) {
	let quality_score = Infinity;
	Object.values(weapons.level).forEach((e) => {
		if (e.quality >= params.quality && e.score < quality_score) {
			quality_score = e.score;
		}
	});
	const score = max(
		materials[params.material].level,
		weapons.dimension[params.dimension].level,
		quality_score
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
	const damping = calculateDamping(params)
	switch (params.type) {
		case "blunt":
			//calculations based on weight
			base_damage = raw_material.weight;
			break;
		case "tension":
			//damage calculed by damping
			base_damage = max(0,floor(calculateDamping(params)*dimension_value/10))
			break;
		default:
			base_damage = floor(
				weapon_type.damage[0] +
				weapon_type.damage[1] * dimension_value +
				weapon_type.damage[2] * dimension_value ** 2);
			break;
	}
	base_damage = min(material.damage, base_damage)
	//reduce variable damage percent by quality
	damage = base_damage * (1 - variable_damage * (1 - params.quality));
	return floor(damage);
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

function calculateDamping(params){
	const material = materials[params.material];
	const damping = min(
			(params.thickness / 5) * material.damping,
			material.damping
		)
	return damping
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
		damping
		range
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
	const level = getRequiredLevel(params);
	const range = dimension_value * weapon_type.range;
	return {
		damage: calculateDamage(params),
		slice: 0, //todo
		bleeding: 0, //todo
		resistence: material.resistence,
		size: raw_material.size,
		throwing: raw_material.weight * weapon_type.throwing,
		weight: raw_material.weight,
		range: [floor(range / 2), range],
		damping: calculateDamping(params),
		useful_life: floor(useful_life),
		crafting_level: level,
		price: {
			raw: raw_material.price,
			crafting:
				material.price.useful_life * useful_life +
				raw_material.price * abs(dimension_value - params.thickness),
			fee: weapons.level[level].fee,
		},
	};
}

//test cases
function test(test_case) {
	console.log(test_case);
	console.log(createWeapon(test_case));
}

test({
	material: "steel",
	type: "blade",
	dimension: "large",
	thickness: "3",
	quality: 0.7,
});


//exports
module.exports = {
	createRaw,
	createWeapon,
};
