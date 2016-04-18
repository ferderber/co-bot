"use strict";
var Command = require("../Command.js");
var mongoose = require('mongoose');
var image = new Command('image', ['i', 'images'], function(message) {
    let arg = this.getArg(message.content);
    arg().then(msg => {
        message.reply(msg);
    });
}, new Map([
    ["list", function() {
        return new Promise((resolve, reject) => {
            resolve("Image list: ");
        });
    }],
    ["add", function() {
        return new Promise((resolve, reject) => {
            resolve("Image added");
        });
    }],
    ["remove", function() {
        return new Promise((resolve, reject) => {
            resolve("Image removed");
        });
    }]
]));
module.exports = image;
