const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {type: String, required: true, minLength: 3, maxLength: 100},
  author: {type: String, required: true, minLength: 3, maxLength: 100},
  image: {type: String, required: false},
  song: {type: String, required: false},
  uploader: {type: String, required: true},
}, {
  timestamps: true,
});

const songModel = new mongoose.model("Song", songSchema);

module.exports = songModel;