module.exports = {
    description: 'User events',
    run: async (data, bot) => {
        switch (data.payload.type) {
            case 'connection':
                // Send message when user (dis)connects on minecraft
                if (data.source.type == 'minecraft') {
                    if (data.payload.event.connect) {
                        bot.client.channels.cache.get(bot.chatbridge.channel_id).send(`[${data.source.name}] ${data.payload.user.name} joined the game`);
                        bot.onlinePlayers[data.source.name].push(data.payload.user);
                    } else if (!data.payload.event.connect) {
                        bot.client.channels.cache.get(bot.chatbridge.channel_id).send(`[${data.source.name}] ${data.payload.user.name} left the game`)
                        const index = bot.onlinePlayers[data.source.name].indexOf(data.payload.user);
                        if (index > -1) bot.onlinePlayers[data.source.name].splice(index, 1);
                    }
                }
                break;
        }

    }
}
