var User = require('./models/user.js');
module.exports = function(bot) {
    bot.on('message', function(message) {
        if (/^!\w+(\s+[\w"]+)+$/.test(message.content)) {
            giveExperience(message.sender, 1);
        } else {
            giveExperience(message.sender, 2);
        }
    });
    bot.on('userVoiceJoin', function(channel, user) {
        giveExperience(user, 5);
    });
    bot.on('serverNewMember', function(server, user) {});
}

function giveExperience(user, xp) {
    return new Promise((resolve, reject) => {
        User.findOne({
            _id: user.id
        }).then((u) => {
            if (!u) {
                console.log("Adding user: " + user.username);
                u = new User({
                    _id: user.id,
                    username: user.username
                });
            }
            u.xp += xp;
            if (u.xp >= 100) {
                u.xp = (u.xp - 100);
                u.level++;
            }
            u.save().then(newUser => {
                resolve();
            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    });
}
