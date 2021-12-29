module.exports = {
    description: 'Chat messages',
    run: async (data, bot) => {
        // Parse message to prevent discord markdown
        const discordMD = ['`', '*', '_', '~~', '||'];
        let { message } = data.payload;
        discordMD.forEach(char => {
            message = message.replace(char, `\\${char}`)
        });

        bot.client.channels.cache.get(bot.chatbridge.channel_id).send(`[${data.source.name}] <${data.payload.user.name}> ${message}`, {disableMentions: "everyone"});
    }
}
