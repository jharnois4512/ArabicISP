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
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')

//for logging http requests
app.use(morgan('combined'));
//for JSON reading
app.use(require('body-parser').urlencoded({ extended: true }));
//for removing all files in new
rimraf("new", function(){ console.log("removed the `new` folder"); mkdirp("new", function(){ console.log("made the `new` folder again")})})
console.log("making the 'new' folder again...")

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
  var check = 0
  fetch(urlSend).then(res => res.json()).then(data => {
    var roots = data.result.length
    if(roots){
      if(data.result[0].solution.root != ''){
        check = 1
      }
      else{
        check = 0
      }
    }
    if(check){
      data.result.forEach(element => {
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
      build = removeDuplicates(build)
      resolve(JSON.stringify({"build" : build, "buildMeaning" : buildMeaning}))
      }
      else{
        resolve(JSON.stringify({"build" : "", "buildMeaning" : ""}))
      }
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
        var meaning =  ""
        var adding = ""
        var el = dom.window.document.createElement("html")
        textDiv = dom.window.document.querySelector('#mw-content-text').textContent
        el.innerHTML = textDiv
        for(let line in el.innerHTML.split("\n")){
          if(el.innerHTML.split("\n")[line].charAt(el.innerHTML.split("\n")[line].length - 1) === ')' || el.innerHTML.split("\n")[line].indexOf('[') !== -1 &&  el.innerHTML.split("\n")[line].indexOf('edit') === -1){
            adding = adding + el.innerHTML.split("\n")[line] + "\n"
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
    var urlThird = "https://translate.yandex.net/api/v1/tr.json/translate?id=6e04381c.5fb014af.2b38c94b.74722d74657874-0-0&srv=tr-text&lang=ar-en&reason=paste&format=text"
    var thirdSending = new URLSearchParams({
      'text': encodeURI(word),
      'options': '4'
    })
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
    var rootMeaning = ""
    if(roots != []){
      console.log(search)
      console.log("here^^^^^")
      var search = Array.from(roots[0])
      rootMeaning = await getMeaningRoot(search)
    }
    var wordMeaning = await getMeaning(recvData.data)
    var sending = JSON.stringify({"root": root, "rootMeaning": rootMeaning, "wordMeaning": wordMeaning, "word": recvData.data})
    res.status(200)
    res.json(sending)
  })
})

app.post('/submitImage', upload.single('file'), function (req, res) {  
  var filePath = req.file.path
  console.log(filePath)
  var arabicWord = ""
  const pythonProcess = spawn('python',["ArabicImage.py", filePath]);
  pythonProcess.stdout.on('data', async (data) => {
    var recvString = data.toString()
    var returnStr = recvString.substr(0, recvString.indexOf('\n'))
    var returnSplit = returnStr.split(" ") 
    var returnLen = returnSplit.length - 1
    b = new Array(returnLen)
    for(var x = 0; x < returnLen; x++){
      b[x] = parseInt(returnSplit[x])
    }
    for(var a = 0; a < b.length; a++){
      arabicWord += String.fromCharCode(b[a])
    }
    console.log(arabicWord)
    var root = []
    root = await getRoot(arabicWord)
    var roots = JSON.parse(root).build
    var rootMeaning = ""
    if(roots != []){
      var search = Array.from(roots[0])
      rootMeaning = await getMeaningRoot(search)
      console.log(arabicWord)
    }
    var wordMeaning = await getMeaning(arabicWord)
    console.log(arabicWord)
    var sending = JSON.stringify({"root": root, "rootMeaning": rootMeaning, "wordMeaning": wordMeaning, "word": arabicWord})
    res.status(200)
    res.json(sending)
  });
})

//starting the app
app.listen(port, () => console.log(`App listening on port ${port}!`));

//testing
// تأكل -- breaks
// اختبار -- works
// رسم -- breaks
//