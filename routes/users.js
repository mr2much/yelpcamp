const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/access', (req, res) => {
  res.render('users/access');
});

router.post(
  '/register',
  catchAsync(async (req, res) => {
    try {
      console.log('Hitting register route');
      const { user } = req.body;
      const { email, username, password } = user;

      const newUser = await new User({ email, username });

      const registeredUser = await User.register(newUser, password);

      req.flash('success', 'Welcome to Yelp Camp!');
      res.redirect('/campgrounds');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/access');
    }
  })
);

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/access',
  }),
  (req, res) => {
    console.log(req.body);
    console.log('Hitting login route');
    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');
  }
);

module.exports = router;
