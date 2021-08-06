module.exports = function handleCommand(client, message, config, commands) {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!commands.includes(command)) return;
    const commandInfo = require(`../commands/${command + '.js'}`);

    if (!commandInfo.commandGroup) return;
    if (commandInfo.guildOnly && !(message.guild == null)) return;
    if (commandInfo.requireGuildManager && !(message.author.hasPermission('MANAGE_GUILD'))) return;
    if (commandInfo.guildOwnerOnly && !(message.author == message.guild.owner)) return;
    commandInfo.run(client, message, args, commands, config);
}