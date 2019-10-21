var request = require("request");
var Utility = require("../utilfunctions/utility");

function luasScheduleBuilder(body) {
    try {
        var stopName = JSON.parse(body).stop;
        var directions = JSON.parse(body).direction;
        var schedule = "";
        schedule += "Stop Name: " + stopName + "\n\n";
        for(var direction in directions){
            var details = directions[direction];
            schedule += "> " + details.name + "\n";
            for (var tram in details.tram) {
                var journey = "";
                var mins = details.tram[tram].dueMins;
                var destination = details.tram[tram].destination;
                if (mins != undefined && destination != undefined) {
                    if (mins == "DUE") {
                        journey += "   • " + destination + " - " + mins + "\n";
                    } else {
                        journey += "   • " + destination + " - " + mins + " mins\n";
                    }
                } else {
                        journey += "   • No trams forecast\n";
                }
                schedule += journey;
            }
        }
        return schedule;
    } catch (err) {
        return "That stop doesn't exist.";
    }
}

module.exports.run = async (bot, message, args) => {
        if (args.length == 0) {
            Utility.CmdExample(bot, message, "stop", "!luas Sandymount");
            return;
        }
        else if (args.length > 0) {
            request.post({
                url:     "https://faas.jamesmcdermott.ie/function/transport",
		body:    "127.0.0.1:8000/luas/stop/" + args
            },
            function(error, response, body) {
                var schedule = luasScheduleBuilder(body);
		        message.channel.send(Utility.Embedify(bot, schedule));
            });
	}
};