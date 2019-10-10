const Discord = module.require('discord.js');
const Utility = require("../utilfunctions/utility");

module.exports.run = async (bot, message, args) => {
  let CurrentTime = new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '')     // delete the dot and everything after

    message.channel.send(Utility.Embedify(bot, `The time is currently ${CurrentTime}`));
}
