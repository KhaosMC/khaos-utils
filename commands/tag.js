const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'get a tag',
    usage: '[tag number]',
    commandGroup: 'misc',
    requiredRole: null,
    guildOnly: false,
    requiredPermission: null,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        if (!args[0] || bot.tags.tags[args[0]-1] === undefined) {
            let descriptionsText = ''
            for(let i = 0; i < bot.tags.descriptions.length; i++) {
                descriptionsText += `${i+1}) ${bot.tags.tags[i]}\n`
            }
            const embed1 = new MessageEmbed()
            .setTitle('Currently available tags')
            .setDescription(descriptionsText)
            .setColor(message.guild.me.displayColor)
            .setFooter(message.author.tag, message.author.avatarURL())

            message.channel.send({embeds: [embed1]});
        } else {
            // Create an embed showing who authored the command and what tag it is, then send it.
            const embed = new MessageEmbed()
            .setTitle(`${bot.tags.tags[args[0]-1]} (Tag ${args[0]})`)
            .setDescription(bot.tags.descriptions[args[0]-1])
            .setColor(message.guild.me.displayColor)
            .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
            
            message.channel.send({embeds: [embed]}); 
        }
    }
}
