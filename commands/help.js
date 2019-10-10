var Utility = require("../utilfunctions/utility");

module.exports.run = async (bot, message, args) => {
	if (args.length > 1) {
		message.channel.send(Utility.Embedify(bot, "Please specify one single command. Try `!help [command]`"));
	} else if (args.length == 1) {
            switch (args[0]) {
                case "bus":
                    message.channel.send(Utility.Embedify(bot, "bus - check the schedule of a Dublin Bus stop.\n\nExample: '!bus 1635'\n\nThe nearest bus stops to DCU are 7516 (The Helix) and 37 (Ballymun Road)"));
                    break;
                case "upcheck":
                    message.channel.send(Utility.Embedify(bot, "isitup - check if a site is up or down.\n\nExample: '!isitup redbrick.dcu.ie'"));
                    break;
                /*case "room":
                    message.channel.send(Utility.Embedify(bot, "room - provides timetable information for a specified room or building in DCU.\n\nExample: '!room GLA.LG26'"));
                    break;*/
                case "weather":
                    message.channel.send(Utility.Embedify(bot, "weather - check the weather forecast by location.\n\nExample '!weather DCU'"));
                    break;
                case "class":
                    message.channel.send(Utility.Embedify(bot, "class - check the timetable for a specified course and a class **x** hours from now.\n\nExample: '!class info COURSE_CODE HOURS_FROM_NOW \nExample: '!class info CA1 3'"));
                    break;
            }
        } else {
            message.channel.send(Utility.Embedify(bot, "The following commands are available: \n • help\n • upcheck\n • bus\n • weather\n • class"));
        }
};