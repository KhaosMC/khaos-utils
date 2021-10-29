module.exports = {
    description: 'guildMemberRemove event',
    run: async (client, config, socket, db, member) => {
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
        const targetId = auditLog.entries.first().target.id.catch();
        if (targetId === member.user.id.catch() && (Date.now() - auditLog.createdTimestamp) < 6000) return console.log(member.user.tag);
        // If so, send the goodbye message
        welcomeChannel.send(`o/n't ${member.user.tag}`);
    }
}