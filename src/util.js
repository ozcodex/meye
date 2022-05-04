function getKey(obj, value) {
	return Object.keys(obj).find((key) => obj[key] == value);
}

function getKeyByParam(obj, param_name, value) {
	return Object.keys(obj).find((key) => obj[key][param_name] == value);
}

function getKeyByParamLess(obj, param_name, value) {
	return Object.keys(obj).find((key) => obj[key][param_name] >= value);
}

function closest(arr, goal) {
	return arr.reduce(function (prev, curr) {
		return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
	});
}

// item generator

// given class
// choose a type
// choose a material using the level as weight
// random dimension
// random thickness in a range [-1/2, dim, +1/2]

function randomObject(itemClass){
  const pick = (items) => items[Math.floor(Math.random()*items.length)]
  const itemType = pick(Object.keys(dict.classes[itemClass].types))
  const material = pick(Object.keys(dict.materials))
  const dimension = pick(Object.keys(dict.sizes))
  const thickness = pick(Object.keys(dict.sizes))
  const quality = (Math.random() || 0.1 ).toFixed(1)
  return {
    class: itemClass,
    type: itemType,
    material,
    dimension,
    thickness,
    quality
  }
}

module.exports = {
	getKey,
	getKeyByParam,
	getKeyByParamLess,
	closest,
 	randomObject
};
