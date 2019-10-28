const Campground = require('../models/campground');
const Comment = require('../models/comment');

// all the middleware goes here
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  // is user logged in
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash('error', 'Campground not found');
        res.redirect('back');
      } else {
        // does user own campground?
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that!");
          res.redirect('back');
        }
      }
    });
  } else {
    // if not redirrect
    req.flash('error', 'You need to be logged in first!');
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  // is user logged in
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash('error', 'That comment does not exist!');
        res.redirect('back');
      }
      // does user own comment?
      if (foundComment.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash('error', "You don't have permission to do that!");
        res.redirect('back');
      }
    });
  } else {
    // if not redirrect
    req.flash('error', 'You need to be logged in first!');
    res.redirect('back');
  }
};

// middleware
middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in first!');
  res.redirect('/login');
};

module.exports = middlewareObj;
