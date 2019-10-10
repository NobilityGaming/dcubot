const Discord = require('discord.js');
let scores = require("./variables/scores.json");
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
  };
});

client.on('message', message => {
if (message.content.startsWith(prefix)) return;
if (message.author.bot) return;
if (!scores["team1"]) {
    scores["team1"] = {
        members: 0,
        score: 0
    };
}
if (!scores["team2"]) {
    scores["team2"] = {
        members: 0,
        score: 0
    };
}

var scoreGainTeamOne = 0;
let teamOneMemberCount = scores["team1"].members;
let teamOneScore = scores["team1"].score;
let scoreMultiplierTeamOne = Math.round(teamOneMemberCount * 1.2 * 10) / 10;

var scoreGainTeamTwo = 0;
let teamTwoMemberCount = scores["team2"].members;
let teamTwoScore = scores["team2"].score;
let scoreMultiplierTeamTwo = Math.round(teamTwoMemberCount * 1.2 * 10) / 10;

if(message.member.roles.find(r => r.name === "Thomasites")){
let scoreGainTeamOne = Math.round((scoreMultiplierTeamOne + teamOneScore) * 10) / 10;
scores["team1"].score = scoreGainTeamOne;
fs.writeFile("./variables/scores.json", JSON.stringify(scores), (err) => {
            if (err) console.log(err)});
console.log("Thomasites score: " + scoreGainTeamOne + " score!");
};

if(message.member.roles.find(r => r.name === "Johnathists")){
let scoreGainTeamTwo = Math.round((scoreMultiplierTeamTwo + teamTwoScore) * 10) / 10;
scores["team2"].score = scoreGainTeamTwo;
fs.writeFile("./variables/scores.json", JSON.stringify(scores), (err) => {
            if (err) console.log(err)});
console.log("Johnathists score: " + scoreGainTeamTwo + " score!");
};

});

client.on('error', console.error);

client.on('ready', () => console.log('Launched!'));

//login
client.login('');
