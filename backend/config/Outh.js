const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require('dotenv').config();

const User = require('../db/userModel'); 

passport.use(new GoogleStrategy({
    clientID:    process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // Search for an existing user by Google ID
    User.findOne({ googleId: profile.id })
      .then((existingUser) => {
        if (existingUser) {
          // If a user is found, return the user object
          return done(null, existingUser);
        } else {
          // If no user is found, create a new user
          const newUser = new User({
            googleId: profile.id,
            email: profile.emails[0].value, // Assuming the user has an email
            // Add other fields as necessary
          });

          // Save the new user to the database
          newUser.save()
            .then((user) => {
              // Return the newly created user
              return done(null, user);
            })
            .catch((error) => {
              // Handle any errors that occur while saving the new user
              return done(error);
            });
        }
      })
      .catch((error) => {
        // Handle any errors that occur while searching for the user
        return done(error);
      });
 }
));

// function(request, accessToken,refreshToken, profile, done){
    

//     return done(null,profile);
// }
// ));


passport.serializeUser(function(user,done){
    
    done(null,user);

})

passport.deserializeUser(function(user,done){
    done(null,user);
})