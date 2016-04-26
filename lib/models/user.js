'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Sounds = require('./sounds.js');
var userSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    joinDate: {
        type: Date,
        required: false,
        default: new Date()
    },
    level: {
        type: Number,
        required: false,
        default: 1
    },
    xp: {
        type: Number,
        required: false,
        default: 0
    },
    sounds: [{
        type: Schema.Types.ObjectId,
        ref: 'Sound'
    }],
    soundPlays: {
        type: Number,
        required: false,
        default: 0
    }
});
module.exports = mongoose.model('User', userSchema);
