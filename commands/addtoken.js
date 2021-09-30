const fs = require('fs');

module.exports = {
    description: 'Adds token to database',
    usage: '[token]',
    commandGroup: 'applications',
    requiredRole: null,
    guildOnly: false,
    requiredPermission: "MANAGE_GUILD",
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        let log = []
        if (!args[0]) return message.channel.send('You need to input a token!');
        message.delete().catch();
        fs.appendFileSync('./logs/authTokens', `${args[0]}\n`, err => {
            if (err) log.push(err);
        })
        // display a massage that the token has been added
        message.guild.channels.cache.get(config.staffChannel).send(`${message.author.tag} added token ${args[0]}`);
        log.push(`${message.author.tag} added token ${args[0]}`)
        return error;
    }
}