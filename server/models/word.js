const mongoose = require('mongoose');
const db = require('../config/db');

const wordSchema = new mongoose.Schema({
    originalWord: {
        type: String,
        required: true,
        maxlength: 45
    },
    translationWord: {
        type: String,
        required: true,
        maxlength: 150
    },
    partOfSpeech: {
        type: Number,
        required: true
    },
    wordGroup: {type: Number, ref: 'WordGroup'}
}, {
    timestamps: true
    // autoIndex: false //for production purposes
});

const connection = mongoose.createConnection(db.url);
const Word = connection.model('Word', wordSchema);

module.exports = Word;
