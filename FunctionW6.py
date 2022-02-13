def conversionfromMilestoKM(miles):
    Kilometers = miles * 1.60934
    return Kilometers

while True:
    try:
        miles = float(input('Enter nuumber of miles you would like converted: '))
        break
    except ValueError:
        print("This is not a valid input. Please enter a valid mile value.")
        
Kilometers = conversionfromMilestoKM(miles)
print( miles ,"miles is equal to",Kilometers,"kilometers.")