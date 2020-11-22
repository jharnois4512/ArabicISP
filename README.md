# Arabic root system application Documentation

## Project members

## How to start
To start the server, you will need to run the two following commands:
```npm install```
```npm start```
This should start running your NodeJS server on port 7000.

## User guide 


## Updating the Yandex API -
There are a few things that need to be done to update the Yandexi API. It does expire after a specifc amount
of time. To accomplish this, follow these steps:

1. Visit [Yandex Translate](https://translate.yandex.com)
2. Open up the development tools by either right clicking and clicking "inspect element" or hitting F12
3. Navigate to the `Network` tab at the top
4. Change the language you are translating to to be Arabic
5. Start typing anything to be translated
6. In your logs, there will be three requests labeled as ```translate.yandex.net```choose the one that contains ```translate?id=``` in the name/file section of the tab
7. Copy all of the contents between ```id=``` and ```&srv=```
8. Paste the new ID on line of 180 of ```server.js``` where the old ID was


## Errors
Any errors that you find with the program please contact:
Jeffrey Harnois - (jharnois@wpi.edu) or professor (Mohammed El Hamzaoui) - melhamzaoui@wpi.edu





