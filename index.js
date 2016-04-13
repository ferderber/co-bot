"use strict";
var Discord = require("discord.js");
var Sounds = require('./models/sounds.js');
var images = require("./commands/image.js");
var sound = require("./commands/sound.js");
var Command = require("./Command.js");
var playSound = require("./commands/playsound.js");
var pullChanges = require("./commands/pullchanges.js");

var bot = new Discord.Client();

var commands = [playSound, sound, pullChanges];
bot.on("message", function(message) {
    if (message.content.charAt(0) === '!') {
        doCommand(message);
    }
});

bot.on("ready", function() {});
bot.loginWithToken(process.env.DISCORD_BOT_TOKEN, function(err, token) {
    if (err)
        console.error(err);
});

function doCommand(message) {
    commands.forEach(function(command) {
        let space = message.content.indexOf(' ');
        if (space === -1) {
            space = message.content.length;
        }
        if (message.content.substring(1, space) === command.keyword) {
            command.exec(message).then(() => {});
        }
    });
}
