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
  if(!this.isModified('title')) {
    next();
    return;
  }
  this.slug = slug(this.title);
  console.log(this.slug);
  next();
})

module.exports = mongoose.model("Post", postSchema);
