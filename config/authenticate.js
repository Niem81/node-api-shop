'use strict'

const passport = require ('passport')
const LocalStrategy = require('passport-local').Strategy

const models = require('../models')

const user = {
	'username': 'test-user',
	'password': 'test-pass',
	'id': 1
}

// passport need to serialize and deserialize user instance from a sesison store in order to support login sessions
// so that every subsequent request will not contain user credentials. Two methods:

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
	models.User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// passport.use(new LocalStrategy(
// 	function(username, password, done) {
// 		findUser(username, function(err, user) {
// 			if (err) { return done(err) }

// 			if (!user) { return done(null, false) }

// 			if (password !== user.password ) {
// 				return done(null, false)
// 			}

// 			return done(null, user)
// 		})
// 	}
// ))

// // other supporting functions

// function findUser (username, callback) {
//   if (username === user.username) {
//     return callback(null, user)
//   }
//   return callback(null)
// }
