const test = require('./algo.js');
const express = require('express')
const app = express();
const multer = require('multer');
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

//post methods 
app.post('/submitArabic', function (req, res, next) { 
  req.setEncoding('utf8')
  var dataStream = ''
  req.on( 'data', function( recv ) {
    dataStream += recv
  })
  req.on('end', function(){
    recvData = JSON.parse(dataStream)
    console.log(recvData.data)
    var arabic = encodeURI(recvData.data)
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
        var sending = JSON.stringify(build)
        res.status(201)
        res.json(sending)
      })
  })
})

app.post('/submit', upload.single('Img'), function (req, res) {  
  var filePath = req.file.path
  console.log(filePath)
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
        var sending = JSON.stringify(build)
        res.status(201)
        res.json(sending)
      })
  });
})

//starting the application - see README.md for details on how to start the program
app.listen(port, () => console.log(`App listening on port ${port}!`));