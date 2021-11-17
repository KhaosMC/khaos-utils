const { MessageEmbed, Permissions} = require('discord.js');

module.exports = {
    description: 'Bans a user from the guild',
    usage: '[user] (reason)',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: Permissions.FLAGS.BAN_MEMBERS,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        // Check permission and if person specified a user
        const toKick = message.mentions.members.first() || bot.client.users.cache.get(args[0]);
        let reason = args.slice(1).join(" ");
        if (!reason) reason = 'Unknown';
        const member = message.guild.members.resolve(toKick);
        if(!member) return message.channel.send("You need to specify a user!").then(msg => setTimeout(() => msg.delete()),bot.config.deleteTimer);
        if(member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.channel.send("You can't ban another staff member!").then(msg => setTimeout(() => msg.delete()),bot.config.deleteTimer);
        // Setup embeds to be sent in staff channel and to the user
        const staffEmbed = new MessageEmbed()
        .setTitle(`Member banned!`)
        .setColor(0xff0000)
        .addField('User', member.user.tag)
        .addField('Author', message.author.tag)
        .addField('Reason', reason)
        .setTimestamp();

        const userEmbed = new MessageEmbed()
        .setTitle(`You've been banned from ${message.guild.name}!`)
        .setColor(0xff0000)
        .setDescription(`For ${reason}`)
        .setTimestamp();



        await member.send({embeds : [userEmbed]}).catch(err => console.log(err));
        // Try to kick, else state that it failed.
        try {
            await member.ban({reason: reason});
        } catch {
            return message.channel.send("Failed to ban user. Maybe bad permissions?").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }

        message.guild.channels.cache.get(bot.config.staffChannel).send({embeds :[staffEmbed]});
        message.channel.send(`Successfully banned ${member.user.tag}`);
    }
}
