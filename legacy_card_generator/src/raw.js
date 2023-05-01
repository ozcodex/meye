import * as material from "./material.js";

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
		damping
		size
		material
	}
*/

function create(params) {
	const size = params.dimension * params.thickness;
	const raw_material = material.get(params.material);
	const damping = Math.min(
		(params.thickness / 5) * raw_material.damping,
		raw_material.damping
	);
	return {
		weight: raw_material.weight * size,
		price: raw_material.price * size,
		damping,
		size,
		material: raw_material,
	};
}

export { create };
