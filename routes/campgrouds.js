/* eslint-disable no-console */
const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware/'); // automatycznie dodaje index.js, który jest specjalna nazwa dla require
const router = express.Router();

// =======================================
// CAMPGROUNDS ROUTES
// =======================================

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
router.post('/', middleware.isLoggedIn, (req, res) => {
  // get data from form and add to campgrounds
  const { name } = req.body;
  const { image } = req.body;
  const { description } = req.body;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const newCampground = {
    name,
    image,
    description,
    author,
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
router.get('/new', middleware.isLoggedIn, (req, res) => {
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

// EDIT campgroud route

router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render('campgrounds/edit', { campground: foundCampground });
  });
});

// UPDATE campgroud route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  // find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
  // redirect to show page
});

// DESTROY Campgroud route
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
    if (err) {
      console.log(err);
    } // remove comments for removed campground
    Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, err => {
      if (err) {
        console.log(err);
      }
      res.redirect('/campgrounds');
    });
  });
});

module.exports = router;
