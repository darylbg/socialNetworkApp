const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/socialNetwordDB')
    .then(() => {
        console.log('connected to mongodb')
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = mongoose.connection;