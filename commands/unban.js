const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Unbans a user from the guild',
    usage: '[user id]',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: 'BAN_MEMBERS',
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        // Check permission and if person specified a user
        const toUnban = await client.users.fetch(args[0]);
        if(!toUnban) return message.channel.send("You need to specify a user!");
        // Setup embeds to be sent in staff channel and to the user
        const staffEmbed = new MessageEmbed()
        .setTitle(`${toUnban.tag} unbanned!`)
        .setColor(0x00ff00)
        .setDescription(`${toUnban.tag} was unbanned by ${message.author.tag}`)
        .setTimestamp();

        // Try to kick, else state that it failed.
        try {
            message.guild.members.unban(toUnban.id);
        } catch {
            let msg = await message.channel.send("Failed to unban user. Maybe bad permissions?")
            .setTimeout(() => {
                msg.delete().catch();
            }, 5000)
            return;
        }
        message.guild.channels.cache.get(config.staffChannel).send(staffEmbed);
        message.channel.send("Success!");
    }
}