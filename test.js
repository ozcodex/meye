import { create, load } from "./src/object.js";
import { create_card, periodic_table } from "./src/render.js";

async () => {
  await create_card(load("ERXX", "FAKI-62"));
  await create_card(load("GArK", "FAOA"));
  await create_card(load("JAk1", "GAGA"));
  await create_card(load("GAg4", "EAAA"));
  await create_card(load("GApa", "DgCA-4a"));
  await periodic_table();
}; //();

console.log(
  create({
    class: "arma",
    type: "proyectil",
    extra: {
      sub_type: "recta",
      specialization: "simple",
      origin: "sobrenatural",
      category: "Volatil",
      material: "PC",
      thickness: "0.1",
      flags: [],
    },
    category: "Volatil",
    material: "PC",
    quality: "0.1",
    dimension: "0.1",
    thickness: "0.1",
    extra_material: true,
    effects: [{ title: "Construccion", description: "oeaoe" }],
    modifications: {
      damage: "25",
      slice: "1",
      bleeding: "-5",
      resistence: "23",
      size: "5",
      throwing: "82",
      weight: "-100",
      restrictions: [
        { restriction: "A", reduction: "415" },
        { restriction: "W", reduction: "12" },
      ],
      range: "12,6",
      price: { raw: "25", crafting: "15", fee: "99" },
      damping: "74",
      useful_life: "42",
    },
  })
);
