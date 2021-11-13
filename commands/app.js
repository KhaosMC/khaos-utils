const { MessageEmbed, Snowflake} = require('discord.js');
const { memberRole } = require('../config/config.json');

async function isAppChannel(message, db) {
	const isAppChannel = await db.get('SELECT 1 FROM application_channels WHERE channel_id = ? AND open LIMIT 1;', message.channel.id);
	if(!isAppChannel) return false;
    else return true;
}

module.exports = {
    description: 'Information about application channel.',
    usage: 'help for more info',
    commandGroup: 'applications',
    requiredRole: memberRole,
    guildOnly: true,
    requiredPermission: null,
    guildOwnerOnly: false,
    run: async (bot, message, args) => {
    const subcmd = args[0];
	const userID = await bot.db.get('SELECT user_id FROM application_channels WHERE channel_id = ? AND open LIMIT 1;', message.channel.id);
    if(!await isAppChannel(message, bot.db)) return;
    const user = await message.guild.members.resolve(userID.id);;

        switch (subcmd) {
        case 'close': {
            if (!message.member.permissions.has('MANAGE_GUILD')) break;
            if (!await isAppChannel(message, bot.db)) break;
            await bot.db.get('UPDATE application_channels SET open = 0 WHERE user_id = ? AND open;', user.id);
            message.channel.permissionOverwrites([
                {
                    id: message.guild.roles.everyone,
                    deny: ['SEND_MESSAGES'],
                }
            ]).catch();
            await message.channel.setParent(bot.config.archivedApps);

            const embed = new MessageEmbed()
            .setTitle('Rejected application!')
            .setDescription('Your application has been rejected, you can reapply in 2 months.')
            .setTimestamp()

            user.send({embeds:[embed]}).catch();
            break;
        }
	case 'user': {
    	
        }
            default: {
                const cmds = [
                    'user - Get the applicant in the working channel',
                    'status - Get the status of the application',
                    'setmsg - Sets the message id for the corresponding form'
                ]

                const embed = new MessageEmbed()
                .setTitle('Available commands')
                .setDescription(cmds.join('\n'))
                .setFooter();
                
                message.channel.send({embeds:[embed]});
            }
        }
    }
}
