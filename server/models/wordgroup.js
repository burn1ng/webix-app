const mongoose = require('mongoose');
const db = require('../config/db');

const wordGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100
    },
    words: [{type: mongoose.Schema.Types.ObjectId, ref: 'Word'}]
}, {
    timestamps: true
    // autoIndex: false //for production purposes
});

const connection = mongoose.createConnection(db.url);
const WordGroup = connection.model('WordGroup', wordGroupSchema);

module.exports = WordGroup;
