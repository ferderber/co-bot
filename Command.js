"use strict";
class Command {
    constructor(keyword, aliases, fn, args) {
        if (arguments.length == 4) {
            this._aliases = aliases;
        } else {
            this._aliases = null;
        }
        this._keyword = keyword.toLowerCase();
        this._fn = fn;
        if (typeof args !== "undefined")
            this._args = args;
    }
    get keyword() {
        return this._keyword;
    }
    set keyword(keyword) {
        this._keyword = keyword;
    }
    get aliases() {
        return this._aliases;
    }
    set aliases(aliases) {
        this._aliases = aliases;
    }
    set fn(fn) {
        this._fn = fn;
    }
    get args() {
        return this._args;
    }
    set args(args) {
        this._args = args;
    }
    getArg(str) {
        return str.substring(str.indexOf(" ")).trim();
    }
    doArg(message) {
        return new Promise((resolve, reject) => {
            let arg = message.content;
            let splitMsg = arg.substring(arg.indexOf(" ")).trim().split(' ');
            var sLength = splitMsg.length;
            for (var i = 0; i < sLength; i++) {
                let a = this._args.get(splitMsg[i]);
                if (a != null) {
                    return a(splitMsg.slice(1), message).then(
                        msg => resolve(msg)).catch(
                        err => reject(err));
                }
            }
            reject("Not found");

        });
        return this._args.get(arg.substring(arg.indexOf(" ") + 1));
    }
    exec(message) {
        return new Promise((resolve, reject) => {
            resolve(this._fn(message));
        });
    }
}
module.exports = Command;
