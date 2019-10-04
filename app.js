/* eslint-disable no-console */
"use strict";

const express = require("express");
const app = express();
const port = 3000;


// Add mongoose.js module
const mongoose = require("mongoose");

//set parameteres to remove deprecation message
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//connect to local data base
mongoose.connect("mongodb://localhost:27017/yelp_camp");

var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static('public'))

app.use(bodyParser.urlencoded({
  extended: true
}));

// Schema setup

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

// compile schema in to model with methods
var Campground = mongoose.model("Campground", campgroundSchema);

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {

  //get all campgrounds from database

  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        campgrounds: allCampgrounds
      });
    }
  });
});

app.post("/campgrounds", (req, res) => {
  //get data from form and add to campgrounds
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let newCampground = {
    name: name,
    image: image,
    description: description
  }

  //Create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      //redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

//wazna jest kolejnosc tej sciezki. musi byc po scieze /campgrounds/new
app.get("/campgrounds/:id", (req, res) => {
  let id = req.params.id
  Campground.findById(id, function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render("show", {
        campground: foundCampground
      });
    }
  });
});

app.listen(port, () => {
  console.log(`The YelpCamp Server has started and listen on port: ${port}`);
});