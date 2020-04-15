var express = require('express');
var app = express();
var http = require('http').Server(app);
var cors = require('cors')
app.use(cors());
var path = require('path');
const fs = require('fs');
const multer  = require('multer') //use multer to upload blob data
const upload = multer();

app.use(express.static(path.resolve('./public')));
var bodyParser = require('body-parser')
// app.use( bodyParser.json( {extended: true}) );       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// }));


app.use(bodyParser.json({
    extended : true
  }));
  
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
  }));


var cookieParser = require('cookie-parser');
app.use(cookieParser());


app.get('/', function (req, res) {

        res.sendFile(path.join(__dirname, 'index.html'));
  
})

app.post('/create', function (req, res) {
    let information = req.body;
    res.send("we got your data, proceed with audio")

})

app.post('/targetID', function (req, res) {
    let targetID = req.body
    console.log(targetID)
    res.send();
})

app.post('/upload', upload.single('soundBlob'), function (req, res, next) {
    // console.log(req.file); // see what got uploaded
  
    let uploadLocation = __dirname + '/public/uploads/' + req.file.originalname // where to save the file to. make sure the incoming name has a .wav extension
  
    fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer))); // write the blob to the server as a file
    res.sendStatus(200); //send back that everything went ok
  
  })


http.listen(3000, function(){
    console.log('listening on *:3000');
    });
    