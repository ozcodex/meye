import { create as createRaw } from "./raw.js";
import * as util from "./util.js";
import * as code from "./code.js";
import * as db from "./db.js";
import { readFileSync } from "fs";

const objects = JSON.parse(readFileSync("./src/def/objects.json"));
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
	const aprendiz_level = 0;
	const object_level =
		objects.class[params.class].type[params.type]?.level ||
		objects.class[params.class].dimension[dim]?.level ||
		aprendiz_level;
	const out_of_limits =
		(params.thickness < Math.floor(params.dimension / 2)) *
		objects.crafting_level["mistico"].score;
	const score = Math.max(
		objects.crafting_level[material.level].score,
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
	if (Object.keys(restrictions).length == 0) return [];
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
	let rarity = "comun";
	if (params.quality == 1) rarity = "magistral";
	switch (level) {
		case "ciencia":
			if (rarity != "magistral") rarity = "raro";
			break;
		case "mistico":
			rarity = "especial";
			break;
		case "divino":
			rarity = "legendario";
			break;
	}
	//TODO: sobrenatural
	return rarity;
}

/*
output:
	damage
*/
function calculateDamage(params) {
	let base_damage;
	const raw_material = createRaw(params);
	if (!["arma", "explosivo"].includes(params.class)) {
		return calculateWeight(params);
	}
	const material = raw_material.material;
	const arma_type = objects.class[params.class].type[params.type];
	const variable_damage = arma_type.variable_damage;
	const damping = calculateDamping(params);
	switch (params.type) {
		case "contundente":
			//calculations based on weight
			base_damage = calculateWeight(params);
			break;
		case "de_tension":
			//damage calculed by damping
			base_damage = Math.max(0, Math.round((damping * params.dimension) / 10));
			break;
		case "deflagrante":
		case "detonante":
			// damage based on:
			// material resistence (base damage)
			// thickness (concentration)
			// dimension (amount)
			base_damage = Math.round(
				material.resistence * params.thickness * params.dimension
			);
			break;
		default:
			base_damage = Math.abs(
				Math.round(
					arma_type.damage[0] +
						arma_type.damage[1] * params.thickness +
						arma_type.damage[2] * params.thickness ** 2
				)
			);
			break;
	}
	//reduce variable damage percent by quality
	const damage = base_damage * (1 - variable_damage * (1 - params.quality));
	return Number(Math.round(damage).toFixed());
}

/*
output:
	slice
*/
function calculateSlice(params) {
	let slice;
	if (params.class != "arma") {
		return 0;
	}
	const raw_material = createRaw(params);
	const material = raw_material.material;
	const arma_type = objects.class[params.class].type[params.type];
	const thickness = params.thickness;
	switch (params.type) {
		case "contundente":
		case "de_tension":
			slice = 0;
			break;
		default:
			slice = Math.abs(
				Math.round(
					arma_type.slice[0] +
						arma_type.slice[1] * thickness +
						arma_type.slice[2] * thickness ** 2
				)
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
	if (params.class != "arma") {
		return 0;
	}
	const arma_type = objects.class[params.class].type[params.type];
	const thickness = params.thickness;
	switch (params.type) {
		case "contundente":
		case "de_tension":
			bleeding = 0;
			break;
		default:
			bleeding = Math.round(
				arma_type.bleeding[0] +
					arma_type.bleeding[1] * thickness +
					arma_type.bleeding[2] * thickness ** 2
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
	if (params.class != "arma") {
		return calculateWeight(params) * 2;
	}
	const arma_type = objects.class[params.class].type[params.type];
	return calculateWeight(params) * arma_type.throwing;
}

/*
output:
	size_type_name
*/
function generateSizeType(params) {
	const ranges = objects.class[params.class].dimension;
	let type = util.getKeyByParamLess(ranges, "value", params.dimension);
	return type;
}

/*
output:
	[range]
*/

function calculateRange(params) {
	let range, range_max;
	const raw_material = createRaw(params);
	if (!["arma", "explosivo"].includes(params.class)) {
		range = Math.round(params.dimension * 2);
		range_max = Math.round(params.dimension * 4);
		return [range, range_max];
	}
	const arma_type = objects.class[params.class].type[params.type];
	switch (params.type) {
		case "de_tension":
			range_max =
				Math.round(Math.abs(290 + 140 * Math.log(params.dimension)) / 10) * 10;
			break;
		case "deflagrante":
		case "detonante":
			return [
				raw_material.weight.toFixed(0),
				(raw_material.weight * 2).toFixed(0),
				(raw_material.weight * 4).toFixed(0),
			];
			break;
		default:
			range_max = Math.round(params.dimension * arma_type.range);
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
	if (params.class == "comun") {
		return raw_material.weight * object_type.weight_factor;
	}
	return raw_material.weight;
}

/*
output:
	damping
*/
function calculateDamping(params) {
	const raw_material = createRaw(params);
	const material = raw_material.material;
	if (params.class == "explosivo") {
		return material.damping * raw_material.size;
	}
	return Math.min((params.thickness / 5) * material.damping, material.damping);
}

/*
output:
	useful_life
*/
function calculateUsefulLife(params) {
	const raw_material = createRaw(params);
	const material = raw_material.material;
	if (params.class == "explosivo") {
		return 1; //only one use
	}
	return Math.floor(params.quality * material.useful_life);
}

/*
output:
	{
	raw
	crafting
	fee
	}
*/
function calculatePrice(params) {
	const raw_material = createRaw(params);
	const material = raw_material.material;
	const level = calculateRequiredLevel(params);
	const raw = raw_material.price;
	let crafting = Math.ceil(
		raw_material.price * (0.2 + Math.abs(params.dimension - params.thickness))
	);
	const fee = objects.crafting_level[level].fee;
	if (params.class == "explosivo") {
		crafting = raw_material.price * params.thickness;
	}
	return {
		raw,
		crafting,
		fee,
	};
}

/*
input:
	restrictions
	update
output
	modified_restrictions

*/
function addRestriction(restrictions, update) {
	restrictions.forEach((element, index) => {
		if (element.restriction == update.restriction) {
			restrictions[index].reduction += Number(update.reduction);
		}
	});
	if (!restrictions.some((e) => e.restriction == update.restriction)) {
		restrictions = restrictions.concat([update]);
	}
	return restrictions;
}

/*
input:
	created object
output:
	object with modifications
*/

function applyExtra(obj) {
	if (!obj.extra) {
		return obj;
	}
	if (obj.extra.material) {
		const extra_params = {
			class: obj.class,
			dimension: obj.dimension,
			material: obj.extra.material,
			thickness: obj.extra.thickness,
			quality: obj.quality,
		};
		const raw = createRaw(extra_params);
		const damping = calculateDamping(extra_params);
		const useful_life = calculateUsefulLife(extra_params);
		const extra_weight = raw.weight;
		obj.price.raw += Number(raw.price);
		obj.weight += Number(extra_weight);
		obj.size += Number(raw.size);
		obj.damping += "/" + Number(damping);
		obj.resistence += "/" + Number(raw.material.resistence);
		obj.useful_life += "/" + Number(useful_life);
		//extra weight restrictions are only applied to R
		const reduction = Math.floor(raw.weight);
		if (reduction) {
			obj.restrictions = addRestriction(obj.restrictions, {
				restriction: "R",
				reduction,
			});
		}
		obj.thickness = Number(obj.thickness) + Number(obj.extra.thickness || 0);
		//recalculate damage, bleeding and slicing, and trowing whith new thickness
		obj.throwing = calculateThrowing(obj);
		obj.damage = calculateDamage(obj);
		obj.slice = calculateSlice(obj);
		obj.bleeding = calculateBleeding(obj);
	}
	// price recalculation
	obj.price.crafting = Math.ceil(obj.price.crafting * 1.1);
	obj.price.fee *= 1.5;
	if (obj.extra.flags && obj.extra.flags.length > 0) {
		obj.price.fee += objects.crafting_level.mistico.fee;
		if (obj.crafting_level != "divino") {
			obj.crafting_level = "mistico";
		}
		if (obj.rarity != "sobrenatural" && obj.rarity != "legendario") {
			obj.rarity = "especial";
		}
		if (obj.rarity != "legendario" && obj.extra.flags.includes("cenobism")) {
			obj.rarity = "sobrenatural";
		}
	}
	return obj;
}

/*
input:
	created object
output:
	object with modifications
*/

function applyMods(obj) {
	if (!obj.modifications) {
		return obj;
	}
	//apply modifications
	Object.keys(obj.modifications).forEach((mod) => {
		if (mod == "restrictions") {
			obj.modifications[mod].forEach((res) => {
				obj.restrictions = addRestriction(obj.restrictions, res);
			});
			return;
		}
		if (mod == "range") {
			obj.range = obj.range.map(
				(ran, idx) => Number(ran) + Number(obj.modifications.range[idx])
			);
			return;
		}
		if (mod == "price") {
			obj.price.raw += Number(obj.modifications.price.raw);
			obj.price.crafting += Number(obj.modifications.price.crafting);
			obj.price.fee += Number(obj.modifications.price.fee);
			return;
		}
		if (mod == "crafting_level") {
			obj.crafting_level = obj.modifications.crafting_level;
			return;
		}
		if (mod == "rarity") {
			obj.rarity = obj.modifications.rarity;
			return;
		}
		obj[mod] = Number(obj[mod]) + Number(obj.modifications[mod]);
		//prevent negative numbers
		if (obj[mod] < 0) obj[mod] = 1;
	});
	return obj;
}

/*
input:
	{
		name
		quality
		class
		dimension
		type
		material
		thickness
		extra
			origin
			sub_type
			specialization
			flags[]
		modifications
			restrictions[]
			range[]
			price
			crafting_level
			rarity
			*any_numeric_output
		effects[]
			title
			description

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
		code
		rarity
		extra
		effects
		modifications
	}
*/

function create(params) {
	if (params.class == "armadura") {
		params.thickness = Math.min(
			params.thickness,
			objects.class[params.class].type[params.type].max_thickness
		);
	}
	params.quality = Number(params.quality).toFixed(1);
	const raw_material = createRaw(params);
	const material = raw_material.material;
	const useful_life = calculateUsefulLife(params);
	const level = calculateRequiredLevel(params);
	const base_object = {
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
		damping: calculateDamping(params),
		useful_life: useful_life,
		crafting_level: level,
		price: calculatePrice(params),
		code: code.encodeBase(params),
		custom_code: params.extra ? code.encodeCustom(params) : undefined,
		mod_code: params.modifications ? code.modString(params) : undefined,
		rarity: calculateRarity(params),
	};
	const result = applyExtra(applyMods(base_object));
	const id =
		result.code + (result.custom_code ? "-" : "") + (result.custom_code || "");
	if (params.name) {
		db.upsert(id, params);
	}
	return result;
}

/*
input
	code, custom_code
output
	object
*/
function load(base_code, custom_code) {
	const params = code.decodeBase(base_code);
	if (custom_code) {
		params.extra = code.decodeCustom(custom_code, params.class);
	}
	const data = db.find(`${base_code}-${custom_code}`);
	if (data) {
		params.name = data.name;
		params.effects = data.effects;
		params.modifications = data.modifications;
	}
	return create(params);
}

//exports
export { create, load };
