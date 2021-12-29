const { MessageEmbed } = require('discord.js');

module.exports = {
    sendModLogEmbed: async function(bot,channel,target,moderator,reason,action) {
        const staffEmbed = new MessageEmbed()
            .setTitle(`Member ${action}`)
            .setColor(action === 'unbanned' ? 0x00ff00 : 0xff0000)
            .addField('User', target,false)
            .addField('Moderator', moderator)
            .addField('Reason',reason)
            .setTimestamp()
        channel.send({embeds :[staffEmbed]})
    },

    sendUserReasonEmbed: async function(member,modAction,reason,guildName){
        const userEmbed = new MessageEmbed()
            .setTitle(`You've been ${modAction} from ${guildName}!`)
            .setColor(0xff0000)
            .setDescription(`For ${reason}`)
            .setTimestamp();

        await member.send({embeds : [userEmbed]}).catch(err => console.log(err));
    },

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

    kickUserWithLog: async function(bot,message,targetMember,reason){
        await bot.utils.sendUserReasonEmbed(targetMember,'kicked',reason,message.guild.name)

        try{
            await targetMember.kick({reason: reason})
        }catch {
            return message.channel.send("Failed to kick user. Maybe bad permissions?").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }

        message.reply(`Successfully kicked ${targetMember.user.tag}`)
        await bot.utils.sendModLogEmbed(bot, message.guild.channels.cache.get(bot.config.staffChannel), targetMember.user.tag, message.author.tag,reason,'kicked')
    }
}