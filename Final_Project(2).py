import json, requests

APPID = 'faf2f799f458e0db841b0d714205d189'

#setup of the url when user gives the zipcode
def get_forecasturl_zipcode(zipcode):
    url = 'http://api.openweathermap.org/data/2.5/forecast?zip=%s&appid=%s' % (zipcode, APPID) 
    return  url

#setup of the url when user gives the city
def get_forecasturl_city(city):
    url = 'http://api.openweathermap.org/data/2.5/forecast?q=%s&appid=%s' % (city, APPID)
    return url 

def main():


    while (True):


        user_input = input('Enter zip code or city: ')


        if user_input.isdecimal():
            url = get_forecasturl_zipcode(user_input)
        else :
            url = get_forecasturl_city(user_input)
        
        response = requests.get(url)


        #including the try block
        try:
            response.raise_for_status()
            print('Connection successful')
        except:
            print('Connection failed')
            continue 

        weather = json.loads(response.text)['list']
         
        print('Weather today is ' + weather[0]['weather'][0]['main'])
        print('Weather tomorrow is ' + weather[1]['weather'][0]['main'])
        

if __name__ == "__main__":
    main()