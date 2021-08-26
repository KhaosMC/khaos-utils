module.exports = {
    description: 'Chat messages',
    run: async (data, chatbridge, client, config) => {
        // Parse message to prevent discord markdown
        const discordMD = ['`', '*', '_', '~~', '||'];
        let message = data.payload.message;
        discordMD.forEach(char => {
            message = message.replace(char, `\\${char}`)
        });

        client.channels.cache.get(chatbridge.channel_id).send(`[${data.source.name}] <${data.payload.user.name}> ${message}`);
    }
}