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
        let toUnban;
        try{
            toUnban = await bot.client.users.fetch(args[0]);}
        catch {
            return message.channel.send("Something went wrong").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }
        if(!toUnban) return message.channel.send("You need to specify a user!").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        // Setup embeds to be sent in staff channel and to the user
        const staffEmbed = new MessageEmbed()
        .setTitle(`${toUnban.tag} unbanned!`)
        .setColor(0x00ff00)
        .addField('User', toUnban.tag)
        .addField('Author', message.author.tag)
        .setTimestamp();

        // Try to kick, else state that it failed.
        try {
            await message.guild.members.unban(toUnban.id);
        } catch {
            return message.channel.send("Failed to unban user. Maybe bad permissions?").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }
        message.guild.channels.cache.get(bot.config.staffChannel).send({embeds :[staffEmbed]});
        message.channel.send(`Successfully unbanned ${toUnban.tag}`);
    }
}
