/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');

// const Campground = require('./models/campground');
// const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');

const commentRoutes = require('./routes/comments');
const campgroudRoutes = require('./routes/campgrouds');
const indexRoutes = require('./routes/index');

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
app.use(methodOverride('_method'));
app.use(flash());

// seedDB(); // seed the database

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

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroudRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// START Server to listen for requests
app.listen(port, () => {
  console.log(`The YelpCamp Server has started and listen on port: ${port}`);
});
