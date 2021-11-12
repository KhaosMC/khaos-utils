const { MessageEmbed } = require('discord.js');
const { fullMemberRole } = require('../config/config.json');

module.exports = {
    description: 'Declares inactive status',
    usage: '(reason)',
    commandGroup: 'utils',
    requiredRole: fullMemberRole,
    guildOnly: false,
    requiredPermission: null,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        message.delete();
        let reason = args.join(" ");
        //if they haven't specified a reason display this message
        if (!args) reason = 'Member did not specify reason';

        // Check if member doesn't have an inactive role, if they do give them the role.
        if (!(message.member.roles.cache.get(bot.config.inactiveRole))) {

            //message to be displayed about becoming inactive
            const embed = new MessageEmbed()
                .setTitle(`${message.author.username} has invoked inactive status!`)
                .setDescription(reason)
                .setFooter(message.author.tag, message.author.avatarURL())
                .setColor(message.guild.roles.cache.get(bot.config.inactiveRole).color)
                .setTimestamp();

            //display the new message about player becoming inactive
            message.guild.channels.cache.get(bot.config.memberChannel).send({embeds: [embed]});
            message.member.roles.add(bot.config.inactiveRole);
        } else {
            //message to be displayed about removing inactive status
            const embed = new MessageEmbed()
                .setTitle(`${message.author.username} has revoked inactive status!`)
                .setDescription(reason)
                .setColor(message.guild.roles.cache.get(bot.config.fullMemberRole).color)
                .setFooter(message.author.tag, message.author.avatarURL())
                .setTimestamp();
            //display the new message about player becoming active again
            message.guild.channels.cache.get(bot.config.memberChannel).send({embeds: [embed]});
            //remove inactive role
            message.member.roles.remove(bot.config.inactiveRole);
        }
    }
}
