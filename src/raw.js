const materials = require("./def/materials.json");

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

function create(params) {
	const size = params.dimension * params.thickness;
	const material = materials[params.material];
	const damping = Math.min(
		(params.thickness / 5) * material.damping,
		material.damping
	);
	return {
		weight: material.weight * size,
		price: material.price.base * size,
		damping,
		size,
		material,
	};
}

module.exports = {
	create
};
