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

function getRequiredLevel(quality){

}

function createBaseWeapon(params) {
	const material = materials[params.material];
	const raw_material = createRaw({
		material: params.material,
		dimension: weapons.dimension[params.dimension],
		thickness: params.thickness,
	});
	const weapon_type = weapons.type[params.type];
	return {
		damage: 0, //todo
		slice: 0, //todo
		bleeding: 0, //todo
		resistence: material.resistence,
		size: raw_material.size,
		throwing: raw_material.weight * weapon_type.throwing,
		weight: raw_material.weight,
		damping: min(
			(params.thickness / 5) * material.damping,
			material.damping
		),
		useful_life: params.quality * material.useful_life,
		price: {
			raw: raw_material.price,
			crafting: 0, //todo
			fee: 0, //todo,
		},
	};
}

module.exports = {
	createRaw,
	createBaseWeapon,
};
