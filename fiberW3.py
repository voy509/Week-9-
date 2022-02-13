print("Welcome to the Fiber Optic Costing Program")
company = input("Enter the company name.")
Feet = float(input("Enter amount of fiber optic needed in feet."))
#Week 3 additions-------------
if Feet >= 100 and Feet < 250:
    Total_Cost = Feet * 0.80
elif Feet >= 250 and Feet < 500:
    Total_Cost = Feet * 0.7
elif Feet >= 500:
    Total_Cost = Feet * 0.5
else:
    Total_Cost = Feet * 0.87
#W3---------------------------
print("It will cost",Total_Cost,"for",company,"to install the needed amount of fiber optic cable.")
