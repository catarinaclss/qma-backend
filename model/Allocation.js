const mongoose = require('mongoose');

var AllocationSchema = new mongoose.Schema({
    tutorCode: {
        type: String,
        required: true
    },
    locals: {
        type: [],
        required: true
    },
    schedule:{
        dayOfWeek: {
            type: String,
            enum: ['seg', 'ter', 'qua', 'qui', 'sex']
        },
        availableTimes: {
            type: []
        },
        type: []
    }
});

var Allocation = mongoose.model('allocation', AllocationSchema);

module.exports = { Allocation }