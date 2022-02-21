module.exports = {
    createBanWithLog: async function(bot,message,targetMember,reason){
        await bot.utils.sendUserReasonEmbed(targetMember,'banned',reason,message.guild.name)

        try{
            await targetMember.ban({reason: reason})
        }catch {
            return bot.utils.reply(message,"Failed to ban user. Maybe bad permissions?",true)
        }

        message.reply(`Successfully banned ${targetMember.user.tag}`)
        await bot.utils.sendModLogEmbed(bot, message.guild.channels.cache.get(bot.config.staffChannel), targetMember.user.tag, bot.utils.getCommandUser(message).tag,reason,'banned')
    },

    removeBanWithLog: async function(bot,message,targetUser,reason){
        try{
            await message.guild.members.unban(targetUser.id,reason)
        }catch {
            return bot.utils.reply(message,"Failed to unban user. Maybe bad permissions?")//.then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }

        message.reply(`Successfully unbanned ${targetUser.tag}`)
        await bot.utils.sendModLogEmbed(bot, message.guild.channels.cache.get(bot.config.staffChannel), targetUser.tag, bot.utils.getCommandUser(message).tag,reason,'unbanned')
    },

    kickUserWithLog: async function(bot,message,targetMember,reason, isBotAction = false){
        await bot.utils.sendUserReasonEmbed(targetMember,'kicked',reason,message.guild.name)

        try{
            await targetMember.kick({reason: reason})
        }catch {
            return bot.utils.reply(message,"Failed to kick user. Maybe bad permissions?",true)
        }

        if(!isBotAction) await bot.utils.reply(message, `Successfully kicked ${targetMember.user.tag}`) //message.reply(`Successfully kicked ${targetMember.user.tag}`);

        await bot.utils.sendModLogEmbed(bot, message.guild.channels.cache.get(bot.config.staffChannel), targetMember.user.tag, !isBotAction ? bot.utils.getCommandUser(message).tag : bot.client.user.tag, reason,'kicked')
    },

    timeoutUserWithLog: async function(bot,message,targetMember,reason,duration,isBotAction = false) {
        await bot.utils.sendUserReasonEmbed(targetMember,'muted',reason,message.guild.name, duration);

        try {
            await targetMember.timeout(duration, reason);
        } catch {
            return bot.utils.reply(message,"Failed to timeout user. Maybe bad permissions?",true)
        }

        if(!isBotAction) message.reply(`Successfully timed out ${targetMember.user.tag}`)

        await bot.utils.sendModLogEmbed(bot,message.guild.channels.cache.get(bot.config.staffChannel),targetMember.user.tag,!isBotAction ? bot.utils.getCommandUser(message).tag : bot.client.user.tag,reason,"muted",duration);
    }
}