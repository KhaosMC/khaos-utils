const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Lists info about someones ban',
    usage: '[user id]',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: 'BAN_MEMBERS',
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        // Fetch member and validate
        const member = await client.users.fetch(args[0]);
        if (!member) return message.channel.send("You need to specify a user!");
        // Fetch all bans and get the mentioned members
        const guildBans = await message.guild.fetchBans();
        const bannedMember = guildBans.get(member.id);
        if (!bannedMember) return message.channel.send("User is not banned.");
        // Create embed with info and send it
        const embed = new MessageEmbed()
        .setTitle(member.id)
        .setColor(0xff0000)
        .setDescription(`${bannedMember.user.tag} was banned for ${bannedMember.reason}`)
        .setTimestamp();

        message.channel.send(embed);
    }
}