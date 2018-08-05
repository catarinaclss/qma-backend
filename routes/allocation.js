var express = require('express');
var router = express.Router();
var {Student} = require('../model/Student');
var {Allocation} = require('../model/Allocation');

/* GET allocation time */
router.post('/checkLocal', function(req, res, next) {

  console.log( req.body);
  if(!req.body.email || !req.body.schedule.dayOfWeek || req.body.schedule.availableTime.length === 0){
    res.status(400).json({success: false, message: 'Não foi possível capturar disponibilidade para este horário e dia. Preencha todos os campos'});
  }else{
    Allocation.findOne({email: req.body.email, schedule:{dayOfWeek: req.body.schedule.dayOfWeek, availableTime: req.body.schedule.availableTime }}, function(error, isAvailable){
      if(error){
        res.status(400).json({success: false, message: 'Não foi possível consultar este horário e dia'});
      }else{
        if(isAvailable){
          res.status(200).json({ success: true, message: 'Dia e hora disponíveis para atendimento' });  
        }else{
          res.status(200).json({ success: false, message: 'Não existe disponibilidade neste dia e hora' });  
        } 
      }
    });
  }
  });

/* POST allocation local */
router.post('/local', function(req, res, next) {

  console.log( req.body);
  if(!req.body.email || !req.body.schedule.local){
    res.status(400).json({success: false, message: 'Não foi possível criar alocação para atendimento. Preencha todos os campos'});
  }else{
      
      Student.findOne({email: req.body.email, isTutor: true}, function(error, tutor){
      if(error){
        res.status(400).json({success: false, message: 'Não foi possível definir alocação para este usuário'});
      }else if(!tutor){
        res.status(400).json({success: false, message: 'Este tutor não está cadastrado no sistema'});
      }else{
        console.log('found tutor');
          Allocation.findOneAndUpdate({email: req.body.email}, {$set:{local: req.body.local}}, function(error, allocation){
            if (err) {
              return res.status(400).json({ success: false, message: 'Não foi possível definir cronograma de atendimento'});
            }else{
              res.status(200).json({ success: true, message: 'Alocação criada com sucesso!' , response: allocation });
            }
          }); 
        
      }
  });
  }

});

/* GET allocation time */
router.post('/checkTime', function(req, res, next) {

  console.log( req.body);
  if(!req.body.email || !req.body.schedule.dayOfWeek || req.body.schedule.availableTime.length === 0){
    res.status(400).json({success: false, message: 'Não foi possível capturar disponibilidade para este horário e dia. Preencha todos os campos'});
  }else{
      
      Allocation.findOne({email: req.body.email, schedule:{dayOfWeek: req.body.schedule.dayOfWeek, availableTime: req.body.schedule.availableTime }}, function(error, isAvailable){
      if(error){
        res.status(400).json({success: false, message: 'Não foi possível consultar este horário e dia'});
      }else{
        if(isAvailable){
          res.status(200).json({ success: true, message: 'Dia e hora disponíveis para atendimento' });  
        }else{
          res.status(200).json({ success: false, message: 'Não existe disponibilidade neste dia e hora' });  
        } 
      }
  });

}

});

/* POST allocation time */
router.post('/time', function(req, res, next) {

  console.log( req.body);
  if(!req.body.email || !req.body.schedule.dayOfWeek || !req.body.schedule.availableTime){
    res.status(400).json({success: false, message: 'Não foi possível criar alocação para atendimento. Preencha todos os campos'});
  }else{
      
      Student.findOne({email: req.body.email, isTutor: true}, function(error, tutor){
      if(error){
        res.status(400).json({success: false, message: 'Não foi possível definir alocação para este usuário'});
      }else if(!tutor){
        res.status(400).json({success: false, message: 'Nenhum tutor cadastrado possui este email'});
      }else{
        
          Allocation.findOne({email: req.body.email}, function(error, allocation){
            if (err) {
              return res.status(400).json({ success: false, message: 'Não foi possível cadastrar data e hora'});
            }else{
          
              res.status(200).json({ success: true, message: 'Alocação criada com sucesso!' , response: allocation });
            }
          }); 
        
      }
  });
  }

});

module.exports = router;
