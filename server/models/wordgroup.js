const mongoose = require('mongoose');
const db = require('../config/db');
const autoIncrement = require('mongoose-auto-increment');

const connection = mongoose.createConnection(db.url);
autoIncrement.initialize(connection);

const wordGroupSchema = new mongoose.Schema({
    _id: Number,
    wordGroupName: {
        type: String,
        required: true,
        maxlength: 100
    },
    userId: {
        type: Number,
        ref: 'User'
    },
    words: [{type: Number, ref: 'Word'}]
}, {
    timestamps: true
    // autoIndex: false //for production purposes
});

// wordGroupSchema.methods.countWordsInGroup = (name) => {
//     if (!res) return false;
//     return res;
// };

wordGroupSchema.plugin(autoIncrement.plugin, 'WordGroup');
const WordGroup = connection.model('WordGroup', wordGroupSchema);

module.exports = WordGroup;
