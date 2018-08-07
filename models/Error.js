const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const errorSchema = new mongoose.Schema({
  title: String,
  message: String,
  err: String,
  date: Date
});


module.exports = mongoose.model("EError", errorSchema);
