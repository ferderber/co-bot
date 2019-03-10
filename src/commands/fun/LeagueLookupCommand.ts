import { Argument, ArgumentType, Command, Message } from 'djs-cc';
import { LeagueJS } from 'leaguejs';
import {Config} from '../../Config';

export default class LeagueLookupCommand extends Command {
    private api: LeagueJS;
    private champions: any[];
    constructor() {
        super({
            aliases: ['ll', 'league'],
            args: [
                new Argument({
                    name: 'username',
                    required: true,
                    type: ArgumentType.String,
                })],
            description: 'Looks up League of Legends stats for a user',
            name: 'leaguelookup',
            usage: 'll username',
        });
        this.api = new LeagueJS(Config.leagueToken, {
            PLATFORM_ID: 'na1',
        });
        this.getChampions();
    }

    public async run(msg: Message, args: Map<string, any>) {
        const username = args.get('username').replace(' ', '');
        if (username) {
            const tempMsg = await msg.reply('Loading data...') as Message;
            try {
                const summoner = await this.api.Summoner.gettingByName(username);
                if (summoner) {
                    const matchList = (await this.api.Match.gettingListByAccount(summoner.accountId)).matches;
                    const recentList = matchList.slice(0, 10);
                    const recentGamePromises: any[] = [];
                    recentList.forEach((recent: any) => {
                        recentGamePromises.push(this.api.Match.gettingById(recentList.gameId));
                    });

                    const topThree = this.getChampionPlays(matchList).slice(0, 3);

                    const games = await Promise.all(recentGamePromises);
                    let recordStr = '';
                    let wins = 0;
                    let losses = 0;

                    for (let i = games.length - 1; i >= 0; i--) {
                        const game = games[i];
                        const participant = this.getParticipantByAccountId(game, summoner.accountId);
                        recordStr += participant.stats.win ? (wins++, 'W') : (losses++, 'L');
                        if (i !== 0) {
                            recordStr += '-';
                        }
                    }
                    tempMsg.delete();
                    msg.reply({
                        embed: {
                            fields: [{
                                    name: `W/L Record (${wins}/${losses})`,
                                    value: recordStr,
                                },
                                {
                                    name: "Top 3 Most Played Champions",
                                    value: topThree.reduce((p, c) => (
                                        p += `${this.getChampionName(c.id)} ${c.numPlayed}\n`), ''),
                            }],
                            title: `${summoner.name}'s Match History`,
                            url: `http://matchhistory.na.leagueoflegends.com/en/#match-history/NA1/\
                            ${summoner.accountId}`,
                        }});
                } else {
                    msg.reply('Summoner not found.');
                }
            } catch (err) {
                msg.reply('Error accessing LoL data');
                tempMsg.delete();
                console.error(err);
            }
        }
    }

    private async getChampions() {
        if (!this.champions) {
            this.champions = (await this.api.StaticData.gettingChampions({
                dataById: true,
            })).data;
        }
        return this.champions;
    }
    private getChampionPlays(matchList: any) {
        const champMap = new Map();
        matchList.forEach((match: any) => {
            let champion = champMap.get(match.champion);
            if (champion) {
                champion.numPlayed++;
            } else {
                champion = {
                    id: match.champion,
                    numPlayed: 1,
                };
            }
            champMap.set(match.champion, champion);
        });
        const champList = [...champMap.values()].sort((champA, champB) => champB.numPlayed - champA.numPlayed);
        return champList;
    }
    private getParticipantByAccountId(game: any, accountId: any) {
        // Find summoner's participant ID
        const participantId = game.participantIdentities.find((participant: any) =>
            participant.player.accountId === accountId).participantId;
        // Find summoner's participant entry
        return game.participants.find((p: any) => p.participantId === participantId);
    }
    private getChampionName(id: number) {
        return this.champions[id].name;
    }
}
