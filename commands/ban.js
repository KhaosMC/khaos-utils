const { Permissions } = require('discord.js');

module.exports = {
    description: 'Bans a user from the guild',
    usage: '[user] (reason)',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: Permissions.FLAGS.BAN_MEMBERS,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        // Check permission and if person specified a user
        const toBan = message.mentions.members.first() || bot.client.users.cache.get(args[0]);
        const reason = args[1] ? args.slice(1).join(" ") : "Unknown";
        const member = message.guild.members.resolve(toBan);
        if(!member) return message.channel.send("You need to specify a user!").then(msg => setTimeout(() => msg.delete()),bot.config.deleteTimer);
        if(member.permissions.has('BAN_MEMBERS')) return message.channel.send("You can't ban another staff member!").then(msg => msg.delete({timeout: bot.config.deleteTimer}));
        if(member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.channel.send("You can't ban another staff member!").then(msg => setTimeout(() => msg.delete()),bot.config.deleteTimer);

        // calls a function which bans the user and do then call another function for logging
        await bot.utils.createBanWithLog(bot, message, member, reason)
    }
}
