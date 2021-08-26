const { MessageEmbed } = require('discord.js');
const { memberRole } = require('./config/config.json');
module.exports = {
    description: 'Start a poll',
    usage: '[options(2-9)] [title], (description), (url)',
    commandGroup: 'poll',
    requiredRole: memberRole,
    guildOnly: false,
    requireManageGuild: false,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        let reactionEmojis = ['780549171089637376', '780549170770870292', '780548158068621355'] // Agree, disagree, neutral
        // Delete message and check for arguments, setup & check time and create embed for question.
        message.delete().catch();
                
        if (!(args[0] > 1 && args[0] < 10)) return message.channel.send('Your poll option is too big!');

        if (!args[0]) return message.channel.send("You're missing a poll option!");

        let pollRelated = args.splice(1).join(' ').split(', ');

        if (!pollRelated[0]) return message.channel.send("You're missing a poll question!");
        const embed = new MessageEmbed()
            .setTitle(pollRelated[0])
            .setColor(0x8DEEEE)
            .setFooter(message.author.username, message.author.avatarURL())
            .setTimestamp();

        // Add description if there is any
        if (pollRelated[1]) {
            embed.setDescription(pollRelated[1]);
        }
        // Add url if there is any
        if (pollRelated[2]) {
            embed.setURL(pollRelated[2]);
        }
        // Send poll message and wait for poll reactions
        let pollMsg = await message.guild.channels.cache.get(config.pollChannel).send(embed);
        if (args[0] === 2) {
            await pollMsg.react(reactionEmojis[0]);
            await pollMsg.react(reactionEmojis[1]);
            await pollMsg.react(reactionEmojis[2]);
        } else {
            // Add reactions if there's multiple options
            let optionEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
            for (let i = 0; i < args[0]; i++) {
                await pollMsg.react(optionEmojis[i]).catch();
            }
            await pollMsg.react(reactionEmojis[2]);
        }
    }
}