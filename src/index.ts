import * as mongoose from 'mongoose';
import * as path from 'path';
const commandsPath = path.join(__dirname, 'lib', 'commands');
import config from './Config';
import * as CommandClient from 'djs-cc';

const client = new CommandClient.Client();
client
    .on('error', console.error)
    .on('warn', console.warn)
    .on('ready', () => {
        console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
        if (config.env === 'dev') {
            client.user.setPresence({
                status: 'dnd',
                afk: false,
                activity: {name: 'In Development'}
            });
        }
    })
    .on('disconnect', () => {
        console.warn('Disconnected!');
    })
    .on('reconnect', () => {
        console.warn('Reconnecting...');
    });

require('./lib/userListeners')(client);

client.registerCommandDirectory(path.join(commandsPath, 'search'))
client.registerCommandDirectory(path.join(commandsPath, 'admin'))
client.registerCommandDirectory(path.join(commandsPath, 'fun'))

client.login(config.discordToken);
mongoose.connect(config.db, { useMongoClient: true });