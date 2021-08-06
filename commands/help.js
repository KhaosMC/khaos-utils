const { MessageEmbed } = require('discord.js');
module.exports = {
    description: 'Help command',
    usage: '',
    commandGroup: 'help',
    guildOnly: false,
    requireManageGuild: false,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        var allCommands = [];
        for (i = 0; i < commands.length; i++) {
            const command = require(`./${commands[i] + '.js'}`)
            allCommands.push(`${config.prefix}${commands[i]} ${command.usage} - ${command.description}`);
        }
        const embed = new MessageEmbed()
        .setTitle('Help command')
        .setDescription(allCommands)
        .setFooter(message.author.tag)
        .setColor(message.guild.me.displayColor)

        message.channel.send(embed);
    }
}