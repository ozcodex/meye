#For python 3

#define the list of missions
#TODO: put in external files or db
missions = {
    1: { 
        'title': "Rescate", 
        'desc': "Rescatar a la hija de un terrateniete",
        'default_ending': 2,
        'endings':{
            1: {'title':"Rescate exitoso",'desc':'Tras un rescate exitoso el grupo entrega a la doncella en el punto establecido, pero la situacion se ve anomala',"forced_next": 4},
            2: {'title':"El objetivo no fue rescatado",'desc':'Luego de fracasar en su mision el grupo se entera de que la mision era falsa, realmente era un secuestro camuflado, son fichados como cazadores no eticos'},
            3: {'title':"Muerte del objetivo",'desc': "la doncella muere, quedan fichados como criminales hasta que demuestren su inocencia"},
            },
        'next': [8,9],
        'limited': True,
        },
    2: { 
        'title': "Exterminio", 
        'desc': "Acabar con las creaturas que afectan un poblado",
        'default_ending': 5,
        'endings':{
            1: {'title':"Mataron a todos los invasores",'desc':'Todas las criaturas han sido eliminados y el pueblo limpiado'},
            2: {'title':"Ubicaron y mataron a la reina",'desc':'El equipo logra acabar con el nido de las creaturas y matar a la reina, algunas creaturas quedan sdeambulando pero son inofensivas'},
            3: {'title':"El pueblo quedo destruido, pero muchas personas se salvaron",'desc':'A pesar de haber logrado salvar a muchas personas el pueblo quedo en ruinas, ahora '},
            4: {'title':"Muchos pobladores murieron, pero el pueblo quedo en buen estado",'desc':'So pena de la muerte de muchas personas lograron limpiar el pueblo de las creatiuras invasoras'},
            5: {'title':"El pueblo fue destruido y muchas personas murieron",'desc':'A pesar de los efuerzos la mision ha fracasado, con un pueblo destruido y una poblacion '}
            },
        'next': [8,9],
        'limited': False,
        
        },
    3: { 
        'title': "Hurto", 
        'desc': "Robar un objeto valioso de una fortaleza",
        'default_ending': 3,
        'endings':{
            1:{'title':"Escapan sin ser notados con el objeto robado",'desc':'Una victoria perfecta, el objeto fue robado en completo sigilo, quedan catalogados como cazadores eficientes'},
            2:{'title':"Escapan con mucho alboroto con el objeto",'desc':'El grupo parece no conocer el sigilo, aun asi logran escapar con el objeto robado'},
            3:{'title':"Uno o mas integrantes son atrapados",'desc':'Algunos miembros del grupo han sido atrapados, su responsabilidad como cazadores es no dejarlos atras', 'forced_next':5},
            4:{'title':"Escapan pero no lograr robar el objeto",'desc':'La mision ha fallado, la mala reputacion empieza a cernirse sobre el grupo'}
            },
        'next': [8,9],
        'limited': False,
        
        },
    4:{
        'title':"Sobrevivir!",
        'desc':"Luego de entregar a la chica, los receptores intentan asesinar al grupo",
        'default_ending': 3,
        'endings':{
            1:{'title':"Uno o mas atacantes son capturados",'desc':"Los cazadores logran tomar uno o mas rehenes, esto sera muy util para resolver el misterio"},
            2:{'title':"Los atacantes son asesinados",'desc':"Algo raro estaba pasando, el equipo ha sobrevivido pero ahora deben hacer algo con la chica"},
            3:{'title':"Los cazadores huyen",'desc':"Los cazadores logran escaparse, pero ahora hay una atmosfera de preocupacion"},
        },
        'next': [8,9],
        'limited':True,
        },
    5:{
        'title':"Negociacion",
        'desc':"El general del fuerte les ofrece al grupo de cazadores, a cambio de liberar a los prisioneros, una mision de asesinato",
        'default_ending': 3,
        'endings':{
            1:{'title':"Los cazadores aceptan el trato",'desc':"Ahora los cazadores han quedado comprometidos con el general y una nueva mision los aguarda", "forced_next":6},
            2:{'title':"Los cazadores se niegan al trato",'desc':"Al negarse al trato son decrarados como enemigos y ahora deben rescatar a los capturados","forced_next":7},
        },
        'next': [8,9],
        'limited':True,
        },
    6:{'title':"Asesinato"},
    7:{'title':"Escape"},
    8:{'title':"Undefined"},
    9:{'title':"Undefined"},
}

#define the initial missions
available = [1,2,3]

#start printing the available missions
print("Misiones disponibles:");
for i in available:
    print(str(i) + '. ' + missions.get(i)['title'])

#select the current mission
selected = int( input("seleccione la mission: ") )

print ("-------------------------")
print (missions.get(selected)['title'])
print (missions.get(selected)['desc'])

#print the possible endings of the selected missions
print ("Los posibles finales para la aventura son:")
for i in missions.get(selected)['endings']:
    print(str(i) + '. ' + missions.get(selected)['endings'][i]['title'])

#select the ending
ending = int( input("seleccione el final logrado: ") )

print ("-------------------------")
print(missions.get(selected)['endings'][ending]['title'])
print(missions.get(selected)['endings'][ending]['desc'])

#check for forced missions

if 'forced_next' in missions.get(selected)['endings'][ending].keys():
    next_mission = missions.get(selected)['endings'][ending]['forced_next']
    print("hay una mision forzada: "+ missions.get(next_mission)['title'])
    print(missions.get(next_mission)['desc'])

else:
    print("vuelven a la taberna")

#Remove selected mission and limited ones
available.remove(selected)
for i in available:
    if missions.get(i)['limited']:
        available.remove(i)
#Add new missions
available.extend(missions.get(selected)['next'])

print ("-------------------------")
print("siguientes misiones:")
for i in available:
    print(str(i) + '. ' + missions.get(i)['title'])
