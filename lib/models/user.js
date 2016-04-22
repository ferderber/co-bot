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
        required: true,
    },
    joinDate: {
        type: Date,
        required: false
    },
    xp: {
        type: Number,
        required: false
    },
    sounds: [{
        type: Schema.Types.ObjectId,
        ref: 'Sound'
    }],
    soundPlays: {
        type: Number,
        required: false
    }
});
module.exports = mongoose.model('User', userSchema);
