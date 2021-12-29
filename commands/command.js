const { MessageEmbed, Permissions} = require('discord.js');

module.exports = {
    description: 'Enable/disable commands',
    usage: '[subcmd] (target)',
    commandGroup: 'commands',
    requiredRole: null,
    guildOnly: false,
    requiredPermission: Permissions.FLAGS.MANAGE_GUILD,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        const subcmd = args[0];
        const target = args[1];
        if (!subcmd) {
            message.channel.send("Available subcommands: disable, enable, list");
            return;
        }

        switch (subcmd) {
            case 'list': {
                const enabled = [];
                const disabled = [];
                const groups = Object.keys(bot.commandsConfig)
                groups.forEach(group => {
                    if (bot.commandsConfig[group]) enabled.push(group);
                    else disabled.push(group);
                })
                const embed = new MessageEmbed()
                .addField('Enabled groups', enabled.join(', '))
                .addField('Disabled groups', disabled.join(', '))
                .setTimestamp()

                message.channel.send({embeds: [embed]});
                break;
            }
            case 'enable': {
                if (!Object.keys(bot.commandsConfig).includes(target)) return;
                bot.commandsConfig[target] = true;
            	bot.fs.writeFileSync('./config/commands.json', JSON.stringify(bot.commandsConfig, null, 2), err => {
                    if (err) throw err;
            	});
            	message.channel.send(`Successfully enabled ${target} command group`);
            	break;
            }
            case 'disable': {
                if (!bot.commandsConfig[target]) return;
                bot.commandsConfig[target] = false;
            	bot.fs.writeFileSync('./config/commands.json', JSON.stringify(bot.commandsConfig, null, 2), err => {
                    if (err) throw err;
            	});
            	message.channel.send(`Successfully disabled ${target} command group`);
            	break;
            }
        }
    }
}
