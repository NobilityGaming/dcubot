var Utility = require("../utilfunctions/utility");

module.exports.run = async (bot, message, args) => {
    let RoleID = args[0]
    let members_of_role = message.guild.roles.get(RoleID).members.map()
    message.channel.send(Utility.Embedify(bot, `Role contains ${members_of_role.length} members.`))
}