const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middlewares');
const passport = require('passport');

router.get('/access', (req, res) => {
  res.render('users/access');
});

router.post(
  '/register',
  catchAsync(async (req, res, next) => {
    try {
      const { user } = req.body;
      const { email, username, password } = user;

      const newUser = new User({ email, username });

      const registeredUser = await User.register(newUser, password);

      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
      });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/access');
    }
  })
);

router.post(
  '/login',
  storeReturnTo,
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/access',
  }),
  (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';

    delete res.locals.returnTo;

    res.redirect(redirectUrl);
  }
);

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
  });
});

module.exports = router;
