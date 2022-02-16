const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = async function handleSlashCommand(bot) {
    // Timeout to wait for all the variables to be setup
    setTimeout(() => {
        deployCommands(bot)
    }, 3000)
    
    // Handle slash commands on the event
    bot.client.on('interactionCreate', async interaction => {
        // Check if interaction is a command
        if (!interaction.isCommand()) return;

        // Check if command exists
        const command = bot.commands.get(interaction.commandName);
        if (!command) return;

        // Try to execute the command, if it fails, let the user know
        try {
            await command.run(bot, interaction, interaction.options)
        } catch {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    })
}

function deployCommands(bot) {
    // Get all the commands and push their data to an array to register
    const commands = [];
    bot.commands.forEach(command => {
        if (command.hasOwnProperty('info')) commands.push(command.info.toJSON());
    })

    // Check if commands are already registered, otherwise just ignore this below
    let identical = false;
    bot.fs.exists('./logs/registeredCommands.json', exists => {
        if (exists) {
            // Fetch the currently registered commands
            const alreadyRegistered = JSON.parse(bot.fs.readFileSync('./logs/registeredCommands.json'));
            // Stringify to json to compare
            if (JSON.stringify(alreadyRegistered) === JSON.stringify(commands)) {
                // If true, set the identical boolean to skip the next registration of the commands
                identical = true;
            } else {
                // If false, write the current commands to the file
                bot.fs.writeFileSync('./logs/registeredCommands.json', JSON.stringify(commands));
            }
        } else {
            // If the file doesn't exist, write the current (to be) registered commands to file
            bot.fs.writeFileSync('./logs/registeredCommands.json', JSON.stringify(commands));
        }
    })
    // Register the commands to discord
    if (identical) {
        const rest = new REST({ version: '9' }).setToken(process.env.token);
        rest.put(Routes.applicationGuildCommands(bot.client.user.id, bot.config.serverId), { body: commands })
        .then(() => console.log(`Successfully registered ${commands.length} application commands.`))
        .catch(console.error);
    } else {
        console.log(`${commands.length} already registered, skipping..`);
    }
}

