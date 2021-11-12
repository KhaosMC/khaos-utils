module.exports = {
    description: 'guildMemberAdd event',
    run: async (bot, member) => {
        const welcomeChannel = member.guild.systemChannel;
        if (!welcomeChannel) return;
        welcomeChannel.send('o/');
        if (member.user.id === '378515510259744769') {
            member.roles.add('763793938221629500')
        }
    }
}
