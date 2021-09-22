const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    description: 'Fetch image of an animal',
    usage: '(cat/dog/axolotl/fox)',
    commandGroup: 'misc',
    requiredRole: null,
    guildOnly: false,
    requireManageGuild: false,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        function getEmbed(type, media) {
            const embed = new MessageEmbed()
            .setTitle(`${type} payload!`)
            .setImage(media)
            .setFooter(message.author.tag, message.author.avatarURL())

            return embed
        }

        switch (args[0]) {
            case 'cat': {
                const catRequest = await fetch(`https://api.thecatapi.com/v1/images/search?mime_types=gif`, {
                    headers: { 'x-api-key' : config.catApiToken }
                }).then(response => response.json());
                message.channel.send(getEmbed('cat', catRequest[0].url))
                break;
            }
            case 'dog': {
                const dogRequest = await fetch(`https://dog.ceo/api/breeds/image/random`).then(response => response.json());
                message.channel.send(getEmbed('dog', dogRequest.message))
                break;
            }
            case 'axolotl': {
                const axolotlRequest = await fetch('https://axoltlapi.herokuapp.com/').then(response => response.json());
                message.channel.send(getEmbed('axolotl', axolotlRequest.url))
                break;
            }
            case 'fox': {
                const foxRequest = await fetch('https://randomfox.ca/floof/').then(response => response.json())
                message.channel.send(getEmbed('fox', foxRequest.image))
                break;
            }
            default: {
                const msg = await message.channel.send("Invalid animal! See `" + config.prefix + "help misc`.")
                setTimeout(() => {
                    msg.delete().catch();
                }, 5000);
            }
        }
    }
}
