"use strict"
var Argument = require("../Argument.js");
var Command = require("../Command.js");
var Sounds = require('../models/sounds.js');
var path = require('path');
var config = require('../../config.js');
var mongoose = require('mongoose');
class CleanCommand extends Command {
    constructor() {
        super('clean', ['c', 'cleaner'], null);
        var args = [
            new Argument('all', 'Cleans messages that matches given parameter (!clean all [message] [searchDistance])', null, this.all),
            new Argument('bot', 'Cleans messages from the bot in the current channel (!clean bot [searchDistance])', null, this.bot),
            new Argument('user', 'Cleans messages from the specified user in the current channel (!clean user [searchDistance])', null, this.user),
        ];
        this.description = 'Used to clear messages from the chat';
        this._args = args;
    }

    bot(message, args) {
        let bot = message.client;
        if (typeof args[0] == "undefined")
            return Promise.resolve("Argument must be # of messages to search");
        if (args[0] <= 200 && args[0] > 0)
            return bot.getChannelLogs(message.channel, args[0], {
                before: message
            }).then(messages => {
                let count = 0;
                for (var i = 0; i < messages.length; i++) {
                    if (messages[i].author.username == "pleb-bot") {
                        bot.deleteMessage(messages[i]).catch(err => reject(err));
                        count++;
                    }
                }
                return "Deleted " + count + " bot messages.";
            });
        else
            Promise.resolve(args[0] + " is an invalid search amount, must be between 0 and 200");
    }
    all(message, args) {
        let bot = message.client;
        if (args[0].length < 3)
            return Promise.resolve(args[0] + " is too broad. Please enter a search with at least three characters.");
        if (typeof args[1] == "undefined")
            return Promise.resolve("Second argument must be # of messages to search");
        if (args[1] <= 100 && args[1] > 0)
            return bot.getChannelLogs(message.channel, args[1], {
                before: message
            }).then(messages => {
                let count = 0;
                for (var i = 0; i < messages.length; i++) {
                    if (messages[i].content.includes(args[0])) {
                        bot.deleteMessage(messages[i]).catch(err => console.log(err));
                        count++;
                    }
                }
                return "Deleted " + count + " messages containing \"" + args[0] + "\"";
            }).catch(err => console.error(err));
        else
            Promise.resolve(args[1] + " is an invalid search amount, must be between 0 and 100");
    }
    user(message, args) {
        let bot = message.client;
        if (typeof args[0] == "undefined")
            return Promise.resolve("First argument must be a username");
        if (typeof args[1] == "undefined")
            return Promise.resolve("Second argument must be # of messages to search");
        if (args[1] <= 25 && args[1] > 0)
            bot.getChannelLogs(message.channel, 50, {
                before: message
            }).then(messages => {
                let count = 0;
                for (var i = 0; i < messages.length; i++) {
                    if (messages[i].author.username == args[0]) {
                        bot.deleteMessage(messages[i]).catch(err => console.log(err));
                        count++;
                    }
                }
                return "Deleted " + count + " messages from *" + args[0] + "*";
            }).catch(err => console.error(err));
        else
            return Promise.resolve(args[1] + " is an invalid search amount, must be between 0 and 25");
    }
}
module.exports = new CleanCommand();
