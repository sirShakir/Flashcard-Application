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
      unique: [true, 'Usernames must be unique']
    },
    englishword: {
      type: String,
      required: [true, 'Please enter english version of word'],
    },
  });

//   Users.plugin(uniqueValidator);
//   Users.plugin(passportLocalMongoose);
  
  module.exports = mongoose.model('Cards', Cards);