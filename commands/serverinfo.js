const { MessageEmbed } = require('discord.js');
const { memberRole, inactiveRole } = require ('../config/config.json')

module.exports = {
    description: 'Get info about server',
    usage: '',
    commandGroup: 'misc',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: null,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        // Randomize a color by randomizing between 0-2^24-1
        const color = Math.floor(Math.random() * (Math.pow(2, 24)) - 1);
        const age = Math.floor((Date.now() - message.guild.createdTimestamp) / (1000*60*60*24));
        const allMembers = message.guild.roles.cache.get(memberRole).members.size;
        const activeMembers = allMembers - message.guild.roles.cache.get(inactiveRole).members.size;

        const embed = new MessageEmbed()
        .setTitle(message.guild.name)
        .setThumbnail(message.guild.iconURL())
        .setColor(color)
        .addField("Creation date", message.guild.createdAt, true)
        .addField("Age", `${age} days old`)
        .addField("Owner", message.guild.owner.user.tag, true)
        .addField("Members", `${message.guild.memberCount}/${message.guild.maximumMembers}`, true)
        .addField("Minecraft Members", `${activeMembers}/${allMembers} active`, true)
        .addField("Emojis", message.guild.emojis.cache.size, true)
        .addField("Roles", message.guild.roles.cache.size, true)
        .addField("Region", message.guild.region, true)
        .setFooter(message.author.tag, message.author.avatarURL());

        message.channel.send(embed)
    }
}
