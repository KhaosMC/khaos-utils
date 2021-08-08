module.exports = {
    description: 'User events',
    run: async (data, chatbridge, client, config) => {
        // Send message when user (dis)connects
        if (data.payload.type == 'connection') {
            client.channels.cache.get(chatbridge.channel_id).send(`[${data.source.name}] ${data.payload.event.message}`)
        }

    }
}