const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Check all the players online',
    usage: '',
    commandGroup: 'chatbridge',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: null,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        const servers = Object.keys(bot.onlinePlayers);
        const onlinePlayers = []
        let i = 0;
        servers.forEach(server  => {
            const serversPlayers = [];
            bot.onlinePlayers[server].forEach(user => {
                serversPlayers.push(user.name)
            });
            onlinePlayers.push(`${servers[i]}: ${serversPlayers.join(', ')}`);
            i++;
        });

        const embed = new MessageEmbed()
        .setTitle('Currently online players!')
        .setDescription(onlinePlayers.join('\n'))
        .setColor(message.guild.me.displayColor)
        .setTimestamp();

        message.channel.send({embeds: [embed]});
    }
}
