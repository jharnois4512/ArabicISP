const test = require('./algo.js');
const express = require('express')
const app = express();
const multer = require('multer');
const jsdom = require("jsdom");
const fetch = require("node-fetch");
const dataStore = require("nedb");
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

//GET methods
/*views*/
app.get('/', function (req, res) {
  res.sendFile('views/index.html', { root: '.' })
})
app.get('/error', function (req, res) {
  res.sendFile('views/error.html', { root: '.' })
})
app.get('/arabic', function (req, res) {
  res.sendFile('views/arabic.html', { root: '.' })
})
app.get('/readme', function (req, res) {
  res.sendFile('README.md', { root: '.' })
})
/*CSS*/
app.get('/indexCSS', function (req, res) {
  res.sendFile('CSS/index.css', { root: '.' })
})
app.get('/arabicCSS', function (req, res) {
  res.sendFile('CSS/arabic.css', { root: '.' })
})
app.get('/errorCSS', function (req, res) {
  res.sendFile('CSS/error.css', { root: '.' })
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
app.get('/MoroccoGIF', function (req, res) {
  res.sendFile('resources/Morocco.gif', { root: '.' })
})
app.get('/circle', function (req, res) {
  res.sendFile('resources/wpiCircle.png', { root: '.' })
})

//helper methods for post routes
function removeDuplicates(array) {
  return array.filter((a, b) => array.indexOf(a) === b)
}

function getRoot(word){
  return new Promise(resolve => {
  var arabic = encodeURI(word)
  const urlStart = "http://www.aratools.com/dict-service?query={%22dictionary%22:%22AR-EN-WORD-DICTIONARY%22,%22word%22:%22"
  const urlEnd = "%22,%22dfilter%22:true}&format=json&_=1596542079034"
  var urlSend = urlStart + arabic + urlEnd
  console.log(urlSend)
  var REG_HEX = /&#x([a-fA-F0-9]+);/g;
  var build = []
  var buildMeaning = []
  var count = 0
  fetch(urlSend).then(res => res.json()).then(data => {
    var roots = data.result.length
    data.result.forEach(element => {
      console.log(element)
      var tmp = decodeURI(element.solution.root)
      var decoded = tmp.replace(REG_HEX, function(match, group1){
        var num = parseInt(group1, 16)
        buildMeaning[count] = decodeURI(element.solution.niceGloss)
        if(!build.includes(String.fromCharCode(num).substring(9))){
          build[count] = build[count] + String.fromCharCode(num)
        }
      })
      build[count] = build[count].substring(9)
      count = count + 1
    })
    console.log(buildMeaning)
    build = removeDuplicates(build)
    resolve(JSON.stringify({"build" : build, "buildMeaning" : buildMeaning}))
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
        var meaning, adding, otherWords = ""
        if(dom.window.document.querySelector("ol")){
          meaning = meaning + dom.window.document.querySelector("ol").textContent
          otherWords = dom.window.document.querySelectorAll("ul")
          console.log(otherWords[3].textContent)
          for(var i = 3; i < otherWords.length - 14; i++){
            adding = adding + otherWords[i].textContent
          }
        }
        console.log(adding)
        var jsonMeaning = JSON.stringify({"meaning": meaning, "words": adding})
        resolve(jsonMeaning)
      })
  })
}

function getMeaning(word){
  return new Promise(resolve => {
    var urlThird = "https://translate.yandex.net/api/v1/tr.json/translate?id=c4b81007.5f8f348c.b538835a.74722d74657874-1-0&srv=tr-text&lang=ar-en&reason=paste&format=text"
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
    var roots = JSON.parse(root).build
    console.log("ROOT--------- " + roots)
    var rootMeaning = ""
    console.log(search != [])
    if(search != []){
      try{
        var search = Array.from(roots[0])
        rootMeaning = await getMeaningRoot(search)
      }
      catch(e){
        console.log("no root meaning")
      }
    }
    console.log("ROOT MEANING--------- " + rootMeaning)
    var wordMeaning = await getMeaning(recvData.data)
    console.log("WORD MEANING--------- " + wordMeaning)
    var sending = JSON.stringify({"root": root, "rootMeaning": rootMeaning, "wordMeaning": wordMeaning, "word": recvData.data})
    res.status(200)
    res.json(sending)
  })
})

//TODO: Fix this method to include the helpers once error handled
app.post('/submit', upload.single('Img'), function (req, res) {  
  var filePath = req.file.path
  const pythonProcess = spawn('python',["ArabicImage.py", filePath]);
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

var errorUpload = multer({ dest: 'error/' })
var errStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'new')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var errorUpload = multer({ storage: errStorage })

app.post('/submitError', function (req, res) { 
  // var filePath = req.file.path
  // console.log(filePath)
  console.log("Inside")
})
app.post('/submitErrorTwo', function (req, res){
  console.log("works")
})

//starting the app
app.listen(port, () => console.log(`App listening on port ${port}!`));

//testing
// تأكل -- breaks
// اختبار -- works
// رسم -- breaks
//