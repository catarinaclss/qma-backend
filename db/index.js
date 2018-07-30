var config = require('../config/appConfig');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI || 
    'mongodb://localhost:27017/qmadb', {
    useNewUrlParser: true
    
});

module.exports = {
    mongoose
};