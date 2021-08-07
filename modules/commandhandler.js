const { TeamMember } = require("discord.js");

module.exports = function handleCommand(client, message, config, commands) {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (!commands.includes(command)) return;
    const commandInfo = require(`../commands/${command + '.js'}`);

    if (!commandInfo.commandGroup) return message.delete({ timeout: 3000 }).catch();
    if (commandInfo.requiredRole != null && !(message.member.roles.cache.get(commandInfo.requiredRole))) return message.delete({ timeout: 3000 }).catch();
    if (commandInfo.guildOnly && !(message.guild == null)) return message.delete({ timeout: 3000 }).catch();
    if (commandInfo.requireGuildManager && !(message.author.hasPermission('MANAGE_GUILD'))) return message.delete({ timeout: 3000 }).catch();
    if (commandInfo.guildOwnerOnly && !(message.author == message.guild.owner)) return message.delete({ timeout: 3000 }).catch();
    commandInfo.run(client, message, args, commands, config);
}
