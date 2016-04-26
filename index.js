"use strict";
var Discord = require("discord.js"),
    Sounds = require('./lib/models/sounds.js'),
    Command = require("./lib/Command.js"),
    config = require('./config.js'),
    soundCommand = require("./lib/commands/SoundCommand.js"),
    playSoundCommand = require("./lib/commands/PlaySoundCommand.js"),
    cleanCommand = require("./lib/commands/CleanCommand.js"),
    imageCommand = require("./lib/commands/ImageCommand.js"),
    helpCommand = require("./lib/commands/HelpCommand.js"),
    profileCommand = require("./lib/commands/ProfileCommand.js"),
    pullChanges = require("./lib/commands/PullChangesCommand.js"),
    userListeners = require("./lib/userListeners.js"),
    mongoose = require("mongoose"),
    bot = new Discord.Client();

mongoose.connect(config.db);

var commands = [playSoundCommand, soundCommand, cleanCommand, profileCommand];
userListeners(bot);

bot.on("message", function(message) {
    if (message.content.charAt(0) === '!') {
        doCommand(message);
    }
});

bot.on("ready", function() {
    console.log("PlebBot is online!!");
});
bot.on('error', function(err) {
    console.error(err);
});
bot.loginWithToken(config.discordToken, function(err, token) {
    if (err)
        console.error(err);
});

function doCommand(message) {
    if (/^!(help|h)$/.test(message.content))
        helpCommand.execute(message, commands).then(((msg) => {
            message.client.sendMessage(message.channel, msg);
        }));
    else
        commands.forEach(function(command) {
            let space = message.content.indexOf(' ');
            if (space === -1) {
                space = message.content.length;
            }
            let cmdString = message.content.substring(1, space).toLowerCase();
            if (cmdString === command.keyword ||
                (command.aliases != null && command.aliases.some(a => a.toLowerCase() === cmdString ? true : false))) {
                return command.execute(message).then(() => {}).catch(e => console.error(e));
            }
        });
}
