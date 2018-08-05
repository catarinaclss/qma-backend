var express = require('express');
var router = express.Router();
var {Student} = require('../model/Student');
var {Allocation} = require('../model/Allocation');


/* GET allocation time 

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

});*/


router.post('/checkTime', function(req, res, next) {

  console.log( req.body);
  if(!req.body.email || !req.body.dayOfWeek || !req.body.availableTime){
    res.status(400).json({success: false, message: 'Não foi possível capturar disponibilidade para este horário e dia. Preencha todos os campos'});
  }else{
      
      Allocation.findOne({email: req.body.email, dayOfWeek: req.body.dayOfWeek, availableTime: req.body.availableTime }, function(error, allocation){
      if(error){
        res.status(400).json({success: false, message: 'Não foi possível consultar este horário e dia'});
      }else{
        if(allocation){
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

  console.log(req.body);
  if(!req.body.email || !req.body.dayOfWeek || !req.body.availableTime){
    res.status(400).json({success: false, message: 'Não foi possível criar alocação para atendimento. Preencha todos os campos'});
  }else{
      
      Student.findOne({email: req.body.email, isTutor: true}, function(error, tutor){
      if(error){
        res.status(400).json({success: false, message: 'Não foi possível definir alocação para este usuário'});
      }else if(!tutor){
        res.status(400).json({success: false, message: 'Nenhum tutor cadastrado possui este email'});
      }else{
          console.log('aqui2');
          if(req.body.dayOfWeek % 6 === 0) return res.status(200).json({success: false, message: 'Não trabalhe no fim de semana!! Indique sua disponibilidade nos dias úteis da semana'});

          var newAllocation = new Allocation({
            email: req.body.email,
            dayOfWeek: req.body.dayOfWeek,
            availableTime: req.body.availableTime
          });

          console.log(newAllocation);

          newAllocation.save(function(error) {
          if(error){
            console.log(error);

            return res.status(500).json({ success: false, message: 'Não foi possível disponibilizar este horário e dia para atendimento'});
          }else{
            res.status(200).json({ success: true, message: 'Alocação criada com sucesso!' , response: newAllocation });
          }
        });
      }
    }); 
  }
});
  
module.exports = router;
