module.exports = {
    description: 'guildMemberAdd event',
    run: async (client, config, socket, db, member) => {
        const welcomeChannel = member.guild.systemChannel;
        if (!welcomeChannel) return;
        welcomeChannel.send('o/');
    }
}