"use strict"
var Command = require("../Command.js");
var Sounds = require('../models/sounds.js');
var path = require('path');

var pullChanges = new Command('pullchanges', ['pullchange'], function(msg) {
        let bot = msg.client;
        if (msg.includes("confirm"))
            bot.sendMessage(msg.channel, "fetching updates...", function(error, sentMsg) {
                console.log("Updating pleb-bot");
                var spawn = require('child_process').spawn;
                var log = function(err, stdout, stderr) {
                    if (stdout) {
                        console.log(stdout);
                    }
                    if (stderr) {
                        console.log(stderr);
                    }
                };
                var fetch = spawn('git', ['fetch']);
                fetch.stdout.on('data', function(data) {
                    console.log(data.toString());
                });
                fetch.on("close", function(code) {
                    var reset = spawn('git', ['reset', '--hard', 'origin/master']);
                    reset.stdout.on('data', function(data) {
                        console.log(data.toString());
                    });
                    reset.on("close", function(code) {
                        var npm = spawn('npm', ['install']);
                        npm.stdout.on('data', function(data) {
                            console.log(data.toString());
                        });
                        npm.on("close", function(code) {
                            console.log("goodbye");
                            bot.sendMessage(msg.channel, "brb!", function() {
                                bot.logout(function() {
                                    process.exit();
                                });
                            });
                        });
                    });
                });
            });
        else
            bot.sendMessage(msg.channel, "pulling changes will clear any locally made changes, type !pullchanges confirm to continue",
                (err, sentMsg) => {
                    if (err) console.error(err)
                });
    },
    null);
module.exports = pullChanges;
