const {Permissions} = require("discord.js");
module.exports = {
    description: 'Removes token from database',
    usage: '[token|all]',
    commandGroup: 'applications',
    requiredRole: null,
    guildOnly: false,
    requiredPermission: Permissions.FLAGS.MANAGE_GUILD,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        //check if they've sent a token with the command, if not return and send a message that they need to input a token
        if (!args[0]) return message.channel.send('You need to input a token!').then(msg => setTimeout(() => msg.delete(), bot.config.deleteTimer));
        message.delete().catch();
        if (args[0] === 'all') return bot.fs.writeFileSync('./logs/authTokens', '', message.guild.channels.cache.get(bot.config.staffChannel).send(`${message.author.tag} removed all tokens`));

        let authTokens = bot.fs.readFileSync('./logs/authTokens', 'UTF-8').split(/\r?\n/);
        //else remove the specified token in the array
        const index = authTokens.indexOf(args[0]);
        if (index > -1) {
            authTokens.splice(index, 1);
        }
        const logTokens = authTokens.join('\n')

        bot.fs.writeFileSync('./logs/authTokens', logTokens, err => {
            if (err) return console.log(err)
        })
        //send message that the specified token has been removed
        message.guild.channels.cache.get(bot.config.staffChannel).send(`${message.author.tag} removed token ${args[0]}`);
        
    }
}
