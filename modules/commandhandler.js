const onCooldown = new Set();

module.exports = async function handleCommand(bot) {
    bot.commandFiles = bot.fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    console.log(`Loading ${bot.commandFiles.length} command(s)`);
    bot.commands = new Map();
    for (i = 0; i < bot.commandFiles.length; i++) {
        bot.commands.set(bot.commandFiles[i].replace('.js', ''), require(`../commands/${bot.commandFiles[i]}`));
    };
    console.log(bot.client);
    bot.client.on('messageCreate', async (message) => {
	console.log("Made it here")
        if (message.content.startsWith(bot.config.prefix) && !(message.author.bot)) {
            const args = message.content.slice(bot.config.prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            
            if (!bot.commands.has(command)) return;
            const commandInfo = bot.commands.get(command);
        
            if (onCooldown.has(message.author.id)) return;
            if (commandInfo.commandGroup !== null && !bot.commandsConfig[commandInfo.commandGroup]) return message.delete({ timeout: 3000 }).catch();
        
            if (commandInfo.requiredRole !== null && !(message.member.roles.cache.get(commandInfo.requiredRole))) return message.delete({ timeout: 3000 }).catch();
            
            if (commandInfo.guildOnly && !(message.guild)) return;
        
            if (commandInfo.requiredPermission !== null && !(message.member.hasPermission(commandInfo.requiredPermission))) return message.delete({ timeout: 3000 }).catch();
        
            if (commandInfo.guildOwnerOnly && !(message.author === message.guild.owner)) return message.delete({ timeout: 3000 }).catch();

            await commandInfo.run(bot, message, args)
            onCooldown.add(message.author.id)
            setTimeout(() => {
                onCooldown.delete(message.author.id);
            }, 2500);
        }
    })
}
