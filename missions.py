#For python 3

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
        'next': [6,7,8],
        'limited': True,
        },
    2: { 
        'title': "Exterminio", 
        'desc': "Acabar con las creaturas que afectan un poblado",
        'default_ending': 2,
        'endings':{
            1: {'title':"Mataron a cada ser invasor en el pueblo",'desc':''},
            2: {'title':"Ubicaron y mataron a la reina, quedan criaturas vagando pero son inofensivas",'desc':''},
            3: {'title':"El pueblo quedo destruido, pero muchas personas se salvaron",'desc':''},
            4: {'title':"Muchos pobladores murieron, pero el pueblo quedo en buen estado",'desc':''},
            5: {'title':"El pueblo fue destruido y muchas personas murieron (defecto)",'desc':''}
            },
        'next': [6,7,8],
        'limited': False,
        
        },
    3: { 
        'title': "Hurto", 
        'desc': "Robar un objeto valioso de una fortaleza",
        'default_ending': 2,
        'endings':{
            1:{'title':"Escapan sin ser notados con el objeto robado",'desc':''},
            2:{'title':"Escapan con mucho albarato con el objeto",'desc':''},
            3:{'title':"Uno o mas integrantes son atrapados (defecto)",'desc':''},
            4:{'title':"Escapan pero no lograr robar el objeto",'desc':''}
            },
        'next': [6,7,8],
        'limited': False,
        
        },
    4:{'title':"Undefined"},
    5:{'title':"Undefined"},
    6:{'title':"Undefined"},
    7:{'title':"Undefined"},
    8:{'title':"Undefined"},
}

available = [1,2,3]


print("Misiones disponibles:");
for i in available:
    print(str(i) + '. ' + missions.get(i)['title'])

selected = int( input("seleccione la mission: ") )

print ("-------------------------")
print (missions.get(selected)['title'])
print (missions.get(selected)['desc'])

print ("Los posibles finales para la aventura son:")
for i in missions.get(selected)['endings']:
    print(str(i) + '. ' + missions.get(selected)['endings'][i]['title'])

ending = int( input("seleccione el final logrado: ") )

print ("-------------------------")
print(missions.get(selected)['endings'][ending]['title'])
print(missions.get(selected)['endings'][ending]['desc'])

if 'forced_next' in missions.get(selected)['endings'][ending].keys():
    print("hay una mision forzada")
else:
    print("vuelven a la taberna")

#Remove selected mission and limited ones
available.remove(selected)
for i in available:
    if missions.get(i)['limited']:
        available.remove(i)
#Add new missions
available.extend(missions.get(selected)['next'])

print(available)
print("siguientes misiones:")
for i in available:
    print(str(i) + '. ' + missions.get(i)['title'])
