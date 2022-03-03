const { Permissions, Message} = require('discord.js');
const {SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption} = require("@discordjs/builders");
const description = 'Kicks a user from the guild'

module.exports = {
    description: description,
    usage: '[user] (reason)',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: Permissions.FLAGS.KICK_MEMBERS,
    guildOwnerOnly: false,
    info: new SlashCommandBuilder()
        .setName('kick')
        .setDescription(description)
        .addUserOption(
            new SlashCommandUserOption()
                .setName('target')
                .setRequired(true)
                .setDescription('User you want to kick')
        )
        .addStringOption(
            new SlashCommandStringOption()
                .setName('reason')
                .setRequired(false)
                .setDescription('reason for kicking')
        ),
    run: async (bot, message, args) => {
        // Check permission and if person specified a user
        const toKick = message instanceof Message ? message.mentions.members.first() || bot.client.users.cache.get(args[0]) : args.getUser('target');
        const reason = bot.utils.getCommandArgString(message,args,"reason",1,true,"Unknown")//message instanceof Message ? args[1] ? args.slice(1).join(" ") : "Unknown" : args.getString('reason') ? args.getString('reason') : "Unknown";
        const member = message.guild.members.resolve(toKick);
        if(!member) return bot.utils.reply(message,"You need to specify a user!",bot,true);
        if(member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return bot.utils.reply(message,"You can't kick another staff member!",bot,true);

        await bot.moderationUtils.kickUserWithLog(bot, message, member, reason)
    }
}
