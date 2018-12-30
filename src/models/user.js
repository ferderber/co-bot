var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var Sounds = require('./sounds.js');
var userSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    avatar: {
        type: String
    },
    joinDate: {
        type: Date,
        default: new Date()
    },
    level: {
        type: Number,
        default: 1
    },
    xp: {
        type: Number,
        default: 0
    },
    sounds: [{
        type: Schema.Types.ObjectId,
        ref: 'Sound'
    }],
    soundPlays: {
        type: Number,
        default: 0
    },
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: 'Vote'
    }]
});
module.exports = mongoose.model('User', userSchema);
