const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Kicks a user from the guild',
    usage: '[user] (reason)',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: 'KICK_MEMBERS',
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        // Check permission and if person specified a user
        const toKick = message.mentions.members.first() || client.users.cache.get(args[0]);
        const reason = args.slice(1).join(" ");
        const member = message.guild.members.resolve(toKick);
        if(!member) return message.channel.send("You need to specify a user!");
        // Setup embeds to be sent in staff channel and to the user
        const staffEmbed = new MessageEmbed()
        .setTitle(`Member kicked!`)
        .setColor(0xff0000)
        .setDescription(`${member.user.tag} was kicked by ${message.author.tag} for ${reason}`)
        .setTimestamp();

        const userEmbed = new MessageEmbed()
        .setTitle(`You've been kicked from ${message.guild.name}!`)
        .setColor(0xff0000)
        .setDescription(`For ${reason}`)
        .setTimestamp();

        await member.send(userEmbed).catch();
        // Try to kick, else state that it failed.
        try {
            member.kick({reason: reason});
        } catch {
            let msg = await message.channel.send("Failed to kick user. Maybe bad permissions?")
            .setTimeout(() => {
                msg.delete().catch();
            }, 5000)
            return;
        }
        message.guild.channels.cache.get(config.staffChannel).send(staffEmbed);
        message.channel.send("Success!");
    }
}