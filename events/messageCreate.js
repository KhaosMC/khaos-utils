const {Permissions} = require("discord.js");
module.exports = {
    description: 'messageCreate event',
    run: async (bot, message) => {
        // Websocket function
        await websocket(bot, message);
        // Anti spam
       	await antiSpam(bot, message);
        // Verify incoming applications
        await applicationsCheck(bot, message);
   }
}

async function websocket(bot, message) {
    if (message.channel.id === bot.chatbridge.channel_id && !(message.author.bot)) {
    try {
        let messagePayload = message.content;
        // Parse mentioned users from <@id> to @username
        const mentionedUsers = message.mentions.members || [];
        mentionedUsers.forEach(user => {
            messagePayload = messagePayload.replace(`<@${user.id}>`, `@${user.user.username}`);
            messagePayload = messagePayload.replace(`<@!${user.id}>`, `@${user.user.username}`);
        })
        // Parse mentioned channels from <#id> to #name
        const mentionedChannels = message.mentions.channels || [];
        mentionedChannels.forEach(channel => {
            messagePayload = messagePayload.replace(`<#${channel.id}>`, `#${channel.name}`)
        })
        // Parse used emojis from <:name:id> to :name:
        const usedEmojis = messagePayload.match(/<:[^:]+:\d+>/) || [];
        usedEmojis.forEach(emoji => {
            emojiFixed = emoji.split(':')[1]
            messagePayload = messagePayload.replace(emoji, `:${emojiFixed}:`)
        })
        // Parse used animated emojis from <a:name:id> to :name:
        const usedAnimatedEmojis = messagePayload.match(/<a:[^:]+:\d+>/) || [];
        usedAnimatedEmojis.forEach(emoji => {
            emojiFixed = emoji.split(':')[1]
            messagePayload = messagePayload.replace(emoji, `:${emojiFixed}:`)
        })
        // Parse images for name of each image
        const attachments = message.attachments
        if (message.attachments.size > 0) {
            messagePayload += ' '
            attachments.forEach(attachment => {
                messagePayload += `[${attachment.name}] `
            })
        }
        // Show messages that are replies
        if (message.reference) {
            const repliedMsg = await message.channel.messages.fetch(message.reference.messageId);
            let repliedContent = repliedMsg.content;
            repliedContent = repliedContent.slice(0, 40 - repliedMsg.author.username.length) + "..."
            messagePayload = `{Reply to ${repliedMsg.author.username}: ${repliedContent}} ${messagePayload}`
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
        bot.socket.send(JSON.stringify(data));
    } catch (err) {
        console.log(err)
    }
    }
}

async function antiSpam(bot, message) {
    if (bot.commandsConfig.anti_spam) {
        // Yeet any user that has more than 15 mentions in a message.
        if (message.mentions.members.size > bot.config.antispamPingCount) {
            await bot.utils.kickUserWithLog(bot,message,message.member,'Mass mentions',true)
            await bot.utils.sendAlertLogEmbed(message.guild.channels.cache.get(bot.config.staffChannel), message)
        }
    }
}

async function applicationsCheck(bot, message) {
    const reactionEmojis = ['780549171089637376', '780549170770870292', '780548158068621355']
    if (message.channel === bot.config.applicationChannel && bot.commands.applications) {
        if (!message.embeds[0]) return message.delete().catch();
        if (message.embeds.length === 0 && !(message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))) return message.delete().catch();
        const attemptedAuthToken = message.embeds[0].fields[0].value.toString()
        const authTokens = bot.fs.readFileSync('./logs/authTokens', 'UTF-8').split(/\r?\n/);
        if (authTokens.includes(attemptedAuthToken) && (message.webhookID !== null)) {
            await message.react(reactionEmojis[0]) // These 3 message.react() are for voting, remove them if you do not want them.
            await message.react(reactionEmojis[1])
            await message.react(reactionEmojis[2])
            const index = authTokens.indexOf(attemptedAuthToken);
            if (index > -1) {
                authTokens.splice(index, 1);
            }
            const logTokens = authTokens.join('\n')
            bot.fs.writeFileSync('./logs/authTokens', logTokens, err => {
                if (err) return errors.push(err);
            })
            const applicant = message.embeds[0].fields[1].value.toString();
            const user = message.guild.members.cache.find(u => u.user.tag === applicant);
            if (!user) return message.guild.channels.cache.get(bot.config.memberChannel).send(`Failed to get user for latest app.`);
            else await bot.db.run('UPDATE application_channels SET message_id = ? WHERE user_id = ? AND open;', message.id, user.id)
        }
    }    
 }
