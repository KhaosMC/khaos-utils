const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Purges an amount of messages.',
    usage: '[amount]',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: false,
    requiredPermission: 'MANAGE_MESSAGES',
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        const amount = parseInt(args[0]) + 1;
        if (!amount || amount == 0) return message.channel.send("Invalid amount!").then(msg => msg.delete({timeout: 5000}));
        // Setup the amount of times you can delete 100
        const ranges = Math.floor(amount / 100);
        // Delete for every 100 messages
        for (i = 0; i < ranges; i++) {
            message.channel.bulkDelete(i * 100)
            .catch(err => message.channel.send(`${err} occured`)).then(msg => msg.delete({timeout:5000}));
            setTimeout(() => {}, 5000); 
        }
        // Delete if there is a left over amount that is not divisible by 100
        if (amount % 100 !== 0) message.channel.bulkDelete(amount % 100)
        .catch(err => message.channel.send(`${err} occured`)).then(msg => msg.delete({timeout:5000}));
        // Send embed and then delete the message
        const embed = new MessageEmbed()
        .setTitle(`Delete ${amount - 1} messages.`)
        .setColor(0x00ff00)
        .setThumbnail(message.author.avatarURL())
        .setDescription(`Requested by ${message.author.tag}`)
        .setTimestamp();
        
        message.channel.send(embed).then(msg => msg.delete({timeout:5000}));
    }
}