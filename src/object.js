const objects = require("./def/objects.json");
const createRaw = require("./raw").create;
const util = require("./util");

/*
output:
	level_name
*/

function calculateRequiredLevel(params) {
	const raw_material = createRaw(params);
	const material = raw_material.material;
	let quality_score = Infinity;
	Object.values(objects.crafting_level).forEach((e) => {
		if (e.quality >= params.quality && e.score < quality_score) {
			quality_score = e.score;
		}
	});
	const ranges = objects.class[params.class].dimension;
	let dim = util.getKeyByParamLess(ranges, "value", params.dimension);
	const trainee_level = 0;
	object_level =
		objects.class[params.class].type[params.type].level ||
		objects.class[params.class].dimension[dim].level ||
		trainee_level;
	const out_of_limits =
		(params.thickness < Math.floor(params.dimension / 2)) *
		objects.crafting_level["mystic"].score;
	const score = Math.max(
		material.level,
		object_level,
		quality_score,
		out_of_limits
	);
	return util.getKeyByParam(objects.crafting_level, "score", score);
}

/*
output:
	[
		{
			restriction
			reduction_amount
		}
	]
*/
function calculateRestrictions(params) {
	let restrictions = objects.class[params.class].restrictions;
	const property = restrictions.property;
	const range = util.closest(
		Object.keys(restrictions.ranges),
		params[property]
	);

	restrictions = objects.class[params.class].restrictions.ranges[range];
	const raw_material = createRaw(params);
	const weight = calculateWeight(params);
	const reduction = Math.floor(weight / restrictions.length);

	restrictions = restrictions.map((r) => ({ restriction: r, reduction }));
	const missing = weight - reduction * restrictions.length;
	for (let i = 0; i < missing; i++) {
		restrictions[i].reduction++;
	}
	return restrictions;
}

/*
output:
	rarity_name
*/
function calculateRarity(params) {
	const level = calculateRequiredLevel(params);
	let rarity = "common";
	if (params.quality == 1) rarity = "masterly";
	switch (level) {
		case "science":
			if (rarity != "masterly") rarity = "rare";
			break;
		case "mystic":
			rarity = "special";
			break;
		case "divine":
			rarity = "legendary";
			break;
	}
	//todo: supernatural
	return rarity;
}

/*
output:
	damage
*/
function calculateDamage(params) {
	let base_damage;
	const raw_material = createRaw(params);
	if (params.class != "weapon") {
		return calculateWeight(params);
	}
	const material = raw_material.material;
	const weapon_type = objects.class[params.class].type[params.type];
	const variable_damage = weapon_type.variable_damage;
	const damping = raw_material.damping;
	switch (params.type) {
		case "blunt":
			//calculations based on weight
			base_damage = calculateWeight(params);
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
output:
	slice
*/
function calculateSlice(params) {
	let slice;
	if (params.class != "weapon") {
		return 0;
	}
	const raw_material = createRaw(params);
	const material = raw_material.material;
	const weapon_type = objects.class[params.class].type[params.type];
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
	return Math.min(slice, material.slice);
}

/*
output:
	bleeding
*/
function calculateBleeding(params) {
	let bleeding;
	if (params.class != "weapon") {
		return 0;
	}
	const weapon_type = objects.class[params.class].type[params.type];
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
output:
	throwing
*/
function calculateThrowing(params) {
	const raw_material = createRaw(params);
	if (params.class != "weapon") {
		return calculateWeight(params) * 2;
	}
	const weapon_type = objects.class[params.class].type[params.type];
	return calculateWeight(params) * weapon_type.throwing;
}

/*
output:
	size_type_name
*/
function generateSizeType(params) {
	const ranges = objects.class[params.class].dimension;
	let type = util.getKeyByParamLess(ranges, "value", params.dimension);
	if (params.class == "armor") {
		type = params.type == "shield" ? type : params.dimension;
	}
	return type;
}

/*
output:
	[range]
*/

function calculateRange(params) {
	let range, range_max;
	if (params.class != "weapon") {
		return [Math.round(params.dimension * 4)];
	}
	const weapon_type = objects.class[params.class].type[params.type];
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
output:
	weight
*/
function calculateWeight(params) {
	const raw_material = createRaw(params);
	const object_type = objects.class[params.class].type[params.type];
	if (params.class == "common") {
		return raw_material.weight * object_type.weight_factor;
	}
	return raw_material.weight;
}

/*
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
		code
		rarity
	}
*/

function create(params) {
	if (params.class == "armor") {
		params.thickness = Math.min(
			params.thickness,
			objects.class[params.class].type[params.type].max_thickness
		);
	}
	params.quality = Number(params.quality).toFixed(1);
	const raw_material = createRaw(params);
	const material = raw_material.material;
	const useful_life = params.quality * material.useful_life;
	const level = calculateRequiredLevel(params);
	return {
		...params,
		damage: calculateDamage(params),
		slice: calculateSlice(params),
		bleeding: calculateBleeding(params),
		resistence: material.resistence,
		size: raw_material.size,
		size_type: generateSizeType(params),
		throwing: calculateThrowing(params),
		weight: calculateWeight(params),
		restrictions: calculateRestrictions(params),
		range: calculateRange(params),
		damping: raw_material.damping,
		useful_life: Math.floor(useful_life),
		crafting_level: level,
		price: {
			raw: raw_material.price,
			crafting: Math.ceil(
				material.price.useful_life * useful_life +
					0.3*raw_material.price *
						(0.2 + Math.abs(params.dimension - params.thickness))
			),
			fee: objects.crafting_level[level].fee,
		},
		code: util.encode(params),
		rarity: calculateRarity(params),
	};
}

//exports
module.exports = {
	create,
};
