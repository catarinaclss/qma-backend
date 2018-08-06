var express = require('express');

var jwt = require('jsonwebtoken');
const config = require('../config/appConfig');
var {Student} = require('../model/Student');
var passport = require('passport');
var router = express.Router();

/**
 * Check if token is valid
 */
router.get('/verifytoken', (req, res, next) => {
  let token = req.headers['authorization'].split(' ')[1];
  jwt.verify(token, config.JWT_SECRET_KEY, (err, decode) => {
      if(!err){
          res.json({
              success: true,
              message: 'Token válido'
          });
      } else {
          res.status(401).json({
              success: false,
              error: err
          });
      }
  })
})

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
                    expiresIn: '60m'
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