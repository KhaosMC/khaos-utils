const WebSocket = require('ws');

module.exports = function handleWebsocket(bot) {
    bot.websocketFiles = bot.fs.readdirSync('./websocket').filter(file => file.endsWith('.js'));
    console.log(`Loading ${bot.websocketFiles.length} websocket event(s)`);

    let events = new Map();
    for (i = 0; i < bot.websocketFiles.length; i++) {
        events.set(bot.websocketFiles[i].replace('.js', ''), require(`../websocket/${bot.websocketFiles[i]}`));
    }
    
    bot.socket.on('open', function() {
        const authData = {
            "type": "auth",
            "token": process.env.chatbridgeToken,
            "client": {
                "type": "Discord", //.client_type,
                "name": "Testbot",
                "color": bot.chatbridge.color
            }
        }
        bot.socket.send(JSON.stringify(authData));
        
	setTimeout(() => {
    	const requestOnlinePlayers = {
            "type": "request",
            targets: [],
            payload: {
                type: "user_list",
                request: {}
            	}
        }
        bot.socket.send(JSON.stringify(requestOnlinePlayers));
	}, 3000);
	bot.onlinePlayers = {};
    });

    bot.socket.on('close', function(data, reason) {
        bot.socket = new WebSocket(process.env.chatbridgeUrl);
    })

    bot.socket.on('message', async data => {
        data = JSON.parse(data);
        if (!data.type) return;
        if(!events.has(data.type)) return;
        const event = events.get(data.type);
        await event.run(data, bot).catch(err => bot.logger.log(err, event,bot));;
    })

    bot.socket.on('error', async err => {
        console.log(err)
    })
}

