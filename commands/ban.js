const { Permissions, Message} = require('discord.js');
const {SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption} = require("@discordjs/builders");
const description = 'Bans a user from the guild'

module.exports = {
    description: description,
    usage: '[user] (reason)',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: Permissions.FLAGS.BAN_MEMBERS,
    guildOwnerOnly: false,
    info: new SlashCommandBuilder()
        .setName('ban')
        .setDescription(description)
        .addUserOption(
            new SlashCommandUserOption()
                .setName('target')
                .setRequired(true)
                .setDescription('User you want to ban')
        )
        .addStringOption(
            new SlashCommandStringOption()
                .setName('reason')
                .setRequired(false)
                .setDescription('reason for banning')
        ),
    run: async (bot, message, args) => {
        // Check permission and if person specified a user
        const toBan = message instanceof Message ? message.mentions.members.first() || bot.client.users.cache.get(args[0]) : args.getUser("target");
        const reason = bot.utils.getCommandArgString(message,args,"reason",1,true,"Unknown");
        const member = message.guild.members.resolve(toBan);
        if(!member) return bot.utils.reply(message,"You need to specify a user!",bot,true);
        if(member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return bot.utils.reply(message,"You can't kick another staff member!",bot,true);

        // calls a function which bans the user and do then call another function for logging
        await bot.moderationUtils.createBanWithLog(bot, message, member, reason)
    }
}
