module.exports = {
    description: 'guildMemberRemove event',
    run: async (bot, member) => {
        // Timeout for 300ms incase things weren't updated properly
        setTimeout(() => {}, 1000);
        // Check if there's a welcome channel
        const welcomeChannel = member.guild.systemChannel;
        if (!welcomeChannel) return;
        // Check if the user was banned
        const bans = await member.guild.fetchBans();
        const bansArray = Array.from(bans.keys());
        if (bansArray.includes(member.user.id)) return;
        // Check if the user was kicked
        const auditLog = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });
        let targetId = 0
        let auditLogTimestamp = 0
        if (auditLog.entries.size !== 0) { 
            targetId = auditLog.entries.first().target.id.catch();
            auditLogTimestamp = auditLog.entries.first().createdTimestamp.catch();
        }
        if (targetId === member.user.id.catch() && (Date.now() - auditLogTimestamp) < 6000) return console.log(member.user.tag);

        // If not, send the goodbye message
        welcomeChannel.send(`o/n't ${member.user.tag}`);
    }
}
