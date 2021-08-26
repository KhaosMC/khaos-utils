const chatbridge = JSON.parse(require('fs').readFileSync('./config/chatbridge.json'));
const fs = require('fs');
const commands = JSON.parse(fs.readFileSync('./config/commands.json'));

module.exports = {
    description: 'Ready event',
    run: async (client, config, socket, message) => {
        let errors = []
        // websocket related
        if (message.channel.id === chatbridge.channel_id && !(message.author.bot)) {
            try {
                let messagePayload = message.content;
                // Parse mentioned users from <@id> to @username
                let mentionedUsers = message.mentions.members || [];
                mentionedUsers.forEach(user => {
                    messagePayload = messagePayload.replace(`<@${user.id}>`, `@${user.user.username}`);
                    messagePayload = messagePayload.replace(`<@!${user.id}>`, `@${user.user.username}`);
                })
                // Parse mentioned channels from <#id> to #name
                let mentionedChannels = message.mentions.channels || [];
                mentionedChannels.forEach(channel => {
                    messagePayload = messagePayload.replace(`<#${channel.id}>`, `#${channel.name}`)
                })
                // Parse used emojis from <:name:id> to :name:
                let usedEmojis = messagePayload.match(/<:[^:]+:\d+>/) || [];
                usedEmojis.forEach(emoji => {
                    emojiFixed = emoji.split(':')[1]
                    messagePayload = messagePayload.replace(emoji, `:${emojiFixed}:`)
                })
                // Parse used animated emojis from <a:name:id> to :name:
                let usedAnimatedEmojis = messagePayload.match(/<a:[^:]+:\d+>/) || [];
                usedAnimatedEmojis.forEach(emoji => {
                    emojiFixed = emoji.split(':')[1]
                    messagePayload = messagePayload.replace(emoji, `:${emojiFixed}:`)
                })
                // Parse images for name of each image
                let attachments = message.attachments
                if (message.attachments.size > 0) { 
                    messagePayload += ' '
                    attachments.forEach(attachment => {
                        messagePayload += `[${attachment.name}] `
                    })
                }

                const data = {
                    "type": "chat_message",
                    "targets": [],
                    "payload": {
                        "user": {
                            "id": message.author.id,
                            "name": message.author.username,
                            "display_color": message.member.displayHexColor.replace('#', ''),
                            "color": message.member.displayHexColor.replace('#', '')
                        },
                        "message": messagePayload
                    }
                };
                socket.send(JSON.stringify(data));
            } catch (err) {
                console.log(err)
            }
        }

        // Verify incoming applicationd
        let reactionEmojis = ['780549171089637376', '780549170770870292', '780548158068621355']
        if (message.channel === config.applicationChannel && commands.applications) {
            if (message.embeds[0] === undefined) return message.delete().catch();
            if (message.embeds.length === 0 && !(message.member.hasPermission('MANAGE_GUILD'))) return message.delete().catch();
            let attemptedAuthToken = message.embeds[0].fields[0].value.toString()
            let authTokens = fs.readFileSync('./logs/authTokens', 'UTF-8').split(/\r?\n/);
            if (authTokens.includes(attemptedAuthToken) && (message.webhookID !== null)) {
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