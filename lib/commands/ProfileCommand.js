"use strict";
var Command = require("../Command.js");
var Argument = require("../Argument.js");
var User = require('../models/user.js');
class ImageCommand extends Command {
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
        return new Promise((resolve, reject) => {
            User.findOne({
                _id: message.sender.id
            }).then(user => {
                resolve(user.username + " is level " + user.level + " with " + user.xp + " xp");
            }).catch(err => reject(err));
        });

    }
    stats(message, args) {
        return new Promise((resolve, reject) => {
            User.findOne({
                _id: message.sender.id
            }).then(user => {
                resolve(user.username + " is level " + user.level + " with " + user.xp + " xp");
            }).catch(err => reject(err));
        });
    }
    user(message, args) {
        return new Promise((resolve, reject) => {
            User.findOne({
                username: args[0]
            }).then(user => {
                resolve(user.username + " is level " + user.level + " with " + user.xp + " xp");
            }).catch(err => reject(err));
        });
    }
}
module.exports = new ImageCommand();
