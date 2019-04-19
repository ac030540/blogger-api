const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Blog = new Schema({
  title: {
    type: String,
  },
  intro: {
    type: String,
  },
  description: {
    type: String,
  }
});

module.exports = mongoose.model('Blog', Blog);