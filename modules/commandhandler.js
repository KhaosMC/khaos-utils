const onCooldown = new Set();

module.exports = async function handleCommand(client, config, socket, fs, log, commandsConfig) {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    console.log(`Loading ${commandFiles.length} command(s)`);
    let commands = new Map();
    for (i = 0; i < commandFiles.length; i++) {
        commands.set(commandFiles[i].replace('.js', ''), require(`../commands/${commandFiles[i]}`));
    };

    client.on('message', async (message) => {
        if (message.content.startsWith(config.prefix) && !(message.author.bot)) {
            const args = message.content.slice(config.prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            
            if (!commands.has(command)) return;
            const commandInfo = commands.get(command);
        
            if (onCooldown.has(message.author.id)) return
            if (!commandsConfig[commandInfo.commandGroup]) return message.delete({ timeout: 3000 }).catch();
        
            if (commandInfo.requiredRole !== null && !(message.member.roles.cache.get(commandInfo.requiredRole))) return message.delete({ timeout: 3000 }).catch();
            
            if (commandInfo.guildOnly && !(message.guild === null)) return message.delete({ timeout: 3000 }).catch();
        
            if (commandInfo.requireGuildManager && !(message.member.hasPermission('MANAGE_GUILD'))) return message.delete({ timeout: 3000 }).catch();
        
            if (commandInfo.guildOwnerOnly && !(message.author === message.guild.owner)) return message.delete({ timeout: 3000 }).catch();
        
            const toLog = await commandInfo.run(client, message, args, commands, config, socket);
<<<<<<< HEAD
            onCooldown.add(message.author.id)
            setTimeout(() => {
                onCooldown.delete(message.author.id);
            }, 2500)
            if (toLog == undefined) return;
=======
            if (toLog === undefined) return;
>>>>>>> a0dffdf2d7618d1352573c0393f43466becb6758
            toLog.forEach(string => {
                log(string, `command ${command}`);
            })
        }
    })
}
