const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Unbans a user from the guild',
    usage: '[user id]',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: 'BAN_MEMBERS',
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        // Check permission and if person specified a user
        const toUnban = await bot.client.users.fetch(args[0]);
        if(!toUnban) return message.channel.send("You need to specify a user!").then(msg => setTimeout(() => msg.delete()), 5000);
        // Setup embeds to be sent in staff channel and to the user
        const staffEmbed = new MessageEmbed()
        .setTitle(`${toUnban.tag} unbanned!`)
        .setColor(0x00ff00)
        .setDescription(`${toUnban.tag} was unbanned by ${message.author.tag}`)
        .setTimestamp();

        // Try to kick, else state that it failed.
        try {
            await message.guild.members.unban(toUnban.id);
        } catch {
            return message.channel.send("Failed to unban user. Maybe bad permissions?").then(msg => setTimeout(() => msg.delete()), 5000);
        }
        message.guild.channels.cache.get(bot.config.staffChannel).send({embeds :[staffEmbed]});
        message.channel.send(`Successfully unbanned ${toUnban.tag}`);
    }
}