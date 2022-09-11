import { create, load } from "./src/object.js";
import { create_card, periodic_table } from "./src/render.js";

(async () => {
  await create_card(load("ERXX", "FAKI-62"));
  await create_card(load("GArK", "FAOA"));
  await create_card(load("JAk1", "GAGA"));
  await create_card(load("GAg4", "EAAA"));
  await create_card(load("GApa", "DgCA-4a"));
  await create_card(load("BhY2", "G/wA-91"));
  await create_card(load("EAGn", "GggA"));
  await periodic_table();
})();
