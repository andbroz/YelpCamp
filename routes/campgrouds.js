/* eslint-disable no-console */
const express = require('express');
const Campground = require('../models/campground');

const router = express.Router();

// INDEX
router.get('/', (req, res) => {
  // get all campgrounds from database

  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {
        campgrounds: allCampgrounds,
      });
    }
  });
});

// crate campgroud
router.post('/', (req, res) => {
  // get data from form and add to campgrounds
  const { name } = req.body;
  const { image } = req.body;
  const { description } = req.body;
  const newCampground = {
    name,
    image,
    description,
  };

  // Create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err, newlyCreated);
    } else {
      // redirect back to campgrounds page
      res.redirect('/campgrounds');
    }
  });
});
// new campgroud form
router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

// SHOW ROUTE - wazna jest kolejnosc tej sciezki. musi byc po scieze /campgrounds/new
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Campground.findById(id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/show', {
          campground: foundCampground,
        });
      }
    });
});

module.exports = router;
