import os

def main():
    directory = input("Enter the directory you'd like the file to be saved in ")
    filename = input("What is the filename?")
    name = input("What is your name?")
    address = input("Enter your address ")
    phone_number = input("What is your phone number?")

    if os.path.isdir(directory):
        writeFile = open(os.path.join(directory,filename),"w")
        writeFile.write(name+","+address+","+phone_number+"\n")
        writeFile.close()
        print("File contents - ")
        readFile = open(os.path.join(directory,filename),"r")
        for line in readFile:
            print(line)
        readFile.close()
    else:
        print("That directory does not exist.")
main()

    