const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const servers = JSON.parse(require('fs').readFileSync('./config/servers.json'));

module.exports = {
    description: 'Get status of servers',
    usage: '(server name)',
    commandGroup: 'status',
    requiredRole: null,
    guildOnly: false,
    requireManageGuild: false,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        if (servers.serverIps.length != servers.serverNames.length) return message.channel.send('Amount of server names and ips are not the same!')
        if (args[0] == null) {
            let statusMsg = await message.channel.send('Retreiving server status..')
            let descriptions = ''
            // Fetch status for each individual server.
            n = 0
            for (i = 0; i < servers.serverIps.length; i++) {
                var link = 'https://api.mcsrvstat.us/simple/' + servers.serverIps[n]
                await fetch(link).then(function(response) {
                    descriptions = response.status == '200' ? descriptions + (servers.serverNames[n] + ': Online ✅\n') : descriptions + (servers.serverNames[n] + ': Offline ❌\n');
                        n = n + 1
                    })
            }
            const embed = new MessageEmbed()
            .setTitle('Minecraft Server Status!')
            .setDescription(descriptions)
            .setColor(message.guild.me.displayColor)
            .setFooter(message.author.tag, message.author.avatarURL())
            .setTimestamp();
            statusMsg.edit('', embed);
        } else {
            serverName = args[0].charAt(0).toUppercase() + args[0].slice(1).toLowerCase();
            if (!serverNames.includes(serverName)) return;
            let statusMsg = await message.channel.send('Retreiving server status..')
            let description = '';
            for (i = 0; i < serverNames.length; i++) {
                if (serverNames[i] == serverName) return description = serverName + 'is online ✅'
            }
            const embed = new MessageEmbed()
            .setTitle('Minecraft Server Status!')
            .setDescription(descriptions)
            .setColor(message.guild.me.displayColor)
            .setFooter(message.author.tag, message.author.avatarURL())
            .setTimestamp();
            statusMsg.edit('', embed);
        }
    }
}