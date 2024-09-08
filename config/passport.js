const passport = require('passport');
// new code below
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user'); 

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: '/api/auth/callback'
// }, (accessToken, refreshToken, profile, done) => {
//     User.findOne({ googleId: profile.id }).then((existingUser) => {
//         if (existingUser) {
//             done(null, existingUser);
//         } else {
//             new User({
//                 googleId: profile.id,
//                 username: profile.displayName,
//                 thumbnail: profile._json.picture
//             }).save().then((newUser) => {
//                 done(null, newUser);
//             });
//         }
//     });
// }));


passport.use(new GoogleStrategy(
    // Configuration object
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK
    },
    // The verify callback function...
    // Marking a function as an async function allows us
    // to consume promises using the await keyword
    async function(accessToken, refreshToken, profile, cb) {
      // A user has logged in with OAuth...
      // Instead of using promise.then with a callback,
      // we can use the await keyword followed by the promise.
      // When that promise is fulfilled, it will return
      // whatever the promise's resolved value is.
      let user = await User.findOne({ googleId: profile.id });
      // Existing user found, so provide it to passport
      if (user) return cb(null, user);
      // We have a new user via OAuth!
      // When using async/await to consume promises,
      // there is no use of .then or .catch, so we
      // use a try/catch block to handle an error
      try {
        user = await User.create({
          name: profile.displayName,
          googleId: profile.id,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value
        });
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  ));