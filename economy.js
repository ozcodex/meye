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
	const size = params.dimension * params.thickness;
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
	if (params.type === "blunt") {
		//calculations based on weight
		return 0;
	}
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
	const raw_material = createRaw({
		material: params.material,
		dimension: dimension_value,
		thickness: params.thickness,
	});
	const useful_life = params.quality * material.useful_life;
	const weapon_type = weapons.type[params.type];
	const level = getRequiredLevel(params);
	const range = dimension_value * weapon_type.range;
	console.log(dimension_value - params.thickness)
	return {
		damage: 0, //todo
		slice: 0, //todo
		bleeding: 0, //todo
		resistence: material.resistence,
		size: raw_material.size,
		throwing: raw_material.weight * weapon_type.throwing,
		weight: raw_material.weight,
		range: [floor(range / 2), range],
		damping: min(
			(params.thickness / 5) * material.damping,
			material.damping
		),
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
	material: "iron",
	type: "blunt",
	dimension: "large",
	thickness: "5",
	quality: 0.7,
});

test({
	material: "iron",
	type: "blade",
	dimension: "half",
	thickness: "2",
	quality: 0.7,
});

test({
	material: "black_iron",
	type: "blade",
	dimension: "two_handed",
	thickness: "2",
	quality: 0.7,
});


//exports 
module.exports = {
	createRaw,
	createWeapon,
};
