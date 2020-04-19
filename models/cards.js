var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Create a schema
var Cards = new Schema({
    language: {
      type: String,
      required: [true, 'Please enter an language'],
    },
    word: {
      type: String,
      required: [true, 'Please enter a word'],
      //unique: [true, 'Usernames must be unique']
    },
    english: {
      type: String,
      required: [true, 'Please enter english version of word'],
    },
    link:{
      type:String,
      required: [false]
    },
    deck:{
      type:String
    }
  });
  
  module.exports = mongoose.model('Cards', Cards);
  