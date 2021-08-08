module.exports = {
    description: 'Ready event',
    run: async (client, socket) => {
        client.user.setActivity('over Khaos Applications', {
            type: "WATCHING"
        })
        
        // websocket related
        const data = {
            "type": "client_connection",
            "targets": [],
        }
        try {
            socket.send(JSON.stringify(data));
        } catch {

        } 
    }
}