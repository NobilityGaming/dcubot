// DEPENDANCIES

const Discord = require('discord.js');
const express = require('express')
const app = express()
const http = require('http')

// MODULES

const BotConfig = require('./config.json')

// VARIABLES

const BotClient = new Discord.Client();
let port = process.env.PORT || 8080

//

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

app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

setInterval(() => {
http.get(`https://ca1dcu.herokuapp.com/`); // to keep this app online and not let it go to sleep
}, 280000);

BotClient.on('error', console.error);

BotClient.on('ready', () => console.log('Launched!'));

BotClient.login(BotConfig.token);
