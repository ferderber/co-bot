class Config {
    public readonly env: string;
    public readonly db: string;
    public readonly redis: string;
    public readonly discordToken: string;
    public readonly ownerId: string;
    public readonly leagueToken: string;

    constructor() {
        this.env = process.env.NODE_ENV;
        this.db = (process.env.MONGO_URL || 'mongodb://localhost') + '/plebBot';
        this.discordToken = process.env.DISCORD_BOT_TOKEN;
        this.ownerId = process.env.DISCORD_BOT_OWNER_ID || '';
        this.leagueToken = process.env.LEAGUE_API_KEY;

    }
}

export default new Config();