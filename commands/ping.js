const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const description = 'Check your ping to the bot';

module.exports = {
    description: description,
    usage: '',
    commandGroup: 'misc',
    requiredRole: null,
    guildOnly: false,
    requiredPermission: null,
    guildOwnerOnly: false,
    info: new SlashCommandBuilder()
        .setName('ping')
        .setDescription(description),
    run: async (bot, message, args) => {
        const embed = new MessageEmbed()
        .setTitle('Pong! 🏓')
        .setColor(0x32CD32)
        .setDescription(Date.now() - message.createdTimestamp + 'ms')
        .setFooter(message.author.tag, message.author.avatarURL());

        message.channel.send({embeds: [embed]});
    }
}
