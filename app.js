/* eslint-disable no-console */
"use strict";

const express = require("express");
const app = express();
const port = 80;

var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: true}));

let campgrounds = [
  {
    name: "Salmon Creek",
    image:
      "https://cdn.pixabay.com/photo/2017/06/17/03/17/gongga-snow-mountain-2411069__340.jpg"
  },
  {
    name: "Granite Hill",
    image:
      "https://cdn.pixabay.com/photo/2016/09/18/18/18/tent-camping-1678714__340.jpg"
  },
  {
    name: "Radawa",
    image:
      "https://cdn.pixabay.com/photo/2013/09/16/19/15/camp-182951__340.jpg"
  }
];

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
 

  res.render("campgrounds", { campgrounds: campgrounds });
});

app.post("/campgrounds", (req, res) => {
  //get data from form and add to campgrounds
  let name  = req.body.name;
  let image = req.body.image;
  let newCampground = {name: name, image: image}

  campgrounds.push(newCampground);
  //redirect back to campgrounds page
   res.redirect("/campgrounds");

   
});

app.get("/campgrounds/new", (req, res)=> {
  res.render("new");
});

app.listen(port, () => {
  console.log(`The YelpCamp Server has started and listen on port: ${port}`);
});
