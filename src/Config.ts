import {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class Config {
    public static readonly env: string = process.env.NODE_ENV;
    public static readonly db: string = (process.env.MONGO_URL || 'mongodb://localhost') + '/plebBot';
    public static readonly redis: string;
    public static readonly discordToken: string = process.env.DISCORD_BOT_TOKEN;
    public static readonly ownerId: string = process.env.DISCORD_BOT_OWNER_ID || '';
    public static readonly leagueToken: string = process.env.LEAGUE_API_KEY;
}
