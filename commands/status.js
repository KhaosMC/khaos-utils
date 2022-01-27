const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    description: 'Get status of servers',
    usage: '(server name)',
    commandGroup: 'utils',
    requiredRole: null,
    guildOnly: false,
    requiredPermission: null,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        servers = {
            serverIps: process.env.serverIps.split(","),
            serverNames: process.env.serverNames.split(",")
        }
        if (servers.serverIps.length !== servers.serverNames.length) return message.channel.send('Amount of server names and ips are not the same!').then(msg => msg.delete({timeout: 5000}));
        if (!args[0]) {
            const statusMsg = await message.channel.send('Retreiving server status..')
            let descriptions = ''
            // Fetch status for each individual server.
            for (let i = 0; i < servers.serverIps.length; i++) {
                await fetch(`https://api.mcsrvstat.us/simple/${servers.serverIps[i]}`).then(res => {
                    const status = res.ok ? 'Online ✅' : 'Offline ❌';
                    descriptions += `${servers.serverNames[i]}: ${status}\n`;
                });
            }
            const embed = new MessageEmbed()
            .setTitle('Minecraft Server Status!')
            .setDescription(descriptions)
            .setColor(message.guild.me.displayColor)
            .setFooter(message.author.tag, message.author.avatarURL())
            .setTimestamp();
            statusMsg.edit({embeds: [embed]});
        } else {
            /*
            serverName = args[0].charAt(0).toUppercase() + args[0].slice(1).toLowerCase();
            if (!serverNames.includes(serverName)) return;
            let statusMsg = await message.channel.send('Retreiving server status..')
            let description = '';
            for (i = 0; i < serverNames.length; i++) {
                if (serverNames[i] === serverName) return description = serverName + 'is online ✅'
            }
            const embed = new MessageEmbed()
            .setTitle('Minecraft Server Status!')
            .setDescription(descriptions)
            .setColor(message.guild.me.displayColor)
            .setFooter(message.author.tag, message.author.avatarURL())
            .setTimestamp();
            statusMsg.edit('', embed); */
        }
    }
}
