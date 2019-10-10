// DEPENDANCIES

const Discord = require('discord.js');
const FS = require('fs');

// MODULES

const BotConfig = require('../dcubot/config.json')

// VARIABLES

const BotClient = new Discord.Client();

BotClient.on('message', message => {

  if (message.author.bot) return;
  if (message.content.indexOf(BotConfig.prefix) !== 0) return;

  const args = message.content.slice(BotConfig.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  try {

    delete require.cache[require.resolve(`./commands/${cmd}.js`)]

    let commandFile = require(`./commands/${cmd}.js`)
    commandFile.run(BotClient, message, args);

  } catch (e) {
    console.log(e.stack);
  };
});

BotClient.on('error', console.error);

BotClient.on('ready', () => console.log('Launched!'));

BotClient.login(BotConfig.token);
