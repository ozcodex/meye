const materials = require("./materials.json");
const weapons = require("./weapons.json");
const min = Math.min;
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
		type
		level
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
		useful_life
		price
	}
*/

function createWeapon(params) {
	const material = materials[params.material];
	const raw_material = createRaw({
		material: params.material,
		dimension: params.dimension,
		thickness: params.thickness,
	});

	const weapon = weapons[params.type];
	const size = weapon.size;
	return {
		damage: 0, //todo
		resistence: 0, //todo
		slice: 0, //todo
		bleeding: 0, //todo
		size: 0, //todo
		throwing: 0, //todo
		weight: 0, //todo
		damping: min(
			(params.thickness / 5) * material.damping,
			material.damping
		),
		useful_life: 0, //todo
		price: {
			raw: raw_material.price,
			crafting: 0, //todo
			fee: 0, //todo,
		},
	};
}

module.exports = {
	createRaw,
	createWeapon,
};
