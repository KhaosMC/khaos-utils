const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    description: 'Fetch image of an animal',
    usage: '(cat)',
    commandGroup: 'misc',
    requiredRole: null,
    guildOnly: false,
    requireManageGuild: false,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        if (args[0] === 'cat') {
            const catRequest = await fetch(`https://api.thecatapi.com/v1/images/search?mime_types=gif`, {
                headers: { 'x-api-key' : config.catApiToken }
            }).then(response => response.json());
            const embed = new MessageEmbed()
            .setTitle('Cat payload!')
            .setImage(catRequest[0].url)
            .setFooter(message.author.tag, message.author.avatarURL())

            message.channel.send(embed)
        }
    }
}
