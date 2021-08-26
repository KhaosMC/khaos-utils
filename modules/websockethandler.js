const WebSocket = require('ws');

module.exports = function handleWebsocket(client, config, chatbridge, socket, fs, log) {
    const eventFiles = fs.readdirSync('./websocket').filter(file => file.endsWith('.js'));
    console.log(`Loading ${eventFiles.length} websocket event(s)`);

    let events = new Map();
    for (i = 0; i < eventFiles.length; i++) {
        events.set(eventFiles[i].replace('.js', ''), require(`../websocket/${eventFiles[i]}`));
    }

    socket.on('open', function() {
        const authData = {
            "type": "auth",
            "token": chatbridge.auth_token,
            "client": {
                "type": chatbridge.client_type,
                "name": chatbridge.client_name,
                "color": chatbridge.color
            }
        }
        socket.send(JSON.stringify(authData));
    });

    socket.on('close', function() {
        socket = new WebSocket(chatbridge.server_url);
    })

    socket.on('message', async data => {
        data = JSON.parse(data);
        if (!data.type) return;
        if(!events.has(data.type)) return;
        const event = events.get(data.type);
        
        const toLog = await event.run(data, chatbridge, client, config);
        if (toLog === undefined) return;
        toLog.forEach(string => {
            log(string, `websocket event ${command}`);
        })
    })

    socket.on('err', async err => log(err))
}