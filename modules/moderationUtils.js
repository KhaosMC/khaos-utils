module.exports = {
    createBanWithLog: async function(bot,message,targetMember,reason){
        await bot.utils.sendUserReasonEmbed(targetMember,'banned',reason,message.guild.name)

        try{
            await targetMember.ban({reason: reason})
        }catch {
            return message.channel.send("Failed to ban user. Maybe bad permissions?").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }

        message.reply(`Successfully banned ${targetMember.user.tag}`)
        await bot.utils.sendModLogEmbed(bot, message.guild.channels.cache.get(bot.config.staffChannel), targetMember.user.tag, message.author.tag,reason,'banned')
    },

    removeBanWithLog: async function(bot,message,targetUser,reason){
        try{
            await message.guild.members.unban(targetUser.id,reason)
        }catch {
            return message.channel.send("Failed to unban user. Maybe bad permissions?").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }

        message.reply(`Successfully unbanned ${targetUser.tag}`)
        await bot.utils.sendModLogEmbed(bot, message.guild.channels.cache.get(bot.config.staffChannel), targetUser.tag, message.author.tag,reason,'unbanned')
    },

    kickUserWithLog: async function(bot,message,targetMember,reason, isBotAction = false){
        await bot.utils.sendUserReasonEmbed(targetMember,'kicked',reason,message.guild.name)

        try{
            await targetMember.kick({reason: reason})
        }catch {
            return message.channel.send("Failed to kick user. Maybe bad permissions?").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }

        if(isBotAction) message.reply(`Successfully kicked ${targetMember.user.tag}`);

        await bot.utils.sendModLogEmbed(bot, message.guild.channels.cache.get(bot.config.staffChannel), targetMember.user.tag, !isBotAction ? message.author.tag : bot.client.user.tag, reason,'kicked')
    },

    timeoutUserWithLog: async function(bot,message,targetMember,reason,duration,isBotAction = false) {
        await bot.utils.sendUserReasonEmbed(targetMember,'muted',reason,message.guild.name, duration);

        try {
            await targetMember.timeout(duration, reason);
        } catch {
            return message.channel.send("Failed to timeout user. Maybe bad permissions?").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }

        if(!isBotAction) message.reply(`Successfully timed out ${targetMember.user.tag}`)

        await bot.utils.sendModLogEmbed(bot,message.guild.channels.cache.get(bot.config.staffChannel),targetMember.user.tag,!isBotAction ? message.author.tag : bot.client.user.tag,reason,"muted",duration);
    }
}