const WebSocket = require('ws');

module.exports = function handleWebsocket(client, config, chatbridge, socket, fs, log) {
    const eventFiles = fs.readdirSync('./websocket').filter(file => file.endsWith('.js'));
    console.log(`Loading ${eventFiles.length} websocket event(s)`);

    var events = new Map();
    for (i = 0; i < eventFiles.length; i++) {
        events.set(eventFiles[i].replace('.js', ''), require(`../websocket/${eventFiles[i]}`));
    }

    socket.on('open', function() {
        const authData = {
            "type": "auth",
            "token": chatbridge.auth_token,
            "client": {
                "type": chatbridge.client_type,
                "name": chatbridge.client_name
            }
        }
        socket.send(JSON.stringify(authData));
    });

    socket.on('close', function() {
        socket = new WebSocket(chatbridge.server_url);
    })

    socket.on('message', async data => {
        if (!data.type) return;
        if(!events.includes(data.type)) return;
        const event = events.get(data.type);
        
        const toLog = await event.run(client, message, args, commands, config);
        if (toLog == undefined) return;
        toLog.forEach(string => {
            log(string, `websocket event ${command}`);
        })
    })

    socket.on('err', async err => log(err))
}