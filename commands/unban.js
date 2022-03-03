const { Permissions, Message} = require('discord.js');
const {SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption} = require("@discordjs/builders");
const description = 'Unbans a user from the guild'

module.exports = {
    description: description,
    usage: '[user id]',
    commandGroup: 'moderation',
    requiredRole: null,
    guildOnly: true,
    requiredPermission: Permissions.FLAGS.BAN_MEMBERS,
    guildOwnerOnly: false,
    info: new SlashCommandBuilder()
        .setName('unban')
        .setDescription(description)
        .addStringOption(
            new SlashCommandStringOption()
                .setName('target_id')
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
        const isSlashCommand = !(message instanceof Message)
        // Check permission and if person specified a user
        const toUnban = await bot.client.users.fetch(bot.utils.getCommandArgString(message,isSlashCommand,args,'target_id',0));
        if (!toUnban) return bot.utils.reply(message,"Something went wrong! Maybe incorrect user or they're not banned?",isSlashCommand,bot.config.deleteTimer)
        await bot.moderationUtils.removeBanWithLog(bot,message, toUnban, "Reasons not supported yet",isSlashCommand)
    }
}
