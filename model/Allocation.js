const mongoose = require('mongoose');

var AllocationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    local: {
        type: [],
        required: true
    },
    
    dayOfWeek: {
        type: String,
        enum: ['seg', 'ter', 'qua', 'qui', 'sex'],
        required: true
    },
    availableTime: {
        type: [],
        required: true
    }
    
});

var Allocation = mongoose.model('allocation', AllocationSchema);

module.exports = { Allocation }