'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
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
    soundPlays: {
        type: Number,
        required: false
    }
});
module.exports = mongoose.model('user', userSchema);
