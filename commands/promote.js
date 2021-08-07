const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Promote user to full or trial member',
    usage: '[user mention]',
    commandGroup: 'promote',
    requiredRole: null,
    guildOnly: false,
    requireManageGuild: true,
    guildOwnerOnly: false,
    run: async (client, message, args, commands, config) => {
        // Delete users message, check if a user was mentioned
        message.delete().catch();
        //variable to store if they mentioned a user
        let toPromote = message.mentions.members.first();
        //check if they mentioned a user, if not return and display message
        if (!toPromote) {
            message.channel.send('You need to mention a user to promote!');
        }
        

        //embed message to display if member was promoted to trial member
        const trial = new MessageEmbed()
            .setTitle(`${toPromote.user.username} was promoted to Trial Member!`)
            .setColor(message.guild.roles.cache.get(config.trialRole).color)
            .setDescription(`Promoted by ${message.author.username}`)
            .setFooter(toPromote.user.tag, toPromote.user.avatarURL());

        //embed message to display if member was promoted to full member
        const fullMember = new MessageEmbed()
            .setTitle(`${toPromote.username} was promoted to Full Member!`)
            .setColor(message.guild.roles.cache.get(config.fullMemberRole).color)
            .setDescription(`Promoted by ${message.author.username}`)
            .setFooter(toPromote.user.tag, toPromote.user.avatarURL());

        // Promote user to trial and add member role if they dont have a member role
        if (!toPromote.roles.cache.get(config.memberRole)) {
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