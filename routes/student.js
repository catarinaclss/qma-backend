var express = require('express');
var {Student} = require('../model/Student');
var router = express.Router();
var validator = require('validator');
var passport = require('passport');

function SortByName(x,y) {
  return ((x.name == y.name) ? 0 : ((x.name > y.name) ? 1 : -1 ));
}

router.get('/tutor/:studentCode', passport.authenticate('jwt', { session: false }), function(req, res){
  Student.findOne({studentCode: req.params.studentCode, isTutor: true}, function(error, user){
    if(error){
      res.status(500).json({success: false, message: 'Não foi possível retornar tutor'});
    }else if(!user){
      res.status(204).json({success: false, message: 'Este usuário não é um tutor'});

    }else{
      res.status(200).json({
        success: true,
        tutor: user
      });
    }
  });
});

router.get('/tutor/all', passport.authenticate('jwt', { session: false }), function(req, res, next){
  Student.find({isTutor: true}, function(error, listTutors){
    if(error){
      res.status(500).json({ success: false, message: 'Não foi possível retornar tutores'});
    }else if(listTutors.length === 0){
      res.status(200).json({ success: false, message: 'Não existem tutores'});
    }else{
      res.status(200).json({
        success: true,
        tutors: listTutors 
      })
    }
  });
});
  

router.post('/new/tutor', passport.authenticate('jwt', { session: false }), function(req, res, next){
  console.log( req.body.studentCode);

  Student.findOneAndUpdate({studentCode: req.body.studentCode}, 
    {$set: {isTutor: true, tutorInfo:{discipline: req.body.discipline, proficiency: req.body.proficiency}}} , function(error, user){
      
      if(!user || error){
        console.log( error);

        res.status(400).json({ success: false, message: 'Não foi possível efetuar ação'});
      } else {
          res.status(200).json({
          success: true,
          message: 'Usuário ' + user.name + ' virou tutor',
          discipline: req.body.discipline
        });
      }
  });

});

/**Get all students */
router.get('/all', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  console.log('all users');
  Student.find(function(error, users){
      if(!users || error){
        res.status(500).json({ success: false, message: 'Não foi possível recuperar alunos' });
      } else{
        res.json({
            success: true,
            students: users.sort(SortByName)
        })
      }
  });
});

/* GET student by student code */
router.get('/:studentCode', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  
  Student.findOne({studentCode: req.params.studentCode},function(error, user){
      if(!user || error){
        res.status(500).json({ success: false, message: 'Não foi possível recuperar estudante' });
      } else{
        res.status(200).json({
          success: true,
          student: user
        })
      }
  });
});

/* GET student by student code */
router.get('/info/:studentCode', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  
  Student.findOne({studentCode: req.params.studentCode},function(error, user){
      if(!user || error){
        res.status(500).json({ success: false, message: 'Não foi possivel retornar estudante' });
      } else{
        res.status(200).json({
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

    res.status(400).json({ success: false, message: 'Por favor, preencha todos os campos obrigatórios' });
  }
  else if(!validator.isEmail(req.body.email)){
    res.status(400).json({ success: false, message: 'Por favor, insira um email válido' });
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
        return res.status(400).json({ success: false, message: 'Este email e/ou matrícula já existe'});
      }
      res.status(200).json({ success: true, message: 'Estudante criado com sucesso!' });
    });
  }
});


module.exports = router;
