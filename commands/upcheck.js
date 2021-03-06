var request = require("request");
var Utility = require("../utilfunctions/utility");

module.exports.run = async (bot, message, args) => {
	if (args.length == 0) {
            Utility.CmdExample(bot, message, "URL", "!upcheck redbrick.dcu.ie");
            return;
	}
	else if (args.length > 0) {
            request.post({
                url:     "https://faas.jamesmcdermott.ie/function/isitup",
                body:    args
            },
            function(error, response, body) {
                message.channel.send(Utility.Embedify(bot, body));
            }); 
        }
};