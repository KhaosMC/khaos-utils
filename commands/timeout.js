const { MessageEmbed, Permissions} = require('discord.js');
const ms = require("ms");

module.exports = {
    description: 'Puts the user in a timeout',
    usage: '[user] (reason)',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: Permissions.FLAGS.MODERATE_MEMBERS,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        // Check permission and if person specified a user
        const toTimeout = message.mentions.members.first() || bot.client.users.cache.get(args[0]);
        const duration = ms(args[1]);
        if (!duration) return message.channel.send("You need to specify a duration!").then(msg => setTimeout(() => msg.delete()),bot.config.deleteTimer);
        const reason = args[2] ? args.slice(2).join(" ") : "Unknown";
        const member = message.guild.members.resolve(toMute);
        if(!member) return message.channel.send("You need to specify a user!").then(msg => setTimeout(() => msg.delete()),bot.config.deleteTimer);
        if(member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return message.channel.send("You can't timeout another staff member!").then(msg => setTimeout(() => msg.delete()), 5000);

        await bot.utils.timeoutUserWithLog(bot, message, member, reason, duration)
    }
}
