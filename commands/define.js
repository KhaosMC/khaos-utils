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
        let word = args[0];
        let definition = word ? await ub(args.join(' ')) : await ub.random();

        const embed = new MessageEmbed();
        .setTitle(definition.word);
        .setUrl(definition.urbanURL);
        .setDescription(definition.description)
        .addField('Example', definition.example)
        .addField('Author', definition.author)
        .setFooter(`👍 ${definition.thumbsUp} 👎 ${definition.thumbsDown}`);

        message.channel.send({embeds: [embed]});
    }
}
