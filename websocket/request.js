module.exports = {
    description: 'Response packets',
    run: async (data, bot) => {
        switch (data.payload.type) {
            case 'user_list': {
            	bot.onlinePlayers[data.source.name] = data.payload.response;
            	console.log(bot.onlinePlayers);
            	break;
            }
            default: {
                break;
            }
        }
    }
}
