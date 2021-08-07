const { MessageEmbed } = require('discord.js');
const commandGroups = JSON.parse(require('fs').readFileSync('./config/commands.json'))

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
        var footer;
            if (args[0] != null) {
                title = `Commands in group ${args[0]}!`
                footer = '[] = required, () = optional'
                for (i = 0; i < commands.length; i++) {
                    const command = require(`./${commands[i] + '.js'}`)
                    if ((command.requireRole == null || message.member.roles.cache.get(command.requiredRole)) && args[0] == command.commandGroup) {
                        if (command.requireManageGuild && !(message.member.hasPermission('MANAGE_GUILD'))) {
                            break;
                        } else if (command.guildOwnerOnly && !(message.author == message.guild.owner)) {
                            break;
                        } else {
                            allCommands.push(`${config.prefix}${commands[i]} ${command.usage} - ${command.description}`);
                        }
                    }
                }
            } else {
                title = 'Command categories!'
                footer = `${config.prefix}help [command group] for commands inside each command group`
                allCommands = Object.keys(commandGroups)
            }
        const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(allCommands)
        .setFooter(footer)
        .setColor(message.guild.me.displayColor)

        message.channel.send(embed);
    }
}