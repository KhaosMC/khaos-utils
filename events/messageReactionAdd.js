const { MessageEmbed, Permissions} = require('discord.js');
const fs = require('fs');
const Console = require("console");
const config = JSON.parse(fs.readFileSync('./config/config.json'));
const commandsConfig = JSON.parse(fs.readFileSync('./config/commands.json'));

module.exports = {
    description: 'messageReactionAdd event',
    run: async (bot, messageReaction, user) => {
        // Check if it's the app message, if apps are enabled and the user isn't a bot
        if (messageReaction.message.id === bot.config.applicationMessage[1] /*&& bot.commandsConfig.applications*/ && !user.bot) {
            // Resolve the user and check if they have an app
            const member = messageReaction.message.guild.members.resolve(user);
            const hasApp = await bot.db.get('SELECT 1 FROM application_channels WHERE user_id = ? AND open LIMIT 1;', user.id);
            // If they're not a member and don't have an app, proceed
            if (/*!hasApp &&*/ !(member.roles.cache.get(bot.config.memberRole))) {
                // Create channel with the applicant's username, then let them + members read it.
                const appChannel = await messageReaction.message.guild.channels.create(user.username, {
                    type: 'GUILD_TEXT',
                    permissionOverwrites: [
                        {
                            id: messageReaction.message.guild.roles.everyone,
                            deny: [Permissions.FLAGS.VIEW_CHANNEL]
                        },
                        {
                            id: bot.config.memberRole,
                            allow: [Permissions.FLAGS.VIEW_CHANNEL]
                        },
                        {
                            id: user.id,
                            allow: [Permissions.FLAGS.VIEW_CHANNEL]
                        }
                    ]
                });
                // Add to database, create embed and send in app channel
                await bot.db.run(`INSERT INTO application_channels VALUES (?, ?, NULL, 1);`, appChannel.id, user.id);
                const newApp = new MessageEmbed()
                .setTitle('Hello applicant!')
                .setThumbnail(user.avatarURL())
                .setColor(0x00ff00)
                .setDescription("Please make sure you have read the rules in the channel. We will shortly get in touch with you to discuss your application and send you the form.")
                .setFooter('Best of luck!');

                appChannel.send({embeds: [newApp]});
            }
            // Delete all reactions
            messageReaction.users.remove(user.id).catch();
        }
    }
}
