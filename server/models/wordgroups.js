const mongoose = require('mongoose');
const db = require('../config/db');
const autoIncrement = require('mongoose-auto-increment');

const connection = mongoose.createConnection(db.url);
autoIncrement.initialize(connection);

const wordGroupSchema = new mongoose.Schema({
    _id: Number,
    _creator: {
        type: Number,
        ref: 'User'
    },
    wordGroupName: {
        type: String,
        required: true,
        maxlength: 100
    }
}, {
    timestamps: true
    // autoIndex: false //for production purposes
});

wordGroupSchema.plugin(autoIncrement.plugin, 'WordGroup');
const WordGroup = connection.model('WordGroup', wordGroupSchema);

module.exports = WordGroup;
