const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    description: 'Lists all tokens in database',
    usage: '',
    commandGroup: 'applications',
    requiredRole: null,
    guildOnly: false,
    requireManageGuild: true,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        let authTokens = fs.readFileSync('./logs/authTokens', 'UTF-8');
        // const logTokens = authTokens.join('')
        const embed = new MessageEmbed()
        .setTitle('All tokens in database')
        .setColor(message.guild.me.displayColor)
        .setDescription(authTokens)
        .setFooter(message.author.tag, message.author.avatarURL())
        message.channel.send(embed)

    }
}