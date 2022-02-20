const { MessageEmbed, Permissions} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const description = 'Lists all tokens in database'

module.exports = {
    description: description,
    usage: '',
    commandGroup: 'applications',
    requiredRole: null,
    guildOnly: false,
    requiredPermission: Permissions.FLAGS.MANAGE_GUILD,
    guildOwnerOnly: false,
    info: new SlashCommandBuilder()
        .setName('listtokens')
        .setDescription(description),
    run: async (bot, message, args) => {
        const authTokens = bot.fs.readFileSync('./logs/authTokens', 'UTF-8');
        const embed = new MessageEmbed()
        .setTitle('All tokens in database')
        .setColor(message.guild.me.displayColor)
        .setDescription(authTokens)
        .setFooter(bot.utils.getCommandUser(message).tag, bot.utils.getCommandUser(message).avatarURL())

        await bot.utils.replyEmbed(message, embed)

    }
}
