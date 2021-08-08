const chatbridge = JSON.parse(require('fs').readFileSync('./config/chatbridge.json'))

module.exports = {
    description: 'Ready event',
    run: async (client, socket, message) => {
        var errors = []
        // websocket related
        if (message.channel.id == chatbridge.channel_id && !(message.author.bot)) {
            try {
                const data = {
                    "type": "chat_message",
                    "targets": [],
                    "user": {
                        "id": message.author.id,
                        "name": message.author.username,
                        "display_color": message.author.display_color
                    },
                    "message": message.content
                };
                socket.send(JSON.stringify(data));
            } catch (err) {
                errors.push(err)
            }
        }

        
    }
}