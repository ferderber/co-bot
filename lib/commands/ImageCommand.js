"use strict";
var Command = require("../Command.js");
var Argument = require("../Argument.js");
class ImageCommand extends Command {
    constructor() {
        super('image', ['i', 'img'], null);
        var args = [
            new Argument('all', null, this.all),
            new Argument('bot', null, this.bot),
            new Argument('user', null, this.user),
        ];
        this._args = args;
    }
    list() {
        return new Promise((resolve, reject) => {
            resolve("Image list: ");
        });
    }
    added() {

        return new Promise((resolve, reject) => {
            resolve("Image added");
        });
    }
    remove() {
        return new Promise((resolve, reject) => {
            resolve("Image removed");
        });
    }
}
module.exports = new ImageCommand();
