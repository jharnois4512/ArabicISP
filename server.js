const test = require('./algo.js');
const express = require('express')
const app = express();
const multer = require('multer');
const jsdom = require("jsdom");
const fetch = require("node-fetch");
const port = 7000
const spawn = require("child_process").spawn;
const morgan = require('morgan')

//for logging http requests
app.use(morgan('combined'));
//for JSON reading
app.use(require('body-parser').urlencoded({ extended: true }));


// storing new files from the picture with unique names
var upload = multer({ dest: 'new/' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'new')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var upload = multer({ storage: storage })

//sending files with get methods
/*views*/
app.get('/', function (req, res) {
  res.sendFile('views/Arabic.html', { root: '.' })
})
app.get('/error', function (req, res) {
  res.sendFile('views/error.html', { root: '.' })
})
/*js files*/
app.get('/api', function (req, res) {
  res.sendFile('yamli.js', { root: '.' })
})
app.get('/indexCtrl', function (req, res) {
  res.sendFile('controllers/index.js', { root: '.' })
})
app.get('/dat', function (req, res) {
  res.sendFile('dat.js', { root: '.' })
})
/*resources*/
app.get('/back', function (req, res) {
  res.sendFile('resources/back.gif', { root: '.' })
})
app.get('/wpi', function (req, res) {
  res.sendFile('resources/WPITrans.png', { root: '.' })
})
app.get('/favicon.ico', function (req, res) {
  res.sendFile('resources/Morocco.ico', { root: '.' })
})

//helper methods for post routes

function removeDuplicates(array) {
  return array.filter((a, b) => array.indexOf(a) === b)
}

//TODO: handle errors with methods
function getRoot(word){
  return new Promise(resolve => {
  var arabic = encodeURI(word)
  const urlStart = "http://www.aratools.com/dict-service?query={%22dictionary%22:%22AR-EN-WORD-DICTIONARY%22,%22word%22:%22"
  const urlEnd = "%22,%22dfilter%22:true}&format=json&_=1596542079034"
  var urlSend = urlStart + arabic + urlEnd
  console.log(urlSend)
  var REG_HEX = /&#x([a-fA-F0-9]+);/g;
  var build = []
  var count = 0
  fetch(urlSend).then(res => res.json()).then(data => {
    var roots = data.result.length
    data.result.forEach(element => {
      var tmp = decodeURI(element.solution.root)
      var decoded = tmp.replace(REG_HEX, function(match, group1){
        var num = parseInt(group1, 16)
        if(!build.includes(String.fromCharCode(num).substring(9))){
          build[count] = build[count] + String.fromCharCode(num)
        }
      })
      build[count] = build[count].substring(9)
      count = count + 1
    })
    build = removeDuplicates(build)
    resolve(build)
  })
})
}
function getMeaningRoot(word){
  return new Promise(resolve => {
    var newStart = "https://en.wiktionary.org/wiki/"
    var newEnd = "#Arabic"
    var newArabic = ""
    for(var i = 0; i < word.length; i++){
      word[i] = encodeURI(word[i])
    }
    for(var j = 0; j < word.length; j++){
        if(j !== word.length -1){
        newArabic = newArabic + word[j] + "_"
        }
        else{
        newArabic = newArabic + word[j]
        }
    }
    var newURL = newStart + newArabic + newEnd
    console.log(newURL)
    fetch(newURL, {
      method: 'GET',
      headers: {
        'Content-Type' : 'application/json'
      }
    }).then(data => {
        return data.text()
      }).then(function (html){
        var dom = new jsdom.JSDOM(html)
        var meaning = dom.window.document.querySelector("ol").textContent
        var adding = ""
        var otherWords = dom.window.document.querySelectorAll("ul")
        console.log(otherWords[3].textContent)
        for(var i = 3; i < otherWords.length - 14; i++){
          adding = adding + otherWords[i].textContent
        }
        console.log(adding)
        var jsonMeaning = JSON.stringify({"meaning": meaning, "words": adding})
        resolve(jsonMeaning)
      })
  })
}

function getMeaning(word){
  return new Promise(resolve => {
    var urlThird = "https://translate.yandex.net/api/v1/tr.json/translate?id=8a6c556d.5f2c6434.0a1ac5af.2d-0-0&srv=tr-text&lang=ar-en&reason=paste&format=text"
    var thirdSending = new URLSearchParams({
      'text': encodeURI(word),
      'options': '4'
    })
    console.log(urlThird)
    fetch(urlThird, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      body: "text=" + encodeURI(word)
    }).then(data => {
      return data.text()
    }).then( function(inside) {
      resolve(inside)
    })
  })
}

//post methods 
app.post('/submitArabic', function (req, res, next) { 
  req.setEncoding('utf8')
  var dataStream = ''
  req.on( 'data', function( recv ) {
    dataStream += recv
  })
  req.on('end', async function(){
    recvData = JSON.parse(dataStream)
    var root = []
    root = await getRoot(recvData.data)
    try{
      var search = Array.from(root[0])
    }
    catch(e){
      console.log(e)
      var search = []
    }
    var rootMeaning = await getMeaningRoot(search)
    var wordMeaning = await getMeaning(recvData.data)
    var sending = JSON.stringify({"root": root, "rootMeaning": rootMeaning, "wordMeaning": wordMeaning, "word": recvData.data})
    res.status(200)
    res.json(sending)
  })
})

//TODO: Fix this method to include the helpers
app.post('/submit', upload.single('Img'), function (req, res) {  
  var filePath = req.file.path
  const pythonProcess = spawn('python3',["ArabicImage.py", filePath]);
  pythonProcess.stdout.on('data', (data) => {
    var recvString = data.toString()
    console.log(recvString.substr(0, recvString.indexOf('\n')))
    var arabic = "" 
    arabic = recvString.substr(0, recvString.indexOf('\n'))
    arabic = encodeURI(arabic)
    const urlStart = "http://www.aratools.com/dict-service?query={%22dictionary%22:%22AR-EN-WORD-DICTIONARY%22,%22word%22:%22"
    const urlEnd = "%22,%22dfilter%22:true}&format=json&_=1596542079034"
    var url = urlStart + arabic + urlEnd
    var REG_HEX = /&#x([a-fA-F0-9]+);/g;
    var build = []
    var count = 0
    fetch(url)
      .then(res => res.json()).then(data => {
        var roots = data.result.length
        data.result.forEach(element => {
          var tmp = decodeURI(element.solution.root)
          var decoded = tmp.replace(REG_HEX, function(match, group1){
            var num = parseInt(group1, 16)
            build[count] = build[count] + String.fromCharCode(num)
          })
          build[count] = build[count].substring(9)
          count = count + 1
        })
        console.log(build)
        var search = Array.from(build[0])
        var newStart = "https://en.wiktionary.org/wiki/"
        var newEnd = "#Arabic"
        var newArabic = ""
        for(var i = 0; i < search.length; i++){
          search[i] = encodeURI(search[i])
        }
        for(var j = 0; j < search.length; j++){
           if(j !== search.length -1){
            newArabic = newArabic + search[j] + "_"
           }
           else{
            newArabic = newArabic + search[j]
           }
        }
        var newURL = newStart + newArabic + newEnd
        console.log(newURL)
        fetch(newURL, {
          method: 'GET',
          headers: {
            'Content-Type' : 'application/json'
          }
        })
          .then(data => {
            return data.text()
          }).then(function (html){
            var dom = new jsdom.JSDOM(html)
            var meaning = dom.window.document.querySelector("ol").textContent
            var sending = JSON.stringify({"meaning": meaning, "roots": build, "word": recvData.data})
            res.status(201)
            res.json(sending)
          })
      })
  });
})

//starting the application - see README.md for details on how to start the program
app.listen(port, () => console.log(`App listening on port ${port}!`));