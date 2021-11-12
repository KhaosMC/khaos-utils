const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Get info about server',
    usage: '',
    commandGroup: 'misc',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: null,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        // Randomize a color by randomizing between 0-2^24-1
        const color = Math.floor(Math.random() * (Math.pow(2, 24)) - 1);
        const age = Math.floor((Date.now() - message.guild.createdTimestamp) / (1000*60*60*24));
        const allMembers = message.guild.roles.cache.get(bot.config.memberRole).members.size;
        const activeMembers = allMembers - message.guild.roles.cache.get(bot.config.inactiveRole).members.size;
        const owner = await message.guild.fetchOwner();

        const embed = new MessageEmbed()
        .setTitle(message.guild.name)
        .setThumbnail(message.guild.iconURL())
        .setColor(color)
        .addField("Creation date", message.guild.createdAt.toString(), true)
        .addField("Age", `${age} days old`)
        .addField("Owner", owner.user.tag, true)
        .addField("Members", `${message.guild.memberCount}/${message.guild.maximumMembers}`, true)
        .addField("Minecraft Members", `${activeMembers}/${allMembers} active`, true)
        .addField("Emojis", message.guild.emojis.cache.size.toString(), true)
        .addField("Roles", message.guild.roles.cache.size.toString(), true)
        .setFooter(message.author.tag, message.author.avatarURL());

        message.channel.send({embeds: [embed]});
    }
}
