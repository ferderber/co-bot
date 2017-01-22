const mongoose = require("mongoose");
const path = require('path');
const config = require('./config.js');
const Commando = require('discord.js-commando');
const client = new Commando.Client({
    owner: config.ownerId
});
client
    .on('error', console.error)
    .on('warn', console.warn)
    .on('ready', () => {
        console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
        if (config.env === 'dev') {
            client.user.setPresence({
                game: {
                    name: 'In Development'
                }
            });
        }
    })
    .on('disconnect', () => {
        console.warn('Disconnected!');
    })
    .on('reconnect', () => {
        console.warn('Reconnecting...');
    })
    .on('commandError', (cmd, err) => {
        if (err instanceof Commando.FriendlyError) return;
        console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
    });

require('./lib/userListeners')(client);

client.registry
    .registerGroup('admin', 'Admin')
    .registerGroup('fun', 'Fun')
    .registerGroup('search', 'Search')
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'lib', 'commands'));
client.login(config.discordToken);
mongoose.connect(config.db);