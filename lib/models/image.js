var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var imageSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    filename: {
        type: String,
        required: true
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
    }
});

module.exports = mongoose.model('image', imageSchema);
