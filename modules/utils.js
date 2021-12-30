const { MessageEmbed } = require('discord.js');
const ms = require("ms");

module.exports = {
    sendModLogEmbed: async function(bot,channel,target,moderator,reason,action, duration = 0) {
        const staffEmbed = new MessageEmbed()
            .setTitle(`Member ${action}`)
            .setColor(action === 'unbanned' ? 0x00ff00 : 0xff0000)
            .addField('User', target,false)
            .addField('Moderator', moderator)
            .addField('Reason',reason)
            .setTimestamp()

        if(duration !== 0) staffEmbed.addField('Duration',ms(duration),false)

        channel.send({embeds :[staffEmbed]})
    },

    sendUserReasonEmbed: async function(member,modAction,reason,guildName, duration = 0){
        const userEmbed = new MessageEmbed()
            .setTitle(`You've been ${modAction} from ${guildName}!`)
            .setColor(0xff0000)
            .setDescription(`For ${reason}`)
            .setTimestamp();

        if(duration !== 0) userEmbed.addField('Duration', ms(duration),false)

        await member.send({embeds : [userEmbed]}).catch(err => console.log(err));
    },

    sendAlertLogEmbed: async function(channel,message, alertType = "Anti-Spam"){
        const alertEmbed = new MessageEmbed()
            .setTitle(`${alertType} alert!`)
            .setColor(0xff0000)
            .addField('User',message.author.tag,false)
            .addField(`Message Content`,`\`${message.content}\``,false)
            .setTimestamp()
        await channel.send({embeds : [alertEmbed]}).catch(err => console.log(err))
    },

    createBanWithLog: async function(bot,message,targetMember,reason){
        await this.sendUserReasonEmbed(targetMember,'banned',reason,message.guild.name)

        try{
            await targetMember.ban({reason: reason})
        }catch {
            return message.channel.send("Failed to ban user. Maybe bad permissions?").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }

        message.reply(`Successfully banned ${targetMember.user.tag}`)
        await this.sendModLogEmbed(bot, message.guild.channels.cache.get(bot.config.staffChannel), targetMember.user.tag, message.author.tag,reason,'banned')
    },

    removeBanWithLog: async function(bot,message,targetUser,reason){
        try{
            await message.guild.members.unban(targetUser.id,reason)
        }catch {
            return message.channel.send("Failed to unban user. Maybe bad permissions?").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }

        message.reply(`Successfully unbanned ${targetUser.tag}`)
        await this.sendModLogEmbed(bot, message.guild.channels.cache.get(bot.config.staffChannel), targetUser.tag, message.author.tag,reason,'unbanned')
    },

    kickUserWithLog: async function(bot,message,targetMember,reason, isBotAction = false){
        await this.sendUserReasonEmbed(targetMember,'kicked',reason,message.guild.name)

        try{
            await targetMember.kick({reason: reason})
        }catch {
            return message.channel.send("Failed to kick user. Maybe bad permissions?").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }

        if(isBotAction) message.reply(`Successfully kicked ${targetMember.user.tag}`);

        await this.sendModLogEmbed(bot, message.guild.channels.cache.get(bot.config.staffChannel), targetMember.user.tag, !isBotAction ? message.author.tag : bot.client.user.tag, reason,'kicked')
    },

    timeoutUserWithLog: async function(bot,message,targetMember,reason,duration,isBotAction = false) {
        await this.sendUserReasonEmbed(targetMember,'muted',reason,message.guild.name, duration);

        try {
            await targetMember.timeout(duration, reason);
        } catch {
            return message.channel.send("Failed to timeout user. Maybe bad permissions?").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }

        if(!isBotAction) message.reply(`Successfully timed out ${targetMember.user.tag}`)

        await this.sendModLogEmbed(bot,message.guild.channels.cache.get(bot.config.staffChannel),targetMember.user.tag,!isBotAction ? message.author.tag : bot.client.user.tag,reason,"muted",duration);
    }
}
