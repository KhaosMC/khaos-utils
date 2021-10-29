module.exports = {
    description: 'guildMemberLeave event',
    run: async (client, config, socket, db, member) => {
        // Timeout for 300ms incase things weren't updated properly
        setTimeout(() => {}, 300);
        // Check if there's a welcome channel
        const welcomeChannel = member.guild.systemChannel;
        if (!welcomeChannel) return;
        // Check if the user was kicked
        const auditLog = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
            user: member
        }).catch();
        if (auditLog.target.id === member.user.id) return;

        welcomeChannel.send(`o/n't ${member.user.tag}`);
    }
}