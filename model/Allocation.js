const mongoose = require('mongoose');

var AllocationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    local: {
        type: String
    },
    dayOfWeek: {
        type: Number
    },
    availableTime: {
        type: String
    }
    
});

var Allocation = mongoose.model('allocation', AllocationSchema);

module.exports = { Allocation }