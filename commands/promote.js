const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Promote user to full or trial member',
    usage: '[user mention]',
    commandGroup: 'utils',
    requiredRole: null,
    guildOnly: false,
    requiredPermission: 'MANAGE_GUILD',
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config, socket, db) => {
        // Delete users message, check if a user was mentioned
        message.delete().catch();
        //variable to store if they mentioned a user
        let toPromote = message.mentions.members.first();
        //check if they mentioned a user, if not return and display message
        if (!toPromote) {
            message.channel.send('You need to mention a user to promote!').then(msg => msg.delete({timeout: 5000}));
        }
        

        //embed message to display if member was promoted to trial member
        const trial = new MessageEmbed()
            .setTitle(`${toPromote.user.username} was promoted to Trial Member!`)
            .setColor(message.guild.roles.cache.get(config.trialRole).color)
            .setDescription(`Promoted by ${message.author.username}`)
            .setFooter(toPromote.user.tag, toPromote.user.avatarURL());

        //embed message to display if member was promoted to full member
        const fullMember = new MessageEmbed()
            .setTitle(`${toPromote.user.username} was promoted to Full Member!`)
            .setColor(message.guild.roles.cache.get(config.fullMemberRole).color)
            .setDescription(`Promoted by ${message.author.username}`)
            .setFooter(toPromote.user.tag, toPromote.user.avatarURL());

        // Promote user to trial and add member role if they dont have a member role
        if (!toPromote.roles.cache.get(config.memberRole)) {
            // Grab the channel ID from database and get the channel object
            const appChannelID = await db.get('SELECT channel_id FROM application_channels WHERE user_id = ? AND open LIMIT 1;', toPromote.user.id);
            await db.get('UPDATE application_channels SET open = 0 WHERE user_id = ? AND open;', toPromote.user.id);
            const appChannel = message.guild.channels.cache.get(appChannelID.channel_id);
            // Overwrite the permissions for the channel and change category to the archived apps.
            appChannel.overwritePermissions([
                {
                    id: config.memberRole,
                    allow: ['VIEW_CHANNEL']
                },
                {
                id: message.guild.roles.everyone,
                deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                }
            ]).catch(err => console.log(err));
            appChannel.setParent(config.archivedApps).catch(err => console.log(err));

            try {
                toPromote.roles.add(config.trialRole);
                toPromote.roles.add(config.memberRole);
                //send embeded message that says the user was promoted to trial member
                message.guild.channels.cache.get(config.memberChannel).send(trial);
            } catch {
                //if the bot doesnt have access to add roles display this error message
                message.channel.send(`Oopsie! Failed to add roles. Please check my permissions.`).then(msg => {
                    msg.delete(10000);
                });
            }
            return;
        }

        // Promote user to full member if they have a member role
        if (toPromote.roles.cache.get(config.memberRole)) {
            // Fetch channel ID, delete it from db and discord
            const appChannelID = await db.get('SELECT channel_id FROM application_channels WHERE user_id = ? AND NOT open LIMIT 1;', toPromote.user.id);
            const appChannel = message.guild.channels.cache.get(appChannelID.channel_id).catch(message.channel.send("Failed to fetch channel"));
            await db.run('DELETE FROM application_channels WHERE channel_id = ?', appChannelID);
            appChannel.delete().catch(message.channel.send("Failed to remove channel"));
            try {
                toPromote.roles.remove(config.trialRole);
                toPromote.roles.add(config.fullMemberRole);
                //send full member embeded message that says the user was promoted to full member
                message.guild.channels.cache.get(config.memberChannel).send(fullMember);
            } catch {
                //if the bot doesnt have access to add roles display this error message
                message.channel.send(`Oopsie! Failed to remove roles. Please check my permissions.`).then(msg => {
                    msg.delete(10000);
                })
            }
            return;
        }
    }
}
