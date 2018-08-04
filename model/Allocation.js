const mongoose = require('mongoose');

var AllocationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    local: {
        type: String,
        required: true
    },
    schedule:{
        dayOfWeek: {
            type: String,
            enum: ['seg', 'ter', 'qua', 'qui', 'sex']
        },
        availableTime: {
            type: String
        }
    }
});

var Allocation = mongoose.model('allocation', AllocationSchema);

module.exports = { Allocation }