const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const appSchema = new mongoose.Schema({
  appName: {
    type: String,
    trim: true,
    required: "Name must be present"
  },
  githubURL: {
    type: String,
    required: "github URL must be present"
  },
  localPath: {
    type: String,
    required: "Local path must be present"
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});
