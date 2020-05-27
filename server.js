const test = require('./algo.js');
const express = require('express')
const app = express();
const multer = require('multer');
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
  res.sendFile('views/index.html', { root: '.' })
})
app.get('/arabic', function (req, res) {
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
    var algoReturn= test.algo(recvData.data)
    console.log(algoReturn)
  })
})

app.post('/submit', upload.single('Img'), function (req, res) {  
  var filePath = req.file.path
  console.log(filePath)
  const pythonProcess = spawn('python3',["ArabicImage.py", filePath]);
  pythonProcess.stdout.on('data', (data) => {
    var recvString = data.toString()
    console.log(recvString.substr(0, recvString.indexOf('\n')))
    var algoReturn = test.algo(recvString.substr(0, recvString.indexOf('\n')))
    console.log(algoReturn)
  });
})

//starting the application (see README.md for details on how to start the program)
app.listen(port, () => console.log(`App listening on port ${port}!`));