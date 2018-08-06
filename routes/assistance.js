var express = require('express');
var router = express.Router();
var {Student} = require('../model/Student');
var {Allocation} = require('../model/Allocation');
var {Assistance} = require('../model/Assistance');
var passport = require('passport');

/**
 * Evaluate a tutor
 */
router.post('/tutor/evaluation', passport.authenticate('jwt', { session: false }), function(req, res){
    Assistance.findOne({_id: req.body._id}, function(error, assistance){
        if(error || !assistance){
            res.status(500).json({success: false, message: 'Nenhuma informação de pedido de ajuda foi encontrado'});
        }else{
            Student.findOne({studentCode: assistance.tutorCode}, function(error, tutor){
                if(error || !tutor){
                    res.status(500).json({success: false, message: 'Nenhuma informação do tutor foi encontrada'});
                }else{

                    var oldGrade = tutor.tutorInfo.evaluation;
                    var givenGrade = req.body.evaluation;
                    var newGrade = (oldGrade*5) + givenGrade;

                    tutor.tutorInfo.evaluation = Number((newGrade/6).toFixed(2));
                
                    tutor.save(function(error){
                        if(error){
                            res.status(500).json({success: false, message: 'Não foi possivel atualizar nota'});
                        }else{
                            res.status(200).json({success: false, message: 'Nota atualizada com sucesso'});
                        }
                    });
                }
            });
        }
    });
});

/**
 * Get assistance info
 */
router.post('/info', passport.authenticate('jwt', { session: false }), function(req, res){
    Assistance.findOne({_id: req.body._id}, function(error, assistance){
        if(error || !assistance){
            res.status(500).json({success: false, message: 'Nenhuma informação de pedido de ajuda foi encontrado'});
        }else{
            var assistanceType = "";
            var date = "";

            if(assistance.isOnline){
                res.status(200).json({
                    success: true, 
                    discipline: assistance.discipline,
                    type: "Atendimento será do tipo Online",
                    tutorCode: "Matricula do tutor: " + assistance.tutorCode});
            }else{
                res.status(200).json({
                    success: true, 
                    discipline: assistance.discipline,
                    type: "Atendimento será do tipo Presencial",
                    date: "Esta ajuda será realizada no " + assistance.local + " as " + assistance.time + "h",
                    tutorCode: "Matricula do tutor: " + assistance.tutorCode});
            }
        }
    });
});

/**
 * Create a request for online assistance
 */
router.post('/online', passport.authenticate('jwt', { session: false }), function(req, res){
    console.log(req.body);

    Student.findOne({studentCode: {$ne: req.body.studentCode}, isTutor: true}, function(error, tutor){
        if(error || !tutor){
            res.status(500).json({success: false, message: 'Não foram encontrados tutores disponiveis'});
        }else{
            console.log(tutor);
            if( tutor.tutorInfo.discipline === req.body.discipline && tutor.tutorInfo.proficiency > 3) {
                var newAssistance = new Assistance({
                    tutorCode: tutor.studentCode,
                    studentCode: req.body.studentCode,
                    discipline: req.body.discipline,
                    isOnline: true
                });
                console.log(newAssistance);
                newAssistance.save(function(error){
                    if(error){
                        res.status(500).json({success: false, message: 'Não foi possivel encontrar um tutor'});
                    }else{
                        res.status(200).json({success: true, message: 'Seu pedido de ajuda foi salvo e você possui um tutor disponível. ', availableTutor: {name: tutor.name, contact: tutor.email}});
                    }
                })

            }else{
                res.status(200).json({success: false, message: 'Nenhum tutor proficiente está disponível no momento '});

            }
        }
    });
                
});

/**
 * Create a request for presential assistance
 */
router.post('/presential', function(req, res){
    console.log(req.body);
    Student.findOne({studentCode: {$ne: req.body.studentCode}, isTutor: true}, function(error, tutor){
        if( !tutor || error){
            res.status(500).json({success: false, message: 'Não foram encontrados tutores disponiveis'});
        }else{
            Allocation.findOne({email:tutor.email, local: req.body.local}, function(error, allocationForLocal){
                if(error || !allocationForLocal){
                    res.status(500).json({success: false, message: 'Não foram encontrados tutores que atendam no local de interesse'});
                }else{
                    Allocation.findOne( {email:tutor.email, dayOfWeek: req.body.dayOfWeek, availableTime: req.body.availableTime}, function(error, allocationForLocal){
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
                                        res.status(200).json({success: true, message: 'Seu pedido de ajuda foi salvo e você possui um tutor disponível', availableTutor: {name: tutor.name, contact: tutor.email}});
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