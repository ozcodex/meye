const collection = require("./def/collection");
const fs = require("fs");

function find(id) {
	return collection[id];
}

function upsert(id,obj) {
	collection[id] = {
		name: obj.name,
		effects: obj.effects,
		modifications: obj.modifications,
	};
	fs.writeFileSync("./src/def/collection.json", JSON.stringify(collection));
}

module.exports = {
	find,
	upsert
};
