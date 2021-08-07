const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    description: 'Removes token from database',
    usage: '[token|all]',
    commandGroup: 'applications',
    requiredRole: null,
    guildOnly: false,
    requireManageGuild: true,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        //check if they've sent a token with the command, if not return and send a message that they need to input a token
        if (!args[0]) return message.channel.send('You need to input a token!');
        if (args[0] == 'all') return fs.writeFileSync('./logs/authTokens', '', message.channel.send('Removed all tokens'));

        var authTokens = fs.readFileSync('./logs/authTokens', 'UTF-8').split(/\r?\n/);
        //else remove the specified token in the array
        const index = authTokens.indexOf(args[0]);
        if (index > -1) {
            authTokens.splice(index, 1);
        }
        const logTokens = authTokens.join('\n')

        fs.writeFileSync('./logs/authTokens', logTokens, err => {
            if (err) return console.log(err)
        })
        //send message that the specified token has been removed
        message.guild.channels.cache.get(config.staffChannel).send(`Removed token ${args[0]}`);
        
        if (config.LoggingLevel > 0) { log(`${message.author.tag} removed token ${args[0]}`) }
    }
}