const mongoose = require('mongoose');
const db = require('../config/db');

const wordSchema = new mongoose.Schema({
    originalWord: {
        type: String,
        required: true,
        // unique: true,
        index: true, // don't touch
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
    }
}, {
    timestamps: true
});

wordSchema.set('autoIndex', false);

const connection = mongoose.createConnection(db.url);
const Word = connection.model('Word', wordSchema);

module.exports = Word;
