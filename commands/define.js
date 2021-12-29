const { MessageEmbed } = require('discord.js');
const ud = require("relevant-urban");

module.exports = {
    description: 'Get a definition from urbandictionary',
    usage: '(word)',
    commandGroup: 'misc',
    requiredRole: null,
    guildOnly: false,
    requiredPermission: null,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        const word = args[0];
        const definition = word ? await ud(args.join(' ')) : await ud.random();
        const embed = new MessageEmbed()
        .setTitle(definition.word)
        .setURL(definition.urbanURL)
        .setDescription(definition.definition)
        .addField('Example', definition.example)
        .addField('Author', definition.author)
        .setFooter(`👍 ${definition.thumbsUp} 👎 ${definition.thumbsDown}`);

        message.channel.send({embeds: [embed]});
    }
}
