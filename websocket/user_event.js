module.exports = {
    description: 'User events',
    run: async (data, chatbridge, client, config) => {
        switch (data.payload.type) {
            case 'connection':
                // Send message when user (dis)connects on minecraft
                if (data.source.type == 'minecraft') {
                    if (data.payload.event.connect) {
                        client.channels.cache.get(chatbridge.channel_id).send(`[${data.source.name}] ${data.payload.user.name} joined the game`)
                    } else if (!data.payload.event.connect) {
                        client.channels.cache.get(chatbridge.channel_id).send(`[${data.source.name}] ${data.payload.user.name} left the game`)
                    }
                }
                break;
        }

    }
}