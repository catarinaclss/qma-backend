var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt; 
var {Student} = require('../model/Student');
var config = require('../config/appConfig');

module.exports = function(passport){
     var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');;
    opts.secretOrKey = config.JWT_SECRET_KEY;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

        Student.findOne({_id: jwt_payload._id}, (err, user) => {
            if(err){
                console.log(err);

                return done(err, false);
            }
        
            if(user){
                return done(null, user);
            } else {
                console.log("erro user");

                return done(null, false);
            }
            });
      }));
};