const { MessageEmbed, Interaction, Message} = require('discord.js');
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

    reply: async function(context, messageContent, bot, temporary = false){
        if(context instanceof Message){
            !temporary ?  await context.reply(messageContent) : await context.reply(messageContent).then(msg => setTimeout(() => msg.delete()),bot.config.deleteTimer);
        }else {
            context.reply({content: messageContent, ephemeral: temporary})
        }
    },

    replyEmbed: async function(context,embed){
        if(context instanceof Message){
            await context.reply({embeds : [embed]})
        }else {
            context.reply({embeds : [embed]})
        }
    },

    getCommandUser(context){
        return context instanceof Message ? context.author : context.user
    },

    getCommandArgString(context, args, argName, argIndex, coalesce = false, defaultValue = null){
        let value = context instanceof Message ? (coalesce ? args.slice(argIndex).join(" ") : args[argIndex]) : args.getString(argName)
        return !value && defaultValue != null ? defaultValue : value
    }

}
