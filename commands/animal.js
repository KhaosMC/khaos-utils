const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    description: 'Fetch image of an animal',
    usage: '(animal/list)',
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
            'owl',
            'panda',
            'tiger',
            'duck',
            'bear',
            'lion',
            'chicken',
            'goldfish',
        ]

        if (supportedAnimals.includes(args[0])) {
            const request = await fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=85d5d441375458df3dbe2bc67bdff8d9&safe_search=&tags=${args[0]}&format=json&nojsoncallback=1`)
            .then(response => response.json());
            const rng = Math.floor(Math.random() * 100);
            const image = request.photos.photo[rng]
            const url = `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`

            const embed = new MessageEmbed()
            .setTitle(`${args[0]} payload!`)
            .setURL(url)
            .setImage(url)
            .setFooter("Image provied by Flickr, photos may not always relate to the animal.")

            message.channel.send(embed);
        } else if (args[0] === 'list') {
            const embed = new MessageEmbed()
            .setTitle("Supported animals!")
            .setDescription(supportedAnimals.join(', '))
            
            message.channel.send(embed)
        } else {
            const msg = await message.channel.send("Unsupported animal! See `" + config.prefix + "animal list`.")
            setTimeout(() => {
                msg.delete().catch();
            }, 5000);
        }
    }
}
