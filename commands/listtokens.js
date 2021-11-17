const { MessageEmbed, Permissions} = require('discord.js');

module.exports = {
    description: 'Lists all tokens in database',
    usage: '',
    commandGroup: 'applications',
    requiredRole: null,
    guildOnly: false,
    requiredPermission: Permissions.FLAGS.MANAGE_GUILD,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        let authTokens = bot.fs.readFileSync('./logs/authTokens', 'UTF-8');
        const embed = new MessageEmbed()
        .setTitle('All tokens in database')
        .setColor(message.guild.me.displayColor)
        .setDescription(authTokens)
        .setFooter(message.author.tag, message.author.avatarURL())
        message.channel.send({embeds: [embed]});

    }
}
