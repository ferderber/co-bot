import * as CommandClient from 'djs-cc';
import * as path from 'path';
import { createConnection } from 'typeorm';
import { Config, TypeORMConfig } from './Config';
import { registerListeners } from './userListeners';

const commandsPath = path.join(__dirname, 'commands');

const main = async () => {
    createConnection(TypeORMConfig).catch(console.error);

    const client = new CommandClient.Client();
    client
        .on('error', console.error)
        .on('warn', console.warn)
        .on('ready', () => {
            console.log(`Client ready; logged in as ${client.user.username}\
            #${client.user.discriminator} (${client.user.id})`);
            if (Config.env === 'dev') {
                client.user.setPresence({
                    status: 'dnd',
                    afk: false,
                });
            }
        })
        .on('disconnect', () => {
            console.warn('Disconnected!');
        });

    registerListeners(client);

    client.registerCommandDirectory(path.join(commandsPath, 'search'));
    client.registerCommandDirectory(path.join(commandsPath, 'admin'));
    client.registerCommandDirectory(path.join(commandsPath, 'fun'));

    client.login(Config.discordToken);

};

main();
