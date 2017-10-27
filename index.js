const mongoose = require("mongoose");
const path = require('path');
const commandsPath = path.join(__dirname, 'lib', 'commands');
const config = require('./config.js');
const CommandClient = require('djs-cc');
const client = new CommandClient.Client();
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

client.registerCommandDirectory(path.join(commandsPath, 'search'))
client.registerCommandDirectory(path.join(commandsPath, 'admin'))
client.registerCommandDirectory(path.join(commandsPath, 'fun'))

client.login(config.discordToken);
mongoose.connect(config.db);