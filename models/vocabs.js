router.put('/', function(req, res){

  Cards.findOne({'slug': req.body.slug}, function(err, card){
    if(err){
      return res.json({success: false, error: err});
    }
    if(card){
      let data = req.body;
      //if value was passed update it
      if(data.title){
          card.title = data.title;
      }
      //skip if statment for slug, created, published
      if(data.keywords){
          card.keywords = data.keywords;
      }
      if(data.description){
          card.description = data.description;
      }
      if(data.body){
          card.body = data.body;
      }
      if(data.published){
        card.published = data.published;
    }
      if(data.modified){
          card.modified = Date.now;
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