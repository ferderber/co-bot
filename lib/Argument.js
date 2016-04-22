"use strict";
class Argument {
    constructor(key, aliases, fn) {
        this._key = key;
        this._aliases = aliases;
        this._fn = fn;
    }
    get aliases() {
        return this._aliases;
    }
    get key() {
        return this._key;
    }
    execute(message) {
        let args = message.content.substring(message.content.indexOf(' ')).trim();
        console.log(args);
        if (args.includes('"')) {
            args = args.split('"');
            console.log(args);
            for (var i = 0; i < args.length; i++) {
                args[i] = args[i].trim();
                if (args[i] == '')
                    args.splice(i, 1);
            }
            args.splice(0, 1);
        } else
            args = args.split(' ').slice(1);
        console.log(args);
        return this._fn(message, args);
    }
}
module.exports = Argument;
