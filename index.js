"use strict";
var Discord = require("discord.js");
var Sounds = require('./lib/models/sounds.js');
var Command = require("./lib/Command.js");
var config = require('./config.js');
var soundCommand = require("./lib/commands/SoundCommand.js");
var playSoundCommand = require("./lib/commands/PlaySoundCommand.js");
var cleanCommand = require("./lib/commands/CleanCommand.js");
var imageCommand = require("./lib/commands/ImageCommand.js");
var pullChanges = require("./lib/commands/PullChangesCommand.js");
var mongoose = require("mongoose");
var bot = new Discord.Client();
mongoose.connect(config.db);

var commands = [playSoundCommand, soundCommand, cleanCommand];
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
