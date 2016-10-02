"use strict";
var Command = require("../Command.js");
var Argument = require("../Argument.js");
var User = require('../models/user.js');
class ProfileCommand extends Command {
    constructor() {
        super('profile', ['prof', 'pro'], null);
        var args = [
            new Argument('stats', "Displays your current stats", ['info', 'me'], this.stats),
            new Argument('user', "Displays stats for another user (!profile user [username])", null, this.user),
        ];
        this._args = args;
        this.description = 'Displays information about a user.';
    }
    noArgExecute(message) {
        return User.findOne({
            _id: message.author.id
        }).then(user => {
            return user.username + " is level " + user.level + " with " + user.xp + " xp";
        });
    }
    stats(message, args) {
        return User.findOne({
            _id: message.author.id
        }).then(user => {
            return user.username + " is level " + user.level + " with " + user.xp + " xp";
        });
    }
    user(message, args) {
        return User.findOne({
            username: args[0]
        }).then(user => {
            if (user)
                return user.username + " is level " + user.level + " with " + user.xp + " xp";
            else
                return "Username could not be found";
        });
    }
}
module.exports = new ProfileCommand();
