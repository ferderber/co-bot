"use strict";
var Command = require("../Command.js");
var Argument = require("../Argument.js");
class ImageCommand extends Command {
    constructor() {
        super('image', ['i', 'img'], null);
        var args = [
            new Argument('list', 'Lists all images', null, this.all),
            new Argument('add', 'Adds an image to the list', null, this.bot),
            new Argument('remove', 'Removes an image from the list', null, this.user),
        ];
        this._args = args;
    }
    list() {
        return new Promise((resolve, reject) => {
            resolve("Image list: ");
        });
    }
    add() {

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
