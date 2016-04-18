'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var soundSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    filename: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    playCount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Sound', soundSchema);
