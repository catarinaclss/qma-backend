const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');

var StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    studentCode: {
        type: String,
        require: true,
        unique: true
    },
    courseCode: {
        type: String,
        require: true
    },
    phone: {
        type: String
    },
    isTutor: {
        type: Boolean,
        default: false
    },
    evaluation:{
        type: Number,
        default: 5
    },
    tutorInfo: {
        discipline: {
            type: String,
            require: true
        },
        proficiency: {
            type: Number,
            require: true
        },
        evaluation: {
            type: Number,
            default: 5
        }
    }
});

/**
 * Save student's hashed password
 */
StudentSchema.pre('save', function (next) {
var student = this;

if (student.isModified('password') || student.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(student.password, salt, (err, hash) => {
            student.password = hash;
            next();
        });
    });
} else {
    next();
}
});

/**
 * Compare password input to password saved in database
 */
StudentSchema.methods.comparePasswords = function(password, callback ){
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) {
          return callback(err);
        }
        callback(null, isMatch);
      });
};


var Student = mongoose.model('student', StudentSchema);

module.exports = { Student }