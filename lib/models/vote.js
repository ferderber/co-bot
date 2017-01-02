const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const User = require('./user.js');
const Sound = require('./sound.js');
var VoteSchema = new Schema({
    user: {
        type: Number,
        ref: 'User'
    },
    sound: {
        type: Schema.Types.ObjectId,
        ref: 'Sound'
    },
    rating: Number
});
VoteSchema.statics.rate = function rate(user, sound, rating) {
    var diff = rating;
    var ratingIndex = -1;
    return this.findOne({
        user: user._id,
        sound: sound._id
    }).then((vote) => {
        if (vote) {
            diff = rating - vote.rating;
            vote.rating = rating;
            //Check if the user has already rated the song
            ratingIndex = user.ratings.findIndex((r) => mongoose.Types.ObjectId(r).equals(vote._id));
        } else
            vote = new this({
                user: user._id,
                sound: sound._id,
                rating: rating
            });
        return vote.save();
    }).then((vote) => {
        if (ratingIndex >= 0)
            user.ratings[ratingIndex] = vote._id;
        else
            user.ratings.push(vote._id);
        user.save();
        sound.points += diff;
        return sound.save();
    });
};
module.exports = mongoose.model('Vote', VoteSchema);
