

stocks = { "MSFT":310.9, "NEE":133.1, "VT":110, "AAPL":200, "GOOGL":110.9, "ENPH":233.1, "MJ":11, "DK":26.5, "COIN":42.3, "VOO":108.1 }

ticker = input("Enter a stock ticker :")
while True:
    if ticker in stocks:
        print("{} : {}".format(ticker, stocks[ticker]))

    else:
        print("{} can not be found".format(ticker))

    ticker = input("Enter a stock ticker :")

