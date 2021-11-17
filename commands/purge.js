const { MessageEmbed, Permissions} = require('discord.js');

module.exports = {
    description: 'Purges an amount of messages.',
    usage: '[amount]',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: false,
    requiredPermission: Permissions.FLAGS.MANAGE_MESSAGES,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        const amount = parseInt(args[0]) + 1;
        if (!amount || amount == 0 || amount > 10000) return message.channel.send("Invalid amount!").then(msg => {
            setTimeout(() => msg.delete().catch(), bot.config.deleteTimer)
        });
        // Setup the amount of times you can delete 100
        const ranges = Math.floor(amount / 100);
        // Delete for every 100 messages
        for (i = 0; i < ranges; i++) {
            message.channel.bulkDelete(i * 100)
            .catch(err => message.channel.send(`${err} occured`)).then(msg => {
                setTimeout(() => msg.delete(), bot.config.deleteTimer);
            });
            setTimeout(() => {}, 5000); 
        }
        // Delete if there is a left over amount that is not divisible by 100
        if (amount % 100 !== 0) message.channel.bulkDelete(amount % 100)
        .catch(err => message.channel.send(`${err} occured`)).then(msg => {
            setTimeout(() => msg.delete(), bot.config.deleteTimer);
        });
        // Send embed and then delete the message
        const embed = new MessageEmbed()
        .setTitle(`Delete ${amount - 1} messages.`)
        .setColor(0x00ff00)
        .setThumbnail(message.author.avatarURL())
        .setDescription(`Requested by ${message.author.tag}`)
        .setTimestamp();
        
        message.channel.send({embeds: [embed]}).then(msg => {
            setTimeout(() => msg.delete(), bot.config.deleteTimer);
        });
    }
}
