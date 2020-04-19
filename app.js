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

// app.post('/create', function (req, res) {
//     let information = req.body;
//     console.log(information);
//     res.send("we got your data, proceed with audio")

// })

// app.post('/targetID', function (req, res) {
//     let targetID = req.body
//     console.log(targetID)
//     res.send();
// })

app.post('/uploadAudio', upload.single('soundBlob'), function (req, res, next) {
    // console.log(req.file); // see what got uploaded
  
    let uploadLocation = __dirname + '/public/uploads/' + req.file.originalname // where to save the file to. make sure the incoming name has a .wav extension
    //let uploadLocation = __dirname + '/public/uploads/' + req.file.originalname // where to save the file to. make sure the incoming name has a .wav extension


    fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer))); // write the blob to the server as a file
    res.sendStatus(200); //send back that everything went ok
  
  })


http.listen(3100, function(){
    console.log('listening on *:3100');
    });



    
//mongo api starts
const mongoose = require('mongoose');
var config = require('./config.dev');
mongoose.connect(config.mongodb, {useNewUrlParser: true});
var Cards = require('./models/cards');

app.post('/createCard', function(req, res){
  let information = req.body;

  Cards.create(new Cards({
    language: req.body.language,
    word: req.body.word,
    english: req.body.english,
    link: "no link for now",
    deck: req.body.deck
  }), function(err, cards){
    //console.log(information);

    if(err){
      console.log(" was a mongo error There\n " + err);

      return res.json({
        success:false, 
        error:err, 
        card:req.body
      });
    }
      //return res.json({success: true, cards: cards});
      return res.send(cards);
  });

});

app.post('/appendAudioLink', function(req, res){

  Cards.findOne({'_id': req.body.id}, function(err, card){
    if(err){
      return res.json({success: false, error: err});
    }
    if(card){
      let data = req.body;
      //if value was passed update it
      if(data.id){
          card.link = data.id;
      }
      
      card.save(function(err){
        if(err){
          return res.json({success: false, card: card})
        }else{      
          return res.json({success: true, card: card});
        }
      });  

    }

  });

});

app.post('/getStudyCards', function(req, res){
  let requestedDeckID = req.body.deckid
  let requestLanguage = req.body.lang;  
  if(requestedDeckID == "Deck" || requestedDeckID == "all" || requestedDeckID == "All" || requestedDeckID == null || requestedDeckID == "")
  {
    Cards.find({'language' : requestLanguage }, function(err, cards){

      if(err){
        return res.json({success: false, error: err});
      }
      return res.json({success: true, cards: cards});
  
  
    });
  }
  else{
    Cards.find({'deck': requestedDeckID , 'language' : requestLanguage}, function(err, cards){

      if(err){
        return res.json({success: false, error: err});
      }
      return res.json({success: true, cards: cards});


    });
  }
  
  




});
