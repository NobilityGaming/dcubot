module.exports.run = async (bot, message, args) => {
    const newmessage = await message.channel.send("Fetching ping!");
    newmessage.edit(`Bot Latency: ${newmessage.createdTimestamp - message.createdTimestamp}ms. API Latency: ${Math.round(bot.ping)}ms`);
}