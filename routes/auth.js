var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const config = require('../config/appConfig');

/**
 * Receive email and password
 * Generates token
 */
router.post('/login', (req, res, next) => {
    const {email, password} = req.body.student;

    if(email === undefined || password === undefined){
        res.status(401).json({
            success: false,
            message: "Email and/or password invalid"
        });
    }else{
        //Payload: token data should get student information
        let tokenData = {
            id: 101
        }
        let generatedToken = jwt.sign(tokenData, config.JWT_SECRET_KEY, {expiresIn: "1m"});
        res.json({
            success: true,
            token: generatedToken
        });
    }

});

module.exports = router;