var express = require('express');
var router = express.Router();
var {Student} = require('../model/Student');
var {Allocation} = require('../model/Allocation');


/* GET home page. */
router.post('/', function(req, res, next) {

  console.log( req.body);
  if(!req.body.tutorCode || !req.body.locals.length === 0 || !req.body.schedule.dayOfWeek || !req.body.schedule.availableTimes.lenght === 0){
    res.status(400).json({success: false, message: 'Não foi possível criar alocação para atendimento. Preencha todos os campos'});
  }else{
      console.log( 'aqui');
      Student.findOne({studentCode: req.body.tutorCode, isTutor: true}, function(error, tutor){
      if(error){
        res.status(400).json({success: false, message: 'Não foi possível definir alocação para este usuário'});
      }else if(!tutor){
        res.status(400).json({success: false, message: 'Este tutor não está cadastrado no sistema'});
      }else{

        if(req.body.locals.length === 0){
          res.status(400).json({success: false, message: 'Insira pelo menos um local de atendimento'});
        }else if (req.body.schedule.availableTimes.length === 0){
          res.status(400).json({success: false, message: 'Insira pelo menos um horário disponível realizar atendimento'});
        }else{
              var newAllocation = new Allocation({
                tutorCode: req.body.tutorCode,
                locals: req.body.locals,
                schedule: {
                  dayOfWeek: req.body.schedule.dayOfWeek,
                  availableTimes: req.body.schedule.availableTimes
                }
            });
        
            newAllocation.save(function(err) {
              if (err) {
                return res.status(400).json({ success: false, message: 'Não foi possível definir cronograma de atendimento'});
              }else{
                res.status(200).json({ success: true, message: 'Alocação criada com sucesso!' });
              }
            });
        }
      }
  });
  }

});

module.exports = router;
