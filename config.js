var config = {};
switch (process.env.NODE_ENV) {
    case 'dev':
        config = {
            env: 'dev',
            db: 'mongodb://localhost/plebBot',
            redis: process.env.REDIS_URL || '127.0.0.1',
            discordToken: process.env.DISCORD_BOT_TOKEN,
            ownerId: process.env.DISCORD_BOT_OWNER_ID || ''
        };
        break;
    case 'production':
        config = {
            env: 'prod',
            db: (process.env.MONGO_URL || 'mongodb://localhost') + '/plebBot',
            redis: process.env.REDIS_URL,
            discordToken: process.env.DISCORD_BOT_TOKEN,
            ownerId: process.env.DISCORD_BOT_OWNER_ID || ''
        };
        break;
    default:
        config = {
            env: 'dev',
            db: 'mongodb://localhost/plebBot',
            redis: process.env.REDIS_URL,
            discordToken: process.env.DISCORD_BOT_TOKEN,
            ownerId: process.env.DISCORD_BOT_OWNER_ID || ''
        };
        break;
}
module.exports = config;