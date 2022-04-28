const weapons = require("./def/weapons.json");
const createRaw = require("./raw").create;
const util = require("./util")

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

function calculateRequiredLevel(params) {
	const dimension_key = util.getKeyByParamLess(
		weapons.dimension,
		"value",
		params.dimension
	);
	const raw_material = createRaw(params);
	const material = raw_material.material;
	let quality_score = Infinity;
	Object.values(weapons.level).forEach((e) => {
		if (e.quality >= params.quality && e.score < quality_score) {
			quality_score = e.score;
		}
	});
	const out_of_limits =
		(params.thickness < Math.floor(params.dimension / 2)) *
		weapons.level["mystic"].score;
	const score = Math.max(
		material.level,
		weapons.dimension[dimension_key].level,
		quality_score,
		out_of_limits
	);
	return util.getKeyByParam(weapons.level,'score',score)
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
	const raw_material = createRaw(params);
	const material = raw_material.material;
	const weapon_type = weapons.type[params.type];
	const variable_damage = weapon_type.variable_damage;
	const damping = raw_material.damping;
	switch (params.type) {
		case "blunt":
			//calculations based on weight
			base_damage = raw_material.weight;
			break;
		case "tension":
			//damage calculed by damping
			base_damage = Math.max(
				0,
				Math.round((damping * params.dimension) / 10)
			);
			break;
		default:
			base_damage = Math.round(
				weapon_type.damage[0] +
					weapon_type.damage[1] * params.dimension +
					weapon_type.damage[2] * params.dimension ** 2
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
	const raw_material = createRaw(params);
	const material = raw_material.material;
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
	return Math.min(slice,material.slice);
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
	const weapon_type = weapons.type[params.type];
	switch (params.type) {
		case "tension":
			range_max =
				Math.round(
					Math.abs(290 + 140 * Math.log(params.dimension)) / 10
				) * 10;
			break;
		default:
			range_max = Math.round(params.dimension * weapon_type.range);
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
	const dimension_key = util.getKeyByParamLess(
		weapons.dimension,
		"value",
		params.dimension
	);
	let restrictions = weapons.dimension[dimension_key].restrictions;
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
		size_type
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

function create(params) {
	const dimension_key = util.getKeyByParamLess(
		weapons.dimension,
		"value",
		params.dimension
	);
	const raw_material = createRaw(params);
	const material = raw_material.material;
	const useful_life = params.quality * material.useful_life;
	const weapon_type = weapons.type[params.type];
	const level = calculateRequiredLevel(params);
	return {
		damage: calculateDamage(params),
		slice: calculateSlice(params),
		bleeding: calculateBleeding(params),
		resistence: material.resistence,
		size: raw_material.size,
		size_type: dimension_key,
		throwing: raw_material.weight * weapon_type.throwing,
		weight: raw_material.weight,
		restrictions: calculateRestrictions(params),
		range: calculateRange(params),
		damping: raw_material.damping,
		useful_life: Math.floor(useful_life),
		crafting_level: level,
		price: {
			raw: raw_material.price,
			crafting:
				material.price.useful_life * useful_life +
				raw_material.price *
					Math.abs(params.dimension - params.thickness),
			fee: weapons.level[level].fee,
		},
	};
}

//exports
module.exports = {
	create,
};
