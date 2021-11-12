const { MessageEmbed } = require('discord.js');
const { memberRole } = require ('../config/config.json');
// Declaration for emotes used in the polls
const agreeEmote = '780549171089637376';
const disagreeEmote = '780549170770870292';
const neutralEmote = '780548158068621355';
const optionEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

module.exports = {
    description: 'Start a poll',
    usage: '[options(2-9)] [title], (description), (url)',
    commandGroup: 'utils',
    requiredRole: memberRole,
    guildOnly: false,
    requiredPermission: null,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        message.delete().catch();
        // Declare constants
        const pollRelated = args.splice(1).join(' ').split(', ');
        const [options] = args;
        const [title, description, url] = pollRelated;
        // Verify that options & title is legitimate.
        if (!(options > 1 && options < 10)) return message.channel.send('Your poll option is too big!').then(msg => setTimeout(() => msg.delete(), 5000));
        if (!options) return message.channel.send("You're missing a poll option!").then(msg => setTimeout(() => msg.delete(), 5000));
        if (!title) return message.channel.send("You're missing a poll question!").then(msg => setTimeout(() => msg.delete(), 5000));
        // Create embed
        const embed = new MessageEmbed()
            .setTitle(title)
            .setColor(0x8DEEEE)
            .setFooter(message.author.username, message.author.avatarURL())
            .setTimestamp();
        // Add description if there is any
        if (description) {
            embed.setDescription(description);
        }
        // Add url if there is any
        if (url) {
            embed.setURL(url);
        }
        // Send poll message and wait for poll reactions
        let pollMsg = await message.guild.channels.cache.get(bot.config.pollChannel).send({embeds: [embed]});
        if (options === '2') {
            await pollMsg.react(agreeEmote);
            await pollMsg.react(disagreeEmote);
            await pollMsg.react(neutralEmote);
        } else {
            // Add reactions if there's multiple options
            for (let i = 0; i < options; i++) {
                await pollMsg.react(optionEmojis[i]).catch();
            }
            await pollMsg.react(neutralEmote);
        }
    }
}
