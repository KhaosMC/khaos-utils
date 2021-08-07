const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Declares inactive status',
    usage: '(reason)',
    commandGroup: 'inactive',
    requiredRole: '760393585408999467',
    guildOnly: false,
    requireManageGuild: false,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        message.delete().catch();
        let reason = args.join(" ");
        //if they haven't specified a reason display this message
        if (!args) reason = 'Member did not specify reason';

        // Check if member doesn't have an inactive role, if they do give them the role.
        if (!(message.member.roles.cache.get(config.inactiveRole))) {

            //message to be displayed about becoming inactive
            const embed = new MessageEmbed()
                .setTitle(`${message.author.username} has invoked inactive status!`)
                .setDescription(reason)
                .setFooter(message.author.tag, message.author.avatarURL())
                .setColor(message.guild.roles.cache.get(config.inactiveRole).color)
                .setTimestamp();

            //display the new message about player becoming inactive
            message.guild.channels.cache.get(config.memberChannel).send(embed);
            message.member.roles.add(config.inactiveRole);
        } else {
            //message to be displayed about removing inactive status
            const embed = new MessageEmbed()
                .setTitle(`${message.author.username} has revoked inactive status!`)
                .setDescription(reason)
                .setColor(message.guild.roles.cache.get(config.fullMemberRole).color)
                .setFooter(message.author.tag, message.author.avatarURL())
                .setTimestamp();
            //display the new message about player becoming active again
            message.guild.channels.cache.get(config.memberChannel).send(embed);
            //remove inactive role
            message.member.roles.remove(config.inactiveRole);
        }
    }
}