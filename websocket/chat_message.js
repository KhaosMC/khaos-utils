module.exports = {
    description: 'Chat messages',
    run: async (data, chatbridge, client, config) => {
        client.channels.cache.get(chatbridge.channel_id).send(`[${data.source.name}] <${data.payload.user.name}> ${data.payload.message}`)
    }
}