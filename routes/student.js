var express = require('express');
var {Student} = require('../model/Student');
var router = express.Router();
var validator = require('validator');


/**Get all students */
router.get('/all', function(req, res, next) {
  console.log('all users');
  Student.find(function(error, users){
      if(error){
        res.json({ success: false, message: 'Não foi possível recuperar alunos' });
      } else{
        res.json({
            success: true,
            students: users
        })
      }
  });
});

/* GET student by student code */
router.get('/:studentCode', function(req, res, next) {
  
  Student.findOne({studentCode: req.params.studentCode},function(error, user){
      if(!user){
        res.json({ success: false, message: 'Estudante não encontrado' });
      } else{
        res.json({
          success: true,
          student: user
        })
      }
  });
});

/* GET student by student code */
router.get('/info/:studentCode', function(req, res, next) {
  
  Student.findOne({studentCode: req.params.studentCode},function(error, user){
      if(!user){
        res.json({ success: false, message: 'Estudante não encontrado' });
      } else{
        res.json({
          success: true,
          userInfo:{
            email: user.email,
            name: user.name,
            phone: user.phone,
            studentCode: user.studentCode,
            courseCode: user.courseCode,
            role: user.role,
            evaluation: user.evaluation
          }
        })
      }
  });
});

/** Create new student */
router.post('/', function(req, res, next) {
  console.log(req.body);

  if(!req.body.email || !req.body.password ||
    !req.body.name || !req.body.studentCode || !req.body.courseCode) {

    res.json({ success: false, message: 'Por favor, preencha todos os campos obrigatórios' });
  }
  else if(!validator.isEmail(req.body.email)){
    res.json({ success: false, message: 'Por favor, insira um email válido' });
  }
  else {

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
        return res.json({ success: false, message: 'Este email e/ou matrícula já existe'});
      }
      res.json({ success: true, message: 'Estudante criado com sucesso!' });
    });
  }
});


module.exports = router;
