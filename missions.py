#For python 3

missions = {
    1: { 'title': "Rescate", 'desc': "Rescatar a la hija de un terrateniete" },
    2: { 'title': "Exterminio", 'desc': "Exterminio de creaturas que afectan un poblado"},
    3: { 'title': "Hurto", 'desc': "Robar un objeto valioso de una fortaleza" }
}

initial = [1,2,3]


print("Seleccione la mision inicial:");
for i in initial:
    print(str(i) + '. ' + missions[i]['title'])
