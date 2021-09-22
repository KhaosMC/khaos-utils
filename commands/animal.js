const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    description: 'Fetch image of an animal',
    usage: '(cat/dog/axolotl/fox/monkey)',
    commandGroup: 'misc',
    requiredRole: null,
    guildOnly: false,
    requireManageGuild: false,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        const supportedAnimals = [
            'axolotl',
            'cat',
            'dog',
            'fox',
            'monkey',
            'owl'
        ]
        async function fetchMedia(type) {
            const request = await fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=85d5d441375458df3dbe2bc67bdff8d9&tags=${type}&format=json&nojsoncallback=1`)
            .then(response => response.json());
            const rng = Math.floor(Math.random() * 100);
            const image = request.photos.photo[rng]
            const url = `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`

            const embed = new MessageEmbed()
            .setTitle(`${type} payload!`)
            .setImage(url)
            .setFooter("Image provied by Flickr")

            return embed;
        }
        switch (args[0]) {
            case supportedAnimals[0]: {
                const embed = await fetchMedia(supportedAnimals[0]);
                message.channel.send(embed)
                break;
            }
            case supportedAnimals[1]: {
                const embed = await fetchMedia(supportedAnimals[1]);
                message.channel.send(embed)
                break;
            }
            case supportedAnimals[2]: {
                const embed = await fetchMedia(supportedAnimals[2]);
                message.channel.send(embed)
                break;
            }
            case supportedAnimals[3]: {
                const embed = await fetchMedia(supportedAnimals[3]);
                message.channel.send(embed)
                break;
            }
            case supportedAnimals[4]: {
                const embed = await fetchMedia(supportedAnimals[4]);
                message.channel.send(embed)
                break;
            }
            case 'list': {
                const listOfSupported = new MessageEmbed()
                .setTitle("Supported animals!")
                .setDescription(supportedAnimals.join(', '))
                .setFooter(message.author.tag, message.author.avatarURL())

                message.channel.send(listOfSupported)
                break;
            }
            default: {
                const msg = await message.channel.send("Invalid animal! See `" + config.prefix + "animal list`.")
                setTimeout(() => {
                    msg.delete().catch();
                }, 5000);
            }
        }
    }
}
