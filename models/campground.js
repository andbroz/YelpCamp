// Model file for Campground

const mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// compile schema in to model with methods and export from module
module.exports = mongoose.model("Campground", campgroundSchema);