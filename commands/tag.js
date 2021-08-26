const { MessageEmbed } = require('discord.js');
const tags = JSON.parse(require('fs').readFileSync('./config/tags.json'));

module.exports = {
    description: 'get a tag',
    usage: '[tag number]',
    commandGroup: 'tag',
    requiredRole: null,
    guildOnly: false,
    requireManageGuild: false,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        if (!args[0] || tags.tags[args[0]-1] === undefined) {
            let descriptionsText = ''
            for(i = 0; i < tags.descriptions.length; i++) {
                descriptionsText += `${i+1}) ${tags.tags[i]}\n`
            }
            const embed1 = new MessageEmbed()
            .setTitle('Currently available tags')
            .setDescription(descriptionsText)
            .setColor(message.guild.me.displayColor)
            .setFooter(message.author.tag, message.author.avatarURL())

            message.channel.send(embed1)
        } else {
            // Create an embed showing who authored the command and what tag it is, then send it.
            const embed = new MessageEmbed()
            .setTitle(`${tags.tags[args[0]-1]} (Tag ${args[0]})`)
            .setDescription(tags.descriptions[args[0]-1])
            .setColor(message.guild.me.displayColor)
            .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
            
            message.channel.send(embed) 
        }
    }
}