const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');

module.exports = {
    description: 'Update featured discord embeds',
    usage: '',
    commandGroup: 'utils',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: 'MANAGE_GUILD',
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
        message.delete().catch();
        const messageInfo = JSON.parse(fs.readFileSync('./config/featured.json'));
        // Check if we have a channel id and message id
        if (!messageInfo.channelId) return message.channel.send("You need a channel id!").then(msg => setTimeout(() => msg.delete()),bot.config.deleteTimer);
        // If we do not have a message id, send a temporary message that we can later on edit
        if (!messageInfo.messageId) {
            // Create an array for each server type
            let messages = [];
            for (i = 0; i < 5; i++) {
                let msg = await message.guild.channels.cache.get(messageInfo.channelId).send("Temporary");
                messages.push(msg.id)
            }
            // Set the object key messageId to the array we created then write it to file
            messageInfo.messageId = messages;
            fs.writeFileSync('./config/featured.json', JSON.stringify(messageInfo), err => {
                if (err) throw err;
            })
        }
        // Fetch the list and parse it
        const list = await fetch('https://raw.githubusercontent.com/KhaosMC/fetchables/main/featured-discords.json').then(response => response.json());
        // 1.15/16+
        const sixteen = new MessageEmbed()
        .setTitle("1.15/16 Tech Servers")
        .setDescription(list.sixteen.join('\t'))
        .setColor(0x800000)
        .setTimestamp()
        // 1.12
        const twelve = new MessageEmbed()
        .setTitle("1.12 Tech Servers")
        .setDescription(list.twelve.join('\t'))
        .setColor(0x800000)
        .setTimestamp()
        // Older versions
        const older = new MessageEmbed()
        .setTitle("Older Tech Servers")
        .setDescription(list.older.join('\t'))
        .setColor(0x800000)
        .setTimestamp()
        // Archives
        const archive = new MessageEmbed()
        .setTitle("Archive Servers")
        .setDescription(list.archive.join('\t'))
        .setColor(0x800000)
        .setTimestamp()
        // Bedrock
        const bedrock = new MessageEmbed()
        .setTitle("Bedrock Tech Servers")
        .setDescription(list.bedrock.join('\t'))
        .setColor(0x800000)
        .setTimestamp()

        // Edit each message for each embed
        const embeds = [sixteen, twelve, older, archive, bedrock]
        for (i = 0; i < 5; i++) {
            const msgToEdit = await message.guild.channels.cache.get(messageInfo.channelId).messages.fetch(messageInfo.messageId[i]);
            msgToEdit.edit('', embeds[i]);
        }

    }
}