"use strict";
var Command = require("../Command.js");
var Argument = require("../Argument.js");
class ImageCommand extends Command {
    constructor() {
        super('help', ['h'], null);
    }
    execute(message, commands) {
        return new Promise((resolve, reject) => {
            let helpMsg = 'The following commands are available: \n';
            for (var i = 0; i < commands.length; i++) {
                helpMsg += "!" + commands[i].name + " - " + commands[i].description;
                if (i != (commands.length - 1)) {
                    helpMsg += "\n";
                }
            }
            resolve(helpMsg);
        });
    }
}
module.exports = new ImageCommand();
