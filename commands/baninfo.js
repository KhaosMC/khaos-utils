const { MessageEmbed, Permissions} = require('discord.js');

module.exports = {
    description: 'Lists info about someones ban',
    usage: '[user id]',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: Permissions.FLAGS.BAN_MEMBERS,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        // Fetch member and validate
        const member = await bot.client.users.fetch(args[0]);
        if (!member) return message.channel.send("You need to specify a user!").then(msg => setTimeout(() => msg.delete()),bot.config.deleteTimer);
        // Fetch all bans and get the mentioned members
        const bannedMember = await message.guild.bans.fetch(member.id);
        if (!bannedMember) return message.channel.send("User is not banned.").then(msg => setTimeout(() => msg.delete()),bot.config.deleteTimer);
        if (!bannedMember.reason) bannedMember.reason = 'Unknown';
        // Create embed with info and send it
        const embed = new MessageEmbed()
        .setTitle(member.id)
        .setColor(0xff0000)
        .addField('User', bannedMember.user.tag)
        .addField('Reason', bannedMember.reason)
        .setTimestamp();

        message.channel.send({embeds: [embed]});
    }
}
