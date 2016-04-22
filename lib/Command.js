"use strict";
class Command {
    constructor(keyword, aliases, args) {
        this._keyword = keyword.toLowerCase();
        this._aliases = aliases;
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
    get bot() {
        return this._bot;
    }
    get message() {
        return this._message;
    }
    getArg(str) {
        return str.substring(str.indexOf(" ")).trim();
    }
    doArg(message) {
        return new Promise((resolve, reject) => {
            let msgContent = message.content;
            this._bot = message.client;
            this._message = message;
            let splitMsg = msgContent.substring(msgContent.indexOf(" ")).trim().split(' ');
            var sLength = splitMsg.length;
            for (var i = 0; i < sLength; i++) {
                for (var k = 0; k < this._args.length; k++) {
                    let arg = this._args[k];
                    if (splitMsg[i] == arg.key ||
                        (arg.aliases != null && arg.aliases.some(a => a.toLowerCase() === splitMsg[i] ? true : false))) {
                        resolve(this._args[k].execute(message));
                    }
                }
            }
            reject("Not found");
            return this._args.get(arg.substring(arg.indexOf(" ") + 1));
        });
    }
    execute(message) {
        return new Promise((resolve, reject) => {
            this.doArg(message).then(msg => {
                if (typeof msg != "string")
                    msg.forEach(m => message.client.sendMessage(message.channel, m));
                else
                    message.client.sendMessage(message.channel, msg);
                resolve();
            }).catch(e => {
                console.error(e);
            });
        });
    }
}
module.exports = Command;
