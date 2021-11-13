const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Kicks a user from the guild',
    usage: '[user] (reason)',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: 'KICK_MEMBERS',
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        // Check permission and if person specified a user
        const toKick = message.mentions.members.first() || bot.client.users.cache.get(args[0]);
        let reason = args.slice(1).join(" ");
        if (!reason) reason = 'Unknown';
        const member = message.guild.members.resolve(toKick);
        if(!member) return message.channel.send("You need to specify a user!").then(msg => setTimeout(() => msg.delete()),bot.config.deleteTimer);
        if(member.permissions.has('KICK_MEMBERS')) return message.channel.send("You can't kick another staff member!").then(msg => setTimeout(() => msg.delete()), 5000);
        // Setup embeds to be sent in staff channel and to the user
        const staffEmbed = new MessageEmbed()
        .setTitle(`Member kicked!`)
        .setColor(0xff0000)
        .addField('User', member.user.tag)
        .addField('Reason', reason)
        .setTimestamp();

        const userEmbed = new MessageEmbed()
        .setTitle(`You've been kicked from ${message.guild.name}!`)
        .setColor(0xff0000)
        .setDescription(`For ${reason}`)
        .setTimestamp();

        await member.send({embeds :[userEmbed]}).catch();
        // Try to kick, else state that it failed.
        try {
            await member.kick({reason: reason});
        } catch {
            return message.channel.send("Failed to kick user. Maybe bad permissions?").then(msg => setTimeout(() => msg.delete()),bot.config.deleteTimer);
        }
        message.guild.channels.cache.get(bot.config.staffChannel).send({embeds :[staffEmbed]});
        message.channel.send(`Successfully kicked ${member.user.tag}`);
    }
}
