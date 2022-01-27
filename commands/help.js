const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Help command',
    usage: '(command group)',
    commandGroup: 'help',
    requiredRole: null,
    guildOnly: false,
    requiredPermission: null,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        let allCommands = [];
        let title = args[0] ? `Commands in group ${args[0]}`: "Command categories!";
        let footer = args[0] ? '[] = required, () = optional' : `${bot.config.prefix}help [command group] for commands inside each command group`;
            if (args[0]) {
                bot.commands.forEach((value, commandName, commands) => {
                    const command = commands.get(commandName);

                    if ((command.requiredRole === null || message.member.roles.cache.get(command.requiredRole)) && args[0] === command.commandGroup) {
                        if (command.requiredPermission !== null && !(message.member.permissions.has(command.requiredPermission)));
                        else if ((command.guildOwnerOnly && message.author !== message.guild.owner) ||  !bot.commandsConfig[command.commandGroup]);
                        else {
                            allCommands.push(`${bot.config.prefix}${commandName} ${command.usage} - ${command.description}`)
                        }
                    }
                })
            } else {
                allCommands = Object.keys(bot.commandsConfig)
            }
        // Message if user doesn't have any available commands in a command group.
        if (allCommands.length === 0) allCommands.push("There are no commands available for you in this group.");

        const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(allCommands.join("\n"))
        .setFooter(footer)
        .setColor(message.guild.me.displayColor)

        message.channel.send({embeds: [embed]});
    }
}
