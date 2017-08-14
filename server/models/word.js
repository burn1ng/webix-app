const mongoose = require('mongoose');
const db = require('../config/db');
const autoIncrement = require('mongoose-auto-increment');

const connection = mongoose.createConnection(db.url);
autoIncrement.initialize(connection);

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
    wordGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WordGroup'
    }
}, {
    timestamps: true
    // autoIndex: false //for production purposes
});

wordSchema.plugin(autoIncrement.plugin, 'Word');
const Word = connection.model('Word', wordSchema);

module.exports = Word;
