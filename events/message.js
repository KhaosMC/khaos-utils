const chatbridge = JSON.parse(require('fs').readFileSync('./config/chatbridge.json'));
const fs = require('fs');
const commands = JSON.parse(fs.readFileSync('./config/commands.json'));

module.exports = {
    description: 'Ready event',
    run: async (client, config, socket, message) => {
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

        // Verify incoming applicationd
        let reactionEmojis = ['780549171089637376', '780549170770870292', '780548158068621355']
        if (message.channel == config.applicationChannel && commands.applications) {
            if (message.embeds[0] == undefined) return message.delete().catch();
            if (message.embeds.length == 0 && !(message.member.hasPermission('MANAGE_GUILD'))) return message.delete().catch();
            var attemptedAuthToken = message.embeds[0].fields[0].value.toString()
            var authTokens = fs.readFileSync('./logs/authTokens', 'UTF-8').split(/\r?\n/); 
            if (authTokens.includes(attemptedAuthToken) && (message.webhookID != null)) {
                await message.react(reactionEmojis[0]) // These 3 message.react() are for voting, remove them if you do not want them.
                await message.react(reactionEmojis[1])
                await message.react(reactionEmojis[2])
                const index = authTokens.indexOf(attemptedAuthToken);
                if (index > -1) {
                    authTokens.splice(index, 1);
                }
                const logTokens = authTokens.join('\n')
                fs.writeFileSync('./logs/authTokens', logTokens, err => {
                    if (err) return errors.push(err);
                })
            }
        }    
    }
}