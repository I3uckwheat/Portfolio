const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const slug = require("slugs");

const postSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: 'You must have a filename'
  },
  title: {
    type: String,
    required: 'Post must have a title'
  },
  slug: String,
  body: {
    type: String,
    required: "You must have HTML submitted"
  },
  created: {
    type: Date,
    default: Date.now
  },
  tags: [String]
});

postSchema.pre('save', function(next) {
  if(!this.isModified('title')) {
    next();
    return;
  }
  this.slug = slug(this.title);
  console.log('slug: ', this.slug);
  next();
});

module.exports = mongoose.model("Post", postSchema);
