const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    description: 'Fetch image of an animal',
    usage: '(animal/list)',
    commandGroup: 'misc',
    requiredRole: null,
    guildOnly: false,
    requiredPermission: null,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        let log = [];

        const list = await fetch('https://raw.githubusercontent.com/KhaosMC/fetchables/main/animal-list.json').then(response => response.json());
        const supportedAnimals = list.animals
        
        if (supportedAnimals.includes(args[0])) {
            const request = await fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.flickrToken}&safe_search=&tags=${args[0]}&format=json&nojsoncallback=1`)
            .then(response => response.json());
            const rng = Math.floor(Math.random() * 100);
            const image = request.photos.photo[rng]
            const url = `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`

            const embed = new MessageEmbed()
            .setTitle(`${args[0]} payload!`)
            .setURL(url)
            .setImage(url)
            .setFooter("Image provied by Flickr, photos may not always relate to the animal.")

            message.channel.send({embeds: [embed]});
            log.push(`${message.author.tag} requested animal ${args[0]}`)
        } else if (args[0] === 'list') {
            const embed = new MessageEmbed()
            .setTitle("Supported animals!")
            .setDescription(supportedAnimals.join(', '))
            
            message.channel.send({embeds: embed})
        } else {
            message.channel.send("Unsupported animal! See `" + bot.config.prefix + "animal list`.").then(msg => {
                setTimeout(() => msg.delete().catch(), bot.config.deleteTimer);
            })
        }
    }
}
