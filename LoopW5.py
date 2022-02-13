#Need to set up the inputs for the user to enter
Interest_rate = float(input("What is the yearly interest rate?"))
Initial_investment = float(input("How much is the initial investment?"))
#set the starting balance equal to the initial investment and then also start at year 0 in the loop
Balance = Initial_investment
year = 0
#Each time the loop runs, it will add 1 to the year. The Loop continues until the Balance is greater than 2*Initial Investment
while Balance< 2*Initial_investment:
    Balance = Balance + (Balance*(Interest_rate/100))
    year+=1

print("It will take",year,"years to double your investment at the current interest rate.")
