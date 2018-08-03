var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const config = require('../config/appConfig');
var {Student} = require('../model/Student');
var passport = require('passport');


router.get('/dashboard', passport.authenticate('jwt', { session: false }), function(req, res) {  
  res.send('It worked! User id is: ' + req.user._id + '.');
});

/**
 * Receive email and password 
 * Generates token if the password matched and no error was thrown
 */
router.post('/login', (req, res, next) => {

    Student.findOne({
        email: req.body.email
      }, function(err, user) {
        if (err) throw err;
    
        if (!user) {
          res.send({ success: false, message: 'Falha na autenticação! Usuário não encontrado' });
        } else {
          
          user.comparePasswords(req.body.password, function(err, isMatch) {
            if (isMatch && !err) {
              
                let generatedToken = jwt.sign(user.toJSON(), config.JWT_SECRET_KEY, {
                    expiresIn: '30m' // in seconds
                });
                res.json({ success: true, token: 'jwt ' + generatedToken });
            } else {
                res.send({ success: false, message: 'Falha na autenticação! Senha incorreta' });
            }
          });
        }
      });

});

module.exports = router;