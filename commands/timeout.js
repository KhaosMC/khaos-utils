const { Permissions, Message} = require('discord.js');
const ms = require("ms");
const {SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption} = require("@discordjs/builders");
const description = 'Puts the user in a timeout'

module.exports = {
    description: description,
    usage: '[user] (reason)',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: Permissions.FLAGS.MODERATE_MEMBERS,
    guildOwnerOnly: false,
    info: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription(description)
        .addUserOption(
            new SlashCommandUserOption()
                .setName('target')
                .setRequired(true)
                .setDescription('User you want to ban')
        )
        .addStringOption(
            new SlashCommandStringOption()
                .setName('duration')
                .setRequired(true)
                .setDescription('The duration the user will be timed out for')
        )
        .addStringOption(
            new SlashCommandStringOption()
                .setName('reason')
                .setRequired(false)
                .setDescription('reason for banning')
        ),
    run: async (bot, message, args) => {
        const isSlashCommand = !(message instanceof Message)
        // Check permission and if person specified a user
        const toTimeout = message instanceof Message ? message.mentions.members.first() || bot.client.users.cache.get(args[0]) : args.getUser("target");
        const duration = ms(bot.utils.getCommandArgString(message,isSlashCommand,args,"duration",1));
        if (!duration) return bot.utils.replyTemp(message,"You need to specify a duration!",isSlashCommand,bot.config.deleteTimer)
        const reason = bot.utils.getCommandArgString(message,isSlashCommand,args,"reason",2,true,"Unknown")//args[2] ? args.slice(2).join(" ") : "Unknown";
        const member = message.guild.members.resolve(toTimeout);
        if(!member) return bot.utils.replyTemp(message,"You need to specify a user!",isSlashCommand,bot.config.deleteTimer);
        if(member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return bot.utils.replyTemp(message,"You can't kick another staff member!",isSlashCommand,bot.config.deleteTimer);

        await bot.moderationUtils.timeoutUserWithLog(bot, message, member, reason, duration,isSlashCommand)
    }
}
