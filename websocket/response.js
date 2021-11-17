module.exports = {
    description: 'Request events',
    run: async (data, bot) => {
        switch (data.payload.type) {
            case 'user_list':
            	if (data.source.type.toLowerCase() !== 'minecraft') return;
            	bot.onlinePlayers[data.source.name] = data.payload.response.user_list;
            	break;
        }

    }
}
