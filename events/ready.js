const { Message, MessageEmbed } = require("discord.js");
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config/config.json'));
const commandsConfig = JSON.parse(fs.readFileSync('./config/commands.json'));

module.exports = {
    description: 'Ready event',
    run: async (client, config, socket, db) => {
        client.user.setActivity('over Khaos Applications', {
            type: "WATCHING"
        })
        
        // Send client_connection when bot starts up
        if (commandsConfig.chatbridge) {
        const data = {
            "type": "client_connection",
            "targets": [],
            }
        socket.send(JSON.stringify(data));
        }
        // Check if there's a message to react to, else, send a new embed, store the msg id and exit the bot
        if (!config.applicationMessage[1] && commandsConfig.applications) {
            const embed = new MessageEmbed()
            .setTitle('Application')
            .setThumbnail(client.channels.cache.get(config.applicationMessage[0]).guild.iconURL())
            .setColor(0x00ff00)
            .setDescription('React to open an application')
            .setTimestamp();

            const msg = await client.channels.cache.get(config.applicationMessage[0]).send(embed);
            config.applicationMessage[1] = msg.id;
            await msg.react('✅');
            fs.writeFileSync('./config/config.json', JSON.stringify(config), err => {
                if (err) throw err;
            });
            process.exit();
        }
        if (commandsConfig.applications) {
            // Clear reactions and readd bots
            const msg = await client.channels.cache.get(config.applicationMessage[0]).messages.fetch(config.applicationMessage[1]);
            await msg.reactions.removeAll();
            await msg.react('✅');
            // Check for all channels that are more than 2 months old
            setInterval(async () => {
                const channelID = await db.get("SELECT channel_id FROM application_channels WHERE (created_time < strftime('%s', 'now') - 60*60*24*30*2);").catch();
                const channel = client.channels.cache.get(channelID).catch();
                if (channel) {
                    channel.delete();
                    await db.run("DELETE FROM application_channels WHERE channel_id = ?", channelID);
                }
            }, 1000*60*60*24)
        }
    }
}
