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
                var messagePayload = message.content;
                // Parse mentioned users from <@id> to @username
                var mentionedUsers = message.mentions.members;
                mentionedUsers.forEach(user => {
                    messagePayload = messagePayload.replace(`<@${user.id}>`, `<@${user.user.username}>`);
                    messagePayload = messagePayload.replace(`<@!${user.id}>`, `<@${user.user.username}>`);
                })
                // Parse mentioned channels from <#id> to #name
                var mentionedChannels = message.mentions.channels;
                mentionedChannels.forEach(channel => {
                    messagePayload = messagePayload.replace(`<#${channel.id}>`, `<#${channel.name}>`)
                })
                // Parse used emojis from <:name:id> to :name:
                var usedEmojis = messagePayload.match(/<:.+?:\d+>/g);
                usedEmojis.forEach(emoji => {
                    emojiFixed = emoji.split(':')[1]
                    messagePayload = messagePayload.replace(emoji, `:${emojiFixed}:`)
                })
                const data = {
                    "type": "chat_message",
                    "targets": [],
                    "payload": {
                        "user": {
                            "id": message.author.id,
                            "name": message.author.username,
                            "color": message.member.displayHexColor.replace('#', '')
                        },
                        "message": messagePayload
                    }
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