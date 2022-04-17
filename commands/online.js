const { MessageEmbed } = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const description = 'Check all the players online'

module.exports = {
    description: description,
    usage: '',
    commandGroup: 'chatbridge',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: null,
    guildOwnerOnly: false,
    info: new SlashCommandBuilder()
        .setName('online')
        .setDescription(description),
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

        await bot.utils.replyEmbed(message, embed)
    }
}
