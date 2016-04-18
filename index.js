"use strict";
var Discord = require("discord.js");
var Sounds = require('./models/sounds.js');
var images = require("./commands/image.js");
var sound = require("./commands/sound.js");
var Command = require("./Command.js");
var config = require('./config.js');
var playSound = require("./commands/playsound.js");
var pullChanges = require("./commands/pullchanges.js");
var mongoose = require("mongoose");
var bot = new Discord.Client();
mongoose.connect(config.db);

var commands = [playSound, sound, pullChanges];
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
            return command.exec(message).then(() => {}).catch(e => console.error(e));
        }
    });
}
