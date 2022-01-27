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
        const toUnban = args[0] ? await bot.client.users.fetch(args[0]) : undefined;
        if (!toUnban) return message.channel.send("Something went wrong! Maybe incorrect user or they're not banned?").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);

        await bot.utils.removeBanWithLog(bot,message, toUnban, "Reasons not supported yet")
    }
}
