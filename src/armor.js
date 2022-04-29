const armors = require("./def/armors.json");
const createRaw = require("./raw").create;
const util = require("./util");

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
	const raw_material = createRaw(params);
	const material = raw_material.material;
	let quality_score = Infinity;
	Object.values(armors.level).forEach((e) => {
		if (e.quality >= params.quality && e.score < quality_score) {
			quality_score = e.score;
		}
	});
	const out_of_limits =
		(params.thickness < Math.floor(params.dimension / 2)) *
		armors.level["mystic"].score;
	const score = Math.max(
		material.level,
		armors.type[params.type].level,
		quality_score,
		out_of_limits
	);
	return util.getKeyByParam(armors.level, "score", score);
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
	let restrictions = armors.type[params.type].restrictions;
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
		armors.dimension,
		"value",
		params.dimension
	);
	params.thickness = Math.min(
		params.thickness,
		armors.type[params.type].max_thickness
	);
	const raw_material = createRaw(params);
	const material = raw_material.material;
	const useful_life = params.quality * material.useful_life;
	const level = calculateRequiredLevel(params);
	return {
		...params,
		damage: raw_material.weight,
		slice: 0,
		bleeding: 0,
		resistence: material.resistence,
		size: raw_material.size,
		size_type:
			params.type == "shield"
				? dimension_key
				: `${params.dimension} pieces`,
		throwing: raw_material.weight * 2,
		weight: raw_material.weight,
		restrictions: calculateRestrictions(params),
		range: Math.round(params.dimension * 4),
		damping: raw_material.damping,
		useful_life: Math.floor(useful_life),
		crafting_level: level,
		price: {
			raw: raw_material.price,
			crafting: Math.ceil(
				material.price.useful_life * useful_life +
					raw_material.price *
						Math.abs(params.dimension - params.thickness)
			),
			fee: armors.level[level].fee,
		},
		code: util.encode(params),
	};
}

//exports
module.exports = {
	create,
};
