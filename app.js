/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const bodyParser = require('body-parser');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');

const app = express();
const port = 3000;

// set parameteres to remove deprecation message
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// connect to local data base
mongoose.connect('mongodb://localhost:27017/yelp_camp');

app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

seedDB();

// PASSPORT CONFIGURATION
app.use(
  require('express-session')({
    secret: 'rusty is cute sausage',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// ROUTES

app.get('/', (req, res) => {
  res.render('landing');
});

// INDEX

app.get('/campgrounds', (req, res) => {
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

app.post('/campgrounds', (req, res) => {
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

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

// SHOW ROUTE - wazna jest kolejnosc tej sciezki. musi byc po scieze /campgrounds/new
app.get('/campgrounds/:id', (req, res) => {
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

// =======================================
// COMMENTS ROUTES
// =======================================

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

app.post('/campgrounds/:id/comments/', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, (err2, comment) => {
        if (err2) {
          console.log(err2);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

// AUTH ROUTES

// show register form
app.get('/register', (req, res) => {
  res.render('register');
});

// handle sign up logic
app.post('/register', (req, res) => {
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
app.get('/login', function(req, res) {
  res.render('login');
});

// handling login logic
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }),
  function(req, res) {}
);

// logout route
app.get('/logout', function(req, res) {
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

// START Server to listen for requests
app.listen(port, () => {
  console.log(`The YelpCamp Server has started and listen on port: ${port}`);
});
