# This is a header for the application
# You should read this header and insert your name and your date below as part of the peer review
# This is a typical part of any program
# Author: <author>
# Creation Date: <date>
# Below is a simple program with 10 issues (some are syntax errors and some are logic errors.  You need to identify the issues and correct them.

import random
import time

def displayIntro():
    #CORRECTION(10) Indented the first sentence of our intro to match format of rest of the intro.
    print('''    You are in a land full of dragons. In front of you,
    you see two caves. In one cave, the dragon is friendly
    and will share his treasure with you. The other dragon
    is greedy and hungry, and will eat you on sight.''')
    #CORRECTION(9) Removed unneccasary print() statement

def chooseCave():
    cave = ''
    while cave != '1' and cave != '2':
        print('Which cave will you go into? (1 or 2)')
        cave = input()

#CORRECTION(1) - Line 24 had to adjust caves to cave
    return cave

def checkCave(chosenCave):
    print('You approach the cave...')
    #sleep for 2 seconds
    time.sleep(2)
    print('It is dark and spooky...')
    #sleep for 2 seconds
    #CORRECTION(6) corrected time.sleep(3) to time.sleep(2)
    time.sleep(2)
    print('A large dragon jumps out in front of you! He opens his jaws and...')
    #CORRECTION(8) removed unneccasary print() statement
    #sleep for 2 seconds
    time.sleep(2)
    friendlyCave = random.randint(1, 2)

    if chosenCave == str(friendlyCave):
        print('Gives you his treasure!')
    else:
        #CORRECTION(3) print did not have both of its parenthesis around 'Gobbles you down in one bite!'
        print ('Gobbles you down in one bite!')

playAgain = 'yes'
#CORRECTION(4) had to add 2nd equal sign to while playagain statment for 'yes' and 'y'
while playAgain == 'yes' or playAgain == 'y':
    displayIntro()
    #CORRECTION(2) Line 47 had to change choosecave to chooseCave
    caveNumber = chooseCave()
    checkCave(caveNumber)
   
    print('Do you want to play again? (yes or no)')
    playAgain = input()
    #CORRECTION(7) added or playAgain == 'n' to be consistent with yes statement options above
    if playAgain == "no" or playAgain == 'n':
        #CORRECTION(5) changed 'Thanks for planing' to 'Thanks for playing'
        print("Thanks for playing")

