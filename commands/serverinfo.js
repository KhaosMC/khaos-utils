const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Get info about server',
    usage: '',
    commandGroup: 'misc',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: null,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        const color = parseInt(Math.floor(Math.random() * (Math.pow(2, 24)) - 1), 10);

        const embed = new MessageEmbed()
        .setTitle(message.guild.name)
        .setThumbnail(message.guild.iconURL())
        .setColor(color)
        .addField("Creation date", message.guild.createdAt, true)
        .addField("Owner", message.guild.owner.user.tag, true)
        .addField("Members", message.guild.memberCount, true)
        .addField("Emojis", message.guild.emojis.cache.size, true)
        .addField("Roles", message.guild.roles.cache.size, true)
        .setFooter(message.author.tag, message.author.avatarURL());

        message.channel.send(embed)
    }
}