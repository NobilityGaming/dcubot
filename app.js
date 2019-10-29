// DEPENDANCIES

const Discord = require('discord.js');
//const scores = require("./variables/scores.json");
//const reminderfile = require("./variables/reminder.json");
const fs = require('fs');
const express = require('express')
const app = express()
const http = require('http')
const request = require('request')
var bodyParser = require('body-parser')

//app.use(bodyParser.json());  

// MODULES

const BotConfig = require('./config.json')

// VARIABLES

const BotClient = new Discord.Client();
let port = process.env.PORT || 8080

// reminder + religion variable saving
/*BotClient.on('message', message => {

  fs.writeFile("./variables/reminder.json", JSON.stringify(reminderfile), (err) => {
    if (err) console.log(err)
  });

  if (message.content.startsWith(prefix)) return;
  if (message.author.bot) return;

  var scoreGainTeamOne = 0;
  let teamOneMemberCount = scores["team1"].members;
  let teamOneScore = scores["team1"].score;
  let scoreMultiplierTeamOne = Math.round(teamOneMemberCount * 1.2 * 10) / 10;

  var scoreGainTeamTwo = 0;
  let teamTwoMemberCount = scores["team2"].members;
  let teamTwoScore = scores["team2"].score;
  let scoreMultiplierTeamTwo = Math.round(teamTwoMemberCount * 1.2 * 10) / 10;

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

  if(message.member.roles.find(r => r.name === "Thomasites")){
    let scoreGainTeamOne = Math.round((scoreMultiplierTeamOne + teamOneScore) * 10) / 10;
    scores["team1"].score = scoreGainTeamOne;

    fs.writeFile("./variables/scores.json", JSON.stringify(scores), (err) => {
      if (err) console.log(err)
    });

    console.log("Thomasites score: " + scoreGainTeamOne + " score!");
  };

  if(message.member.roles.find(r => r.name === "Johnathists")){
    let scoreGainTeamTwo = Math.round((scoreMultiplierTeamTwo + teamTwoScore) * 10) / 10;
    scores["team2"].score = scoreGainTeamTwo;

    fs.writeFile("./variables/scores.json", JSON.stringify(scores), (err) => {
      if (err) console.log(err)
    });

    console.log("Johnathists score: " + scoreGainTeamTwo + " score!");
  };
});*/

//
//hi
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

app.post('/fetchtimetable', function (req, res) {
  let Timetable = require('./commands/timetable.js')

  Timetable.run(BotClient, null, null)
  .then(stuff => {
    request.post(
        'https://maker.ifttt.com/trigger/timetable/with/key/mZyk_-5pAj2Q1XJ-pC-vjCZJL2yiC9LZSPR0vWrsI1x',
        { json: { value1: stuff } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
              console.log(stuff)
              console.log(body);
            }
        }
    );
    res.sendStatus(200)
  })
})

app.post('/birthdayreminder', function (req, res) {
  let name = req.body.name

  if (!name) { return }

  let CADisc = BotClient.guilds.get('625718359270359051')
  BOTCHANNEL = CADisc.channels.get("625718359740383232")
  BOTCHANNEL.send(`It's ${name}'s Birthday today! :cake: :smile:`)

  res.sendStatus(200)
})

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

setInterval(() => {
http.get(`http://ca1dcu.herokuapp.com/`); // to keep this app online and not let it go to sleep
}, 280000);

BotClient.on('error', console.error);

BotClient.on('ready', () => console.log('Launched!'));

BotClient.login(BotConfig.token);
