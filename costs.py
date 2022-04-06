import tkinter as tk

class App(tk.Frame):

	def __init__(self, master):
		tk.Frame.__init__(self, master)

		self.materials = {
			'Hierro' : {'value': 1, 'weight': 3},
			'Bronce' : {'value': 2, 'weight': 4},
			'Cobre' : {'value': 3, 'weight': 5},
		}

		self.selected_material = tk.StringVar(self)
		self.selected_material.trace('w', self.update)
		self.dimensions = tk.StringVar(self)
		self.dimensions.trace('w', self.update)

		self.label_materials = tk.Label(self, text='Materiales')
		self.optionmenu_materials = tk.OptionMenu(self, self.selected_material, *self.materials.keys())

		self.label_dimensions = tk.Label(self, text='Dimensiones')
		self.entry_dimensions = tk.Entry(self, textvariable=self.dimensions)
		self.label_weight = tk.Label(self, text='Peso')
		self.entry_weight = tk.Entry(self)
		self.entry_weight.bind("<Key>", lambda e: "break")
		self.label_cost = tk.Label(self, text='Costo')
		self.entry_cost = tk.Entry(self)
		self.entry_cost.bind("<Key>", lambda e: "break")

		self.button_exit = tk.Button(self, text="Quit", command=root.destroy)

		self.label_materials.grid(row=1, column=0)
		self.optionmenu_materials.grid(row=1, column=1)
		self.label_dimensions.grid(row=2, column=0)
		self.entry_dimensions.grid(row=2, column=1)
		self.label_weight.grid(row=3,column=0)
		self.entry_weight.grid(row=3,column=1)
		self.label_cost.grid(row=4,column=0)
		self.entry_cost.grid(row=4,column=1)
		self.button_exit.grid(row=5, column=0)
		self.pack()


	def update(self, *args):
		weight = 0
		cost = 0
		material = self.materials[self.selected_material.get()]
		dimensions = self.dimensions.get()
		try:
			cost = material['value'] * float(dimensions)
			weight = material['weight'] * float(dimensions)
		except Exception as e:
			cost = '--'
			weight = '--'
		print(weight,cost)
		self.entry_weight.delete(0,tk.END)
		self.entry_weight.insert(0,weight)
		self.entry_cost.delete(0,tk.END)
		self.entry_cost.insert(0,cost)
	#	countries = self.dict[self.variable_a.get()]
	#	self.variable_b.set(countries[0])
	#	menu = self.optionmenu_b['menu']
	#	menu.delete(0, 'end')
	#	for country in countries:
	#		menu.add_command(label=country, command=lambda nation=country: self.variable_b.set(nation))


if __name__ == "__main__":
	root = tk.Tk()
	app = App(root)
	app.mainloop()