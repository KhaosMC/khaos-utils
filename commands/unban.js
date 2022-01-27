const { Permissions} = require('discord.js');

module.exports = {
    description: 'Unbans a user from the guild',
    usage: '[user id]',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: Permissions.FLAGS.BAN_MEMBERS,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        // Check permission and if person specified a user
        let toUnban;
        try{
            toUnban = await bot.client.users.fetch(args[0]);}
        catch {
            return message.channel.send("Something went wrong").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }
        if(!toUnban) return message.channel.send("You need to specify a user!").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);

        await bot.utils.removeBanWithLog(bot,message, toUnban, "Reasons not supported yet")
    }
}
