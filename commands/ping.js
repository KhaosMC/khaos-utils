const { MessageEmbed, Message} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {isApplicationCommandGuildInteraction} = require("discord-api-types/utils");
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
        const isSlashCommand =!(message instanceof Message)
        const embed = new MessageEmbed()
        .setTitle('Pong! 🏓')
        .setColor(0x32CD32)
        .setDescription(Date.now() - message.createdTimestamp + 'ms')
        .setFooter(bot.utils.getCommandUser(message,isSlashCommand).tag, bot.utils.getCommandUser(message,isSlashCommand).avatarURL());

        await bot.utils.replyEmbed(message,isSlashCommand, embed)
    }
}
