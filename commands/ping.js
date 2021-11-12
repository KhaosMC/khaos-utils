const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Check your ping to the bot',
    usage: '',
    commandGroup: 'misc',
    requiredRole: null,
    guildOnly: false,
    requiredPermission: null,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        const embed = new MessageEmbed()
        .setTitle('Pong! 🏓')
        .setColor(0x32CD32)
        .setDescription(Date.now() - message.createdTimestamp + 'ms')
        .setFooter(message.author.tag, message.author.avatarURL());

        message.channel.send({embeds: [embed]});
    }
}
