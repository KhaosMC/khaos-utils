const onCooldown = new Set();

module.exports = async function handleCommand(bot) {
    bot.commandFiles = bot.fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    console.log(`Loading ${bot.commandFiles.length} command(s)`);
    bot.commands = new Map();
    for (i = 0; i < bot.commandFiles.length; i++) {
        bot.commands.set(bot.commandFiles[i].replace('.js', ''), require(`../commands/${bot.commandFiles[i]}`));
    };
    bot.client.on('messageCreate', async (message) => {
        if (message.content.startsWith(bot.config.prefix) && !(message.author.bot)) {
            const args = message.content.slice(bot.config.prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            
            if (!bot.commands.has(command)) return;
            const commandInfo = bot.commands.get(command);
        
            if (onCooldown.has(message.author.id)) return;
            if (commandInfo.commandGroup !== null && !bot.commandsConfig[commandInfo.commandGroup]) {
               message.channel.send("Command is disabled.").then(msg => setTimeout(() => {
                   msg.delete().catch();
                   message.delete().catch();
               }, bot.config.deleteTimer));
               return;
            };
        
            if (commandInfo.requiredRole !== null && !(message.member.roles.cache.get(commandInfo.requiredRole))) {
               message.channel.send("You do not have the required role.").then(msg => setTimeout(() => {
                   msg.delete().catch();
                   message.delete().catch();
               }, bot.config.deleteTimer));
               return;
            };
            
            if (commandInfo.guildOnly && !(message.guild)) {
               message.channel.send("This command is guild only.").then(msg => setTimeout(() => {
                   msg.delete().catch();
                   message.delete().catch();
               }, bot.config.deleteTimer));
               return;
            };
        
            if (commandInfo.requiredPermission !== null && !(message.member.permissions.has(commandInfo.requiredPermission))) {
               message.channel.send("You do not have the required permission.").then(msg => setTimeout(() => {
                   msg.delete().catch();
                   message.delete().catch();
               }, bot.config.deleteTimer));
               return;
            };
        

            if (commandInfo.guildOwnerOnly && !(message.author === message.guild.owner)) {
               message.channel.send("This command is guild owner only.").then(msg => setTimeout(() => {
                   msg.delete().catch();
                   message.delete().catch();
               }, bot.config.deleteTimer));
               return;
            };
        
            await commandInfo.run(bot, message, args).catch(err => bot.logger.log(err, command,bot));
            onCooldown.add(message.author.id)
            setTimeout(() => {
                onCooldown.delete(message.author.id);
            }, 2500);
        }
    })
}
