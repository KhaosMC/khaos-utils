const { MessageEmbed } = require('discord.js');


module.exports = {
    description: 'Help command',
    usage: '(command group)',
    commandGroup: 'help',
    requiredRole: null,
    guildOnly: false,
    requireManageGuild: false,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        var allCommands = [];
        var title;
        for (i = 0; i < commands.length; i++) {
            const command = require(`./${commands[i] + '.js'}`)
            if (args[0] != null) {
                title = `Commands in group ${args[0]}!`
                if ((command.requireRole == null || message.member.roles.cache.get(command.requiredRole)) && args[0] == command.commandGroup) {
                    allCommands.push(`${config.prefix}${commands[i]} ${command.usage} - ${command.description}`);
                }
            } else {
                title = 'Help command!'
                if (command.requireRole == null || message.member.roles.cache.get(command.requiredRole)) {
                    allCommands.push(`${config.prefix}${commands[i]} ${command.usage} - ${command.description}`);
                }
            }
        }
        const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(allCommands)
        .setFooter('[] = required, () = optional')
        .setColor(message.guild.me.displayColor)

        message.channel.send(embed);
    }
}