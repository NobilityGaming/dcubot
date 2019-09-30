const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

const prefix = '+'

//listener event
client.on('message', message => {

  let args = message.content.slice(prefix.lenght).trim().split(' ');
  let cmd = args.shift().toLowerCase();

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  try {

    delete require.cache[require.resolve(`./commands/${cmd}.js`)]

    let commandFile = require(`./commands/${cmd}.js`)
    commandFile.run(client, message, args);

  } catch (e) {
    console.log(e.stack);
  }
});


client.on('error', console.error);

client.on('ready', () => console.log('Launched!'));

//login
client.login('NjI2ODUyMzgxNDMwMTIwNDk4.XY0KIg.U-roAzBmqmnxeeK0WeBSscAdifY');
