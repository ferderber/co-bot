var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
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
    user: {
        type: String,
        ref: 'User',
    },
    playCount: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Sound', soundSchema);
