const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require("slugs");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: "You must enter a post title"
  },
  slug: String,
  body: {
    type: String,
    trim: true,
    required: "You must enter a post body"
  },
  author: {
    type: String,
    required: true,
    default: "Briggs Elsperger"
  },
  created: {
    type: Date,
    default: Date.now
  },
  tags: [String],
})

postSchema.pre('save', function(next) {
  if(!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slug(this.name);
  next();
})

module.exports = mongoose.model("Post", postSchema);
