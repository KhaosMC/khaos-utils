module.exports = {
    description: 'guildMemberAdd event',
    run: async (client, config, socket, member) => {
        const welcomeChannel = member.guild.systemChannelID;
        if (!welcomeChannel) return;
        client.channels.cache.get(welcomeChannel).send('o/');
    }
}