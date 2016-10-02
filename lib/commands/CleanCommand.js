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
        if (typeof args[0] == "undefined")
            return Promise.resolve("Argument must be # of messages to search");
        if (args[0] <= 200 && args[0] > 0)
            return message.channel.fetchMessages({
                limit: args[0]
            }).then(messages => {
                var filteredMessages = messages.filter((msg) => {
                    return msg.author.username == 'pleb-bot';
                }).array();
                if (filteredMessages.length > 1)
                    return message.channel.bulkDelete(filteredMessages).then((a) => "Deleted " + filteredMessages.length + " bot messages");
                else if (filteredMessages.length === 1)
                    return filteredMessages[0].delete().then((a) => "Deleted one bot message");
                else
                    return null;
                // return Promise.all(messages.deleteAll()).then(() =>
                // "Deleted some bot messages."
                // );
            });
        else
            Promise.resolve(args[0] + " is an invalid search amount, must be between 0 and 200");
    }
    all(message, args) {
        if (args[0].length < 3)
            return Promise.resolve(args[0] + " is too broad. Please enter a search with at least three characters.");
        if (typeof args[1] == "undefined")
            return Promise.resolve("Second argument must be # of messages to search");
        if (args[1] <= 100 && args[1] > 0)
            return message.channel.fetchMessages({
                limit: args[1]
            }).then(messages => {
                messages = messages.filter((msg) => msg.content.includes(args[0])).array();
                if (messages.length > 1)
                    return message.channel.bulkDelete(messages).then((a) => "Deleted " + messages.length + " messages");
                else if (messages.length === 1)
                    return messages[0].delete().then((a) => "Deleted one message");
                else
                    return null;
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
            return message.channel.fetchMessages({
                limit: args[1]
            }).then(messages => {
                messages = messages.filter((msg) => msg.author.username == args[0]).array();
                if (messages.length > 1)
                    return message.channel.bulkDelete(messages).then((a) => "Deleted " + messages.length + " messages");
                else if (messages.length === 1)
                    return messages[0].delete().then((a) => "Deleted one message");
                else
                    return null;
            }).catch(err => console.error(err));
        else
            return Promise.resolve(args[1] + " is an invalid search amount, must be between 0 and 25");
    }
}
module.exports = new CleanCommand();
