var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const config = require('../config/appConfig');
var {Student} = require('../model/Student');
var passport = require('passport');


router.get('/dashboard', passport.authenticate('jwt', { session: false }), function(req, res) {  
    res.send('It worked! User id is: ' + req.user._id + '.');
  });

/* GET users listing. */
router.get('/test', function(req, res, next) {
    console.log('teste');
    res.send('respond with a resource');
  });

/**
 * Receive email and password
 * Generates token
 */
router.post('/login', (req, res, next) => {
    console.log('testando');
  //  res.send('respond with a resource');
   // const {email, password} = req.body.student;

    Student.findOne({
        email: req.body.email
      }, function(err, user) {
        if (err) throw err;
    
        if (!user) {
          res.send({ success: false, message: 'Authentication failed. User not found.' });
        } else {
          // Check if password matches
          console.log(req.body.password);
          user.comparePasswords(req.body.password, function(err, isMatch) {
            if (isMatch && !err) {
                console.log(user.email);
                // Create token if the password matched and no error was thrown
                let generatedToken = jwt.sign(user.toJSON(), config.JWT_SECRET_KEY, {
                    expiresIn: 86400000 // in seconds
                });
                res.json({ success: true, token: 'jwt ' + generatedToken });
            } else {
                res.send({ success: false, message: 'Authentication failed. Passwords is wrong.' });
            }
          });
        }
      });

});

module.exports = router;