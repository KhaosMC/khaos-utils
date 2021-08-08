module.exports = {
    description: 'Ready event',
    run: async (client, socket) => {
        client.user.setActivity('over Khaos Applications', {
            type: "WATCHING"
        })
        const data = {
            "type": "client_connection",
            "targets": [],
        }

        // websocket related
        try {
            socket.send(JSON.stringify(data));
        } catch {

        } 
    }
}