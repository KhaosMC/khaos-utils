const { Permissions} = require('discord.js');

module.exports = {
    description: 'Kicks a user from the guild',
    usage: '[user] (reason)',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: Permissions.FLAGS.KICK_MEMBERS,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        // Check permission and if person specified a user
        const toKick = message.mentions.members.first() || bot.client.users.cache.get(args[0]);
        let reason = args.slice(1).join(" ");
        if (!reason) reason = 'Unknown';
        const member = message.guild.members.resolve(toKick);
        if(!member) return message.channel.send("You need to specify a user!").then(msg => setTimeout(() => msg.delete()),bot.config.deleteTimer);
        if(member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.channel.send("You can't kick another staff member!").then(msg => setTimeout(() => msg.delete()), 5000);

        await bot.utils.kickUserWithLog(bot, message, member, reason)
    }
}
