const { MessageEmbed } = require('discord.js');
const {createModLogEmbed, sendModLogEmbed} = require("./utils");

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

    createBanWithLog: async function(bot,guild,message,targetMember,reason){
        try{
            await targetMember.ban({reason: reason})
        }catch {
            return message.channel.send("Failed to ban user. Maybe bad permissions?").then(msg => setTimeout(() => msg.delete()), bot.config.deleteTimer);
        }

        message.reply(`Successfully banned ${targetMember.user.tag}`)
        await sendModLogEmbed(bot, message.guild.channels.cache.get(bot.config.staffChannel), targetMember.user.tag, message.author.tag,reason,'banned')
    }
}