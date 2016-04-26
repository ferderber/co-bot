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
    stats() {
        return new Promise((resolve, reject) => {
            resolve("User stats");
        });
    }
    user() {

        return new Promise((resolve, reject) => {
            resolve("User");
        });
    }
}
module.exports = new ImageCommand();
