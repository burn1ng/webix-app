const mongoose = require('mongoose');
const db = require('../config/db');
const random = require('mongoose-simple-random');
const autoIncrement = require('mongoose-auto-increment');

const connection = mongoose.createConnection(db.url);
autoIncrement.initialize(connection);

const wordSchema = new mongoose.Schema({
    _id: Number,
    _creator: {
        type: Number,
        ref: 'User'
    },
    _wordGroup: {
        type: Number,
        ref: 'WordGroup'
    },
    originalWord: {
        type: String,
        maxlength: 45
    },
    translationWord: {
        type: String,
        maxlength: 150
    },
    partOfSpeech: {
        type: Number
    }
}, {
    timestamps: true
    // autoIndex: false //for production purposes
});

wordSchema.plugin(random);
wordSchema.plugin(autoIncrement.plugin, 'Word');
const Word = connection.model('Word', wordSchema);

module.exports = Word;
