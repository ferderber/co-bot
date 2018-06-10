var User = require('./models/user.js');
module.exports = function (bot) {
    bot.on('message', (message) => {
        if (/^!\w+(\s+[\w"]+)+$/.test(message.content)) {
            giveExperience(message.author, 1);
        } else {
            giveExperience(message.author, 2);
        }
    });

    bot.on('serverNewMember', (server, user) => {});

    setInterval(() => {
        for (var i = 0; i < bot.guilds.length; i++) {
            var guild = bot.guilds[i];
            for (var j = 0; j < guild.channels.length; j++) {
                var channel = guild.channels[j];
                if (channel.type === 'voice' && channel.id !== guild.afkChannelID) 
                    for (var k = 0; k < channel.members.length; k++) {
                        var user = channel.members[k];
                        if (user.status != 'idle') {
                            console.log('Giving ' + user.username + ' 10 xp');
                            giveExperience(user, 10);
                        }
                    }
                }
        }
    }, 1000 * 60 * 30);
}

function giveExperience(user, xp) {
    return User
        .findOne({_id: user.id})
        .then((u) => {
            if (!u) {
                console.log("Adding user: " + user.username);
                u = new User({_id: user.id, username: user.username});
            }
            u.xp += xp;
            if (u.xp >= 100) {
                u.xp = (u.xp - 100);
                u.level++;
            }
            if (u.level >= 400) {
                console.log(`adding ${user.username} to Elder`);
                let member = user.lastMessage.member;
                let role = member
                    .guild
                    .roles
                    .find('name', 'Elder');
                if (role && !member.roles.has(role.id)) {
                    member.addRole(role);
                }
            }
            return u.save();
        });
}