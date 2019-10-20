/* eslint-disable no-console */
/* eslint-disable func-names */
const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

//  ROOT ROUTE

router.get('/', (req, res) => {
  res.render('landing');
});

// AUTH ROUTES

// show register form
router.get('/register', (req, res) => {
  res.render('register');
});

// handle sign up logic
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/campgrounds');
    });
  });
});

// show login form
router.get('/login', function(req, res) {
  res.render('login');
});

// handling login logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }),
  function(req, res) {}
);

// logout route
router.get('/logout', function(req, res) {
  req.logOut();
  res.redirect('/campgrounds');
});

// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
