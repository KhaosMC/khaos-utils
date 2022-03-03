module.exports = {
    createBanWithLog: async function(bot,message,targetMember,reason,isSlashCommand){
        await bot.utils.sendUserReasonEmbed(targetMember,'banned',reason,message.guild.name)

        try{
            await targetMember.ban({reason: reason})
        }catch {
            return await bot.utils.reply(message,"Failed to ban user. Maybe bad permissions?",isSlashCommand,bot.config.deleteTimer)
        }

        await message.reply(`Successfully banned ${targetMember.user.tag}`)
        await bot.utils.sendModLogEmbed(bot, message.guild.channels.cache.get(bot.config.staffChannel), targetMember.user.tag, bot.utils.getCommandUser(message).tag,reason,'banned')
    },

    removeBanWithLog: async function(bot,message,targetUser,reason,isSlashCommand){
        try{
            await message.guild.members.unban(targetUser.id,reason)
        }catch {
            return await bot.utils.reply(message,"Failed to unban user. Maybe bad permissions?",isSlashCommand,bot.config.deleteTimer)//.then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }

        await message.reply(`Successfully unbanned ${targetUser.tag}`)
        await bot.utils.sendModLogEmbed(bot, message.guild.channels.cache.get(bot.config.staffChannel), targetUser.tag, bot.utils.getCommandUser(message).tag,reason,'unbanned')
    },

    kickUserWithLog: async function(bot,message,targetMember,reason,isSlashCommand, isBotAction = false){
        await bot.utils.sendUserReasonEmbed(targetMember,'kicked',reason,message.guild.name)

        try{
            await targetMember.kick({reason: reason})
        }catch {
            return bot.utils.reply(message,"Failed to kick user. Maybe bad permissions?",isSlashCommand,bot.config.deleteTimer)
        }

        if(!isBotAction) await message.reply(`Successfully kicked ${targetMember.user.tag}`) //message.reply(`Successfully kicked ${targetMember.user.tag}`);

        await bot.utils.sendModLogEmbed(bot, message.guild.channels.cache.get(bot.config.staffChannel), targetMember.user.tag, !isBotAction ? bot.utils.getCommandUser(message).tag : bot.client.user.tag, reason,'kicked')
    },

    timeoutUserWithLog: async function(bot,message,targetMember,reason,duration,isSlashCommand,isBotAction = false) {
        await bot.utils.sendUserReasonEmbed(targetMember,'muted',reason,message.guild.name, duration);

        try {
            await targetMember.timeout(duration, reason);
        } catch {
            return bot.utils.reply(message,"Failed to timeout user. Maybe bad permissions?",isSlashCommand,bot.config.deleteTimer)
        }

        if(!isBotAction) await message.reply(`Successfully timed out ${targetMember.user.tag}`)

        await bot.utils.sendModLogEmbed(bot,message.guild.channels.cache.get(bot.config.staffChannel),targetMember.user.tag,!isBotAction ? bot.utils.getCommandUser(message).tag : bot.client.user.tag,reason,"muted",duration);
    }
}