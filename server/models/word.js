const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
    originalWord: {
        type: String,
        required: true,
        unique: true,
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

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;
