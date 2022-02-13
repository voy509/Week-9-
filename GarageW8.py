class Vehicle:

    def __init__(self, make, model, color, fuelType, options):
        self.make = make
        self.model = model
        self.color = color
        self.fuelType = fuelType
        self.option = options

    def getMake(self):
        return self.make

    def getModel(self):
        return self.model

    def getColor(self):
        return self.color

    def getFueltype(self):
        return self.fueltype

    def getOptions(self):
        return self.options

    def __str__ (self):
        return f"Make: {self.make}, Model: {self.model}, Color: {self.color}, FuelType: {self.fuelType}, Options {self.option}"

class Car(Vehicle):

    def __init__ (self, make, model, color, fuelType, options, engineSize, numDoors):
        super().__init__(make, model, color, fuelType, options)
        self.engineSize = engineSize
        self.numDoors = numDoors

    def getEngineSize(self):
        return self.engineSize

    def getNumDoors(self):
        return self.numDoors
    
    def __str__(self):
        return "Car: "+super(Car,self).__str__()+", Engine Size "+str(self.engineSize) + ", NumDoors: " + str(self.numDoors)

class Pickup(Vehicle):

    def __init__(self, make, model, color, fuelType, options, cabStyle, bedLength):
        super().__init__(make, model, color, fuelType, options)
        self.cabStyle = cabStyle
        self.bedLength = bedLength
    
    def getCabStyle(self):
        return self.cabStyle
    
    def getBedLength(self):
        return self.bedLength

    def __str__(self):
        return "Pickup: " +super(Pickup, self).__str__()+", Cab Style " +str(self.cabStyle) + ", Bed Length: " +str(self.bedLength)

if __name__ == "__main__":
    garage = []
    Familycar = Car("Nissan", "Rouge", "Blue", "Unleaded", "Standard", "Six Cylinder", 4)
    Workcar = Car("Nissan", "Versa", "Silver", "Unleaded", "Standard", "Four Cylinder", 4)
    Campingcar = Car("Subaru", "Outback", "Green", "Unleaded", "Premium", "Six Cylinder", 4)

    Familytruck = Pickup("Chevy", "Silverado", "Grey", "Unleaded", "Standard", "Extended", 20)
    Worktruck = Pickup("Ford", "F-150", "Black", "Unleaded", "Basic", "Short", 23)
    Dieseltruck = Pickup("Ford", "F-350", "White", "Diesel", "Standard", "Extended", 21)

    garage = [Familycar, Worktruck, Familytruck, Workcar]

    for Vehicle in garage:
        print(Vehicle)

