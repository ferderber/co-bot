var config = {};
switch (process.env.NODE_ENV) {
    case 'dev':
        config = {
            db: 'mongodb://localhost/plebBot',
            redis: process.env.REDIS_URL || '127.0.0.1',
            discordToken: process.env.DISCORD_BOT_TOKEN,
        };
        break;
    case 'prod':
        config = {
            db: process.env.MONGO_URL + "/plebBot",
            redis: process.env.REDIS_URL,
            discordToken: process.env.DISCORD_BOT_TOKEN,
        };
        break;
    default:
        config = {
            db: 'mongodb://localhost/plebBot',
            redis: process.env.REDIS_URL,
            discordToken: process.env.DISCORD_BOT_TOKEN,
        };
        break;
}
module.exports = config;
