"use strict";
class Argument {
    constructor(keyword, description, aliases, fn) {
        this._keyword = keyword;
        this._description = description;
        this._aliases = aliases;
        this._fn = fn;
    }
    get aliases() {
        return this._aliases;
    }
    get keyword() {
        return this._keyword;
    }
    set description(desc) {
        this._description = desc;
    }
    get description() {
        return this._description;
    }
    execute(message) {
        let args = message.content.substring(message.content.indexOf(' ')).trim();
        if (args.includes('"')) {
            args = args.split('"');
            for (var i = 0; i < args.length; i++) {
                args[i] = args[i].trim();
                if (args[i] == '')
                    args.splice(i, 1);
            }
            args.splice(0, 1);
        } else
            args = args.split(' ').slice(1);
        return this._fn(message, args);
    }
}
module.exports = Argument;
