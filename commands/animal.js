const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    description: 'Fetch image of an animal',
    usage: '(cat/dog/axolotl)',
    commandGroup: 'misc',
    requiredRole: null,
    guildOnly: false,
    requireManageGuild: false,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        switch (args[0]) {
            case 'cat': {
                const catRequest = await fetch(`https://api.thecatapi.com/v1/images/search?mime_types=gif`, {
                    headers: { 'x-api-key' : config.catApiToken }
                }).then(response => response.json());
                const catEmbed = new MessageEmbed()
                .setTitle('Cat payload!')
                .setImage(catRequest[0].url)
                .setFooter(message.author.tag, message.author.avatarURL())
    
                message.channel.send(catEmbed)
                break;
            }
            case 'dog': {
                const dogRequest = await fetch(`https://dog.ceo/api/breeds/image/random`).then(response => response.json());
                const dogEmbed = new MessageEmbed()
                .setTitle('Dog payload!')
                .setImage(dogRequest.message)
                .setFooter(message.author.tag, message.author.avatarURL())

                message.channel.send(dogEmbed)
                break;
            }
            case 'axolotl': {
                const axolotlRequest = await fetch ('https://axoltlapi.herokuapp.com/').then(response => response.json());
                const axolotlEmbed = new MessageEmbed()
                .setTitle('Axolotl payload!')
                .setImage(axolotlRequest.url)
                .setFooter(message.author.tag, message.author.avatarURL())

                message.channel.send(axolotlEmbed)
                break;
            }
            default: {
                const msg = message.channel.send("Invalid animal!")
                setTimeout(() => {
                    msg.delete().catch();
                }, 5000);
            }
        }
    }
}
