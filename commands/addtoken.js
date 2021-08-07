const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    description: 'Adds token to database',
    usage: '[token]',
    commandGroup: 'applications',
    requiredRole: null,
    guildOnly: false,
    requireManageGuild: true,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        if (!args[0]) return message.channel.send('You need to input a token!');
        var authTokens = fs.readFileSync('./logs/authTokens', 'UTF-8').split(/\r?\n/);
        if (authTokens[0] == '') { authTokens.slice(1) }
        // else push the new token to the authTokens array
        authTokens.push(args[0]);
        const logTokens = authTokens.join('\n')
        fs.writeFileSync('./logs/authTokens', logTokens, err => {
            if (err) return console.log(err)
        })
        // display a massage that the token has been added
        message.guild.channels.cache.get(config.staffChannel).send(`Added token ${args[0]}`);
    }
}