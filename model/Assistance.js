const mongoose = require('mongoose');

var AssistanceSchema = new mongoose.Schema({
    studentCode: {
        type: String,
        required: true
    },
    tutorCode: {
        type: String,
        required: true
    },
    discipline:{
        type: String,
        required: true
    },
    isOnline: {
        type: Boolean
    },
    dateAndLocal: {
        day: Number,
        time: String,
        local: String
    }    
});

var Assistance = mongoose.model('assistance', AssistanceSchema);

module.exports = { Assistance }