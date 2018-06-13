const {
    Command,
    Argument,
    ArgumentType
} = require('djs-cc');

module.exports = class RollCommand extends Command {
    constructor() {
        super({
            name: 'roll',
            aliases: ['r'],
            description: 'Rolls a dice type, or between supplied values.',
            usage: 'roll d6 | !roll 1 6',
            args: [
                new Argument({
                    name: 'rangeStartOrDice',
                    type: ArgumentType.String,
                    required: false
                }),
                new Argument({
                    name: 'rangeEnd',
                    type: ArgumentType.String,
                    required: false
                })
            ]
        });
    }
    async run(msg, args) {
        let roll = 0;
        let rollType = 'none';
        let iconUrl = 'https://i.imgur.com/aw0Oa4p.png';
        let rangeStartOrDice = args.get('rangeStartOrDice') || '';
        let rangeEnd = args.get('rangeEnd');
        let startInt = parseInt(rangeStartOrDice);
        let endInt = parseInt(rangeEnd);
         
        // check if first arg matches a 'd6' style pattern
        let diceMatch = rangeStartOrDice.match(/d\d+/i);
        if (rangeStartOrDice && diceMatch && !rangeEnd) {
            let diceValue = parseInt(diceMatch[0].slice(1));
            roll = Math.floor(Math.random() * diceValue + 1);
            rollType = `D${diceValue} Roll`;

        } else if (!isNaN(startInt) && !isNaN(endInt)) {
            // if supplied two valid numbers, roll between the supplied ranges
            roll = Math.floor(Math.random() * (endInt - startInt) + startInt);
            rollType = `${startInt}-${endInt} Roll`;
        
        } else {
            // no args or incorrect args yields a 4chan-esque 6-digit message ID roll
            roll = msg.id.slice(-6);
            rollType = 'Message ID Roll';
            iconUrl = 'https://i.imgur.com/DYxXcYY.png';
        }

        msg.channel.send({
            "embed": {
                "color": 1144643,
                "description": `${msg.author}'s roll: **${roll}**`,
                "author": {
                    "name": rollType,
                    "icon_url": iconUrl
                }
            }
        });
    }
}