var express = require('express');
var router = express.Router();
var {Student} = require('../model/Student');
var {Allocation} = require('../model/Allocation');
var {Assistance} = require('../model/Assistance');
var passport = require('passport');

router.post('/presential', function(req, res){
    Student.findOne({studentCode: {$ne: req.body.studentCode}, isTutor: true}, function(error, tutor){
        if(error || !tutor){
            res.status(500).json({success: false, message: 'Não foram encontrados tutores disponiveis'});
        }else{
            Allocation.find({email:tutor.email, local: req.body.local}, function(error, allocationForLocal){
                if(error || !allocationForLocal){
                    res.status(500).json({success: false, message: 'Não foram encontrados tutores que atendam no local de interesse'});
                }else{
                    Allocation.find( {email:tutor.email, dayOfWeek: req.body.dayOfWeek, availableTime: req.body.availableTime}, function(error, allocationForLocal){
                        if(error || !allocationForLocal){
                            res.status(500).json({success: false, message: 'Não foram encontrados tutores que atendam no local de interesse'});
                        }else{
                            if(tutor.tutorInfo.discipline === req.body.discipline && tutor.tutorInfo.proficiency > 3) {
                                var newAssistance = new Assistance({
                                    tutorCode: tutor.studentCode,
                                    studentCode: req.body.studentCode,
                                    discipline: req.body.discipline,
                                    dateAndLocal: {
                                        day: req.body.dayOfWeek,
                                        local: req.body.local,
                                        time: req.body.availableTime
                                    }
                                });
                                console.log("assistance teste" + newAssistance);

                                newAssistance.save(function(error){
                                    if(error){
                                        res.status(500).json({success: false, message: 'Não foi possivel encontrar um tutor'});

                                    }else{
                                        res.status(200).json({success: true, message: 'Você possui um tutor disponível', availableTutor: {name: tutor.name, contact: tutor.email}});
                                    }
                                })

                            }
                        }
                    });
                }
            });
        }
    });
});


module.exports = router;