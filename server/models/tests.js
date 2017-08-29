const mongoose = require('mongoose');
const db = require('../config/db');
const autoIncrement = require('mongoose-auto-increment');

const connection = mongoose.createConnection(db.url);
autoIncrement.initialize(connection);

const testSchema = new mongoose.Schema({
    _id: Number,
    _creator: {
        type: Number,
        ref: 'User'
    },
    _wordGroup: {
        type: Number,
        ref: 'WordGroup'
    },
    score: Number
}, {
    timestamps: true
    // autoIndex: false //for production purposes
});

testSchema.plugin(autoIncrement.plugin, 'Test');
const Test = connection.model('Test', testSchema);

module.exports = Test;
