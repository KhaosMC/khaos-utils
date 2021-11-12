const WebSocket = require('ws');

module.exports = function handleWebsocket(bot) {
    bot.websocketFiles = bot.fs.readdirSync('./websocket').filter(file => file.endsWith('.js'));
    console.log(`Loading ${websocketFiles.length} websocket event(s)`);

    var events = new Map();
    for (i = 0; i < bot.websocketFiles.length; i++) {
        events.set(bot.websocketFiles[i].replace('.js', ''), require(`../websocket/${websocketFiles[i]}`));
    }

    socket.on('open', function() {
        const authData = {
            "type": "auth",
            "token": process.env.chatbridgeToken,
            "client": {
                "type": bot.chatbridge.client_type,
                "name": bot.chatbridge.client_name,
                "color": bot.chatbridge.color
            }
        }
        socket.send(JSON.stringify(authData));
    });

    socket.on('close', function() {
        socket = new WebSocket(process.env.chatbridgeUrl);
    })

    socket.on('message', async data => {
        data = JSON.parse(data);
        if (!data.type) return;
        if(!events.has(data.type)) return;
        const event = events.get(data.type);
        
        await event.run(data, bot);
    })

    socket.on('err', async err => log(err))
}
