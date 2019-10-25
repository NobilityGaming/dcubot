module.exports = {
    CmdExample: function(bot, message, required, example) {        
        message.channel.send(module.exports.Embedify(bot, `No ${required} supplied. Try ${example}`));
    },
    CmdErr: function(bot, message, example) {
        message.channel.send(module.exports.Embedify(bot, `Too many arguments supplied. Try ${example}`));
    },
    Embedify: function(bot, contents, color) {
        embedcolor = color || 0x36393e
	return {embed: 
            {
                color: embedcolor,
                description: contents,
                timestamp: new Date(),
                footer: {
                    icon_url: bot.user.avatarURL,
                    text: "CA1"
                }
            }
	};
    }
};