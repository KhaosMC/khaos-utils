const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { fullMemberRole } = require('../config/config.json');


module.exports = {
    description: 'Send application link with valid token in channel',
    usage: '',
    commandGroup: 'applications',
    requiredRole: fullMemberRole,
    guildOnly: false,
    requiredPermission: null,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        if(!fs.existsSync('./logs/authTokens')) {
            fs.closeSync(fs.openSync('./logs/authTokens', 'w'));
        }

        let authTokens = fs.readFileSync('./logs/authTokens', 'UTF-8').split(/\r?\n/);
        if (authTokens[0] === '') { authTokens.slice(1) }
        // Generate new auth token
        let newAuthToken = require('crypto').randomBytes(32).toString('hex');
        // If the token already exists create a new one
        if (authTokens.includes(newAuthToken)) {
            newAuthToken = require('crypto').randomBytes(32).toString('hex');
        }
        // Push the new token to an array and create string to write to database
        authTokens.push(newAuthToken);
        const logTokens = authTokens.join('')

        fs.writeFileSync('./logs/authTokens', logTokens, err => {
            if (err) return console.log(err)
        })
        // Embed the new token to a message
        const embed = new MessageEmbed()
            .setTitle('Click here to apply!')
            .setURL(bot.config.applicationURL + newAuthToken)
            .setDescription('Authentication token is included in the URL, your application will not work without it.')
            .setColor(0x00ff40)
            .setFooter(message.author.tag, message.author.avatarURL());

        // Embed another message which says who created the apply form and the token
        const embed2 = new MessageEmbed()
            .setTitle('New Token Generated!')
            .setDescription(newAuthToken)
            .setColor(0xff7f50)
            .setFooter(`Generated by ${message.author.tag} in #${message.channel.name}`, message.author.avatarURL());

        // Send the first embed to the same channel the command was called
        message.channel.send({embeds :[embed]});
        // Send the second embed to the staff channel
        message.guild.channels.cache.get(bot.config.staffChannel).send({embeds :[embed2]});
    }
}