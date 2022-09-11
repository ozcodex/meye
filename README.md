# meye

calculator to create items using the rules of the game.

features:
- allow to create weapons
- allow tho create armors and shields
- easy to maintain materials
- more materials!!
- item code, generate and recover
- export card as image
- common objects
- item generator
- custom code with origin, subtypes and flags for mystycs 
- code extra material and thickness
- change crafting level if have some extra flags
- apply card modifications
- show extras on card
- create card reverse

## To do
smaller font in the card name
charge numbers colors if a mod was applied
create subtypes and specializations
change flags to spanish
change modifications to spanish
mix object.json and dictionary.json
test restrictions on CLI

v2:
add more types of common objects
add components
explosives
poison, venom, toxins and acids

v3:
create and read qr codes
graphical interface
edibles
fluids and containers
write down all the rules for item creation
generate tables (export data in csv)

## Usage

Update the obj.json file

if the object have a name it will be saved on the database


## Example

{
    class: "armor",
    material: "iron",
    type: "shield",
    dimension: "3",
    thickness: 3,
    quality: 0.7,
    extra: {
      material: "steel",
      thickness: 0.5,
      origin: "banken",
      sub_type: "buckler",
      specialization: "reinforced_umbonated",
      flags: ["graphy", "alchemy", "ilusion"],
    },
    effects: [
      {
        title: "Grafia y Alquimia",
        description:
          "Grabado tratado alquimicamente para la activación automatica de su habilidad" +
          " propia. Aunque para evitar caer en su propia ilusion el portador debe " +
          "permanecer atento a su entorno y conciente de su realidad.",
      },
      {
        title: "ilusion",
        description:
          "Crea una falange ilusoria de hasta 4 copias, ocultando la verdadera posición del usuario.",
      },
    ],
    modifications: {
      damage: 2,
      weight: -5,
      restrictions: [{ restriction: "C", reduction: 5 }],
    },
  }