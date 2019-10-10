const Discord = module.require('discord.js');
const fs = require('fs');
let reminderfile = require("../variables/reminder.json");

module.exports.run = async (bot, message, args) => {
  let command = args[0];
  let timeInput = args[1];
  if (!timeInput){timeInput = 1}
  let frequency = args[2];
  if (!frequency){frequency = 0.166667}
  var timeup = frequency * 3600000
  let reminderName = args[3];
  if (!reminderName){reminderName = "Unnamed"}
  let time = timeInput * 3600000

  if (timeup > time/2) {var timeup = time/2};

  if (!reminderfile[message.author.id]) {
      reminderfile[message.author.id] = {
          status: "Off"
      };
  }

  let curstatus = reminderfile[message.author.id].status;

  if (command == "help"){
    message.channel.send(`Usage: +reminder set (hours from now) (time up message frequency in hours) (one word name)`);
    message.channel.send(`Example: +reminder set 0.5 0.166667 Webwork-CA116`);
    message.channel.send(`This example would make a reminder called "Webwork-CA116" that will go off in 30 mins and once it goes off will, repeat every 10 mins untill turned off.`);
    message.channel.send(`Currently you can set one reminder per person.`);
    return;
  }

  if(command == "stop"){if(curstatus == "On"){
    reminderfile[message.author.id].status = "Off"
      let reminderEmbed = new Discord.RichEmbed()
      .setTitle("REMINDER STOPPED!")
      .setAuthor(message.author.username)
      .setColor("#0094FF")
      .addField("Reminder Stopped", "Now you can now set another!", true)
      .setFooter(`You can now set another!`, message.author.displayAvatarURL);
  message.author.send(reminderEmbed);}
  else{
  message.channel.send("Reminder is not set!");
  }}

  if (command == "set"){if(curstatus == "Off"){
    reminderfile[message.author.id].status = "On"
      let reminderEmbed = new Discord.RichEmbed()
      .setTitle("REMINDER SET!")
      .setAuthor(message.author.username)
      .setColor("4CFF00")
      .addField("Reminder " + reminderName + " Set For:", timeInput + " Hours", true)
      .setFooter(`Stop the reminder using +reminder stop`, message.author.displayAvatarURL);
  message.author.send(reminderEmbed);
  let curstatus = reminderfile[message.author.id].status;
  await sleep(time/2);

  if(curstatus == "On"){
    let gainEmbed = new Discord.RichEmbed()
    .setTitle("HALF TIME!")
    .setAuthor("Reminder: " + reminderName)
    .setColor("FF6A00")
    .addField("It has been ", timeInput/2 + " Hours!", true)
    .setFooter(`Thats half of the time gone!`, bot.user.avatarURL);
    message.author.send(gainEmbed);}
    else{return}
    await sleep((time/2) - timeup);

  var interval = setInterval(reminderfunction, timeup);
  function reminderfunction() {
    curstatus = reminderfile[message.author.id].status;
  if (curstatus == "On"){
        let gainEmbed = new Discord.RichEmbed()
        .setTitle("TIMES UP!")
        .setAuthor("Reminder: " + reminderName)
        .setColor("FF0000")
        .addField("It has been ", timeInput + " Hours already!", true)
        .setFooter(`Times up!`, bot.user.avatarURL);
        message.author.send(gainEmbed);}
  else {
        clearInterval(interval);
      }
  }
}
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
