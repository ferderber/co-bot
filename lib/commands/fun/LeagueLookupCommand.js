const Discord = require('discord.js');
const LeagueJS = require('leaguejs');
const config = require('../../../config');
const {
    Command,
    Argument,
    ArgumentType
} = require('djs-cc');

module.exports = class LeagueLookupCommand extends Command {
    constructor() {
        super({
            name: 'leaguelookup',
            aliases: ['ll', 'league'],
            description: 'Looks up League of Legends stats for a user',
            usage: 'll username',
            args: [
                new Argument({
                    name: 'username',
                    type: ArgumentType.String,
                    required: true
                })
            ]
        });
        this.api = new LeagueJS(config.leagueToken, {
            PLATFORM_ID: 'na1'
        });
        this.getChampions();
    }
    async getChampions() {
        if (!this.champions) {
            this.champions = (await this.api.StaticData.gettingChampions({
                dataById: true
            })).data;
        }
        return this.champions;
    }
    getChampionPlays(matchList) {
        let champMap = new Map();
        for (var i = 0; i < matchList.length; i++) {
            let champion = champMap.get(matchList[i].champion);
            if (champion) {
                champion.numPlayed++;
            } else {
                champion = {
                    id: matchList[i].champion,
                    numPlayed: 1
                }
            }
            champMap.set(matchList[i].champion, champion);
        }
        let champList = [...champMap.values()].sort((champA, champB) => champB.numPlayed - champA.numPlayed);
        return champList;
    }
    getParticipantByAccountId(game, accountId) {
        //Find summoner's participant ID
        let participantId = game.participantIdentities.find(participant =>
            participant.player.accountId === accountId).participantId;
        //Find summoner's participant entry
        return game.participants.find((p) => p.participantId === participantId);
    }
    async run(msg, args) {
        const username = args.get('username').replace(' ', '');
        if (username) {
            var tempMsg = await msg.reply('Loading data...');
            try {
                const summoner = await this.api.Summoner.gettingByName(username);
                if (summoner) {
                    const matchList = (await this.api.Match.gettingListByAccount(summoner.accountId)).matches;
                    const recentList = matchList.slice(0, 10);
                    const recentGamePromises = [];
                    for (let i = 0; i < recentList.length; i++) {
                        recentGamePromises.push(this.api.Match.gettingById(recentList[i].gameId))
                    }

                    let topThree = this.getChampionPlays(matchList).slice(0, 3);

                    let games = await Promise.all(recentGamePromises);
                    let recordStr = '';
                    let wins = 0;
                    let losses = 0;

                    for (let i = games.length - 1; i >= 0; i--) {
                        var game = games[i];
                        let participant = this.getParticipantByAccountId(game, summoner.accountId);
                        recordStr += participant.stats.win ? (wins++, 'W') : (losses++, 'L');
                        if (i !== 0)
                            recordStr += '-';
                    }
                    tempMsg.delete();
                    msg.reply({
                        embed: {
                            title: `${summoner.name}'s Match History`,
                            url: `http://matchhistory.na.leagueoflegends.com/en/#match-history/NA1/${summoner.accountId}`,
                            fields: [{
                                    name: `W/L Record (${wins}/${losses})`,
                                    value: recordStr
                                },
                                {
                                    name: "Top 3 Most Played Champions",
                                    value: topThree.reduce((p, c) => (
                                        p += `${this.getChampionName(c.id)} ${c.numPlayed}\n`), '')
                                }
                            ]
                        }
                    });
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
    getChampionName(id) {
        return this.champions[`${id}`].name;
    }

}