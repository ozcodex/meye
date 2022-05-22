const materials = require("./def/materials");

/*
output:	
	material
*/
function get(symbol) {
	return materials.find(element => element.symbol == symbol)
}

/*
output:	
	mean_result
*/
function mix(property, components, proportions) {
	return components
		.map(
			(component, idx) =>
				(materials[component][property] * proportions[idx]) / 100
		)
		.reduce((sum, value) => sum + value, 0);
}

/*
output:	
	{
		damage
		resistence
		slice
		damping
		useful_life
		weight
		level
		price
	}
*/
function create(components, proportions) {
	if (proportions.reduce((sum, value) => sum + value, 0) != 100) {
		throw new Error("Wrong proportions");
	}
	components.forEach((c) => console.log(c, materials[c]));
	return {
		damage: Math.round(mix("damage", components, proportions)),
		resistence: Math.round(mix("resistence", components, proportions)),
		slice: Math.round(mix("slice", components, proportions)),
		damping: Math.round(mix("damping", components, proportions)),
		useful_life: Math.round(mix("useful_life", components, proportions)),
		weight: +(
			Math.round(mix("weight", components, proportions) + "e+1") + "e-1"
		),
		level: Math.ceil(mix("level", components, proportions)),
		price: {},
	};
}

/*
output:
	to console
*/
function table(properties) {
	let props = 'name,'
	properties.forEach( p => props+=p+',' )
	console.log(props)
	Object.keys(materials).forEach(name => {
		let row = name+','
		properties.forEach( p => row+=materials[name][p]+',' )
		console.log(row)
	})
}

module.exports = {
	all: materials,
	get,
	create,
	table
};
