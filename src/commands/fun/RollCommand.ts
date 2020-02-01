import { RichEmbed } from 'discord.js';
import { Argument, ArgumentType, Command, Message } from 'djs-cc';

export default class RollCommand extends Command {
    constructor() {
        super({
            aliases: ['r'],
            args: [
                new Argument({
                    name: 'rangeStartOrDice',
                    required: false,
                    type: ArgumentType.String,
                }),
                new Argument({
                    name: 'rangeEnd',
                    required: false,
                    type: ArgumentType.String,
                }),
            ],
            description: 'Rolls a dice type, or between supplied values.',
            name: 'roll',
            usage: 'roll d6 | !roll 1 6',
        });
    }
    public async run(msg: Message, args: Map<string, any>) {
        let roll = 0;
        let rollType = 'none';
        let iconUrl = 'https://i.imgur.com/aw0Oa4p.png';
        const rangeStartOrDice = args.get('rangeStartOrDice') || '';
        const rangeEnd = args.get('rangeEnd');
        const startInt = parseInt(rangeStartOrDice, 10);
        const endInt = parseInt(rangeEnd, 10);

        // check if first arg matches a 'd6' style pattern
        const diceMatch = rangeStartOrDice.match(/d\d+/i);
        if (rangeStartOrDice && diceMatch && !rangeEnd) {
            const diceValue = parseInt(diceMatch[0].slice(1), 10);
            roll = Math.floor(Math.random() * diceValue + 1);
            rollType = `D${diceValue} Roll`;

        } else if (!isNaN(startInt) && !isNaN(endInt)) {
            // if supplied two valid numbers, roll between the supplied ranges
            roll = Math.floor(Math.random() * (endInt - startInt) + startInt);
            rollType = `${startInt}-${endInt} Roll`;

        } else {
            // no args or incorrect args yields a 4chan-esque 6-digit message ID roll
            roll = parseInt(msg.id.slice(-6), 10);
            rollType = 'Message ID Roll';
            iconUrl = 'https://i.imgur.com/DYxXcYY.png';
        }
        const embed = new RichEmbed({
            author: {
                icon_url: iconUrl,
                name: rollType,
            },
            color: 1144643,
            description: `${msg.author}'s roll: **${roll}**`,
        });
        msg.channel.send(embed);
    }
}
