var express = require('express');
var {Student} = require('../model/Student');
var router = express.Router();

/* GET users listing. */
router.get('/all', function(req, res, next) {
  console.log('teste');
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  if(!req.body.email || !req.body.password ||
    !req.body.name || !req.body.studentCode || !req.body.courseCode) {
    res.json({ success: false, message: 'Please fill in all required fields' });
  } else {

    var newStudent = new Student({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      studentCode: req.body.studentCode,
      courseCode: req.body.courseCode,
      phone: req.body.phone
    });

    newStudent.save(function(err) {
      if (err) {
        return res.json({ success: false, message: 'That email address already exists.'});
      }
      res.json({ success: true, message: 'Successfully created new student.' });
    });
  }
});


module.exports = router;
