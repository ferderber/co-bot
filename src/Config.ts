export const Config = {
  env: process.env.NODE_ENV,
  db: (process.env.MONGO_URL || "mongodb://localhost") + "/plebBot",
  discordToken: process.env.DISCORD_BOT_TOKEN,
  ownerId: process.env.DISCORD_BOT_OWNER_ID || "",
  leagueToken: process.env.LEAGUE_API_KEY,
};

export default Config;
