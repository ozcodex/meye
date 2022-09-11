import { readFileSync, writeFileSync } from "fs";

const collection = JSON.parse(readFileSync("./src/def/collection.json"));

function find(id) {
	return collection[id];
}

function upsert(id, obj) {
	collection[id] = {
		name: obj.name,
		effects: obj.effects,
		modifications: obj.modifications,
	};
	writeFileSync("./src/def/collection.json", JSON.stringify(collection));
}

export { find, upsert };
