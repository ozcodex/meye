const materials = require("./materials.json");
const weapons = require("./weapons.json");

/*
input:
	{
		material
		size
		thickness
	}
output:
	{
		weight
		price
	}
*/

function createRaw(params) {
	const absolute_size = params.size * params.thickness;
	const material = materials[params.material];
	return {
		weight: material.weight * absolute_size,
		price: material.price.base * absolute_size,
		size: absolute_size,
	};
}

/*
input:
	{
		material
		thickness
	}
output:
	{
		resistence
		lance*
		damping
		absolute_size
		price
		damage
		desangre*
		corte*
		weight
		size_restrictions
	}
*/

module.exports.createDagger = (params) => {
	const weapon = weapons["daga"];
	const size = weapon.size;
	const raw_material = createRaw({ size, ...params });
	const material = materials[params.material];
	return {
		damping: (params.thickness / 5) * material.damping,
	};
};

module.exports = {
	createRaw,
	createDagger,
};
