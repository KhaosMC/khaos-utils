const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Check your ping to the bot',
    usage: '',
    commandGroup: 'ping',
    requiredRole: null,
    guildOnly: false,
    requireManageGuild: false,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        const embed = new MessageEmbed()
        .setTitle('Pong! 🏓')
        .setColor(0x32CD32)
        .setDescription(Date.now() - message.createdTimestamp + 'ms')
        .setFooter(message.author.tag, message.author.avatarURL());

        message.channel.send(embed);
    }
}