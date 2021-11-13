module.exports = {
    run: async function(bot) {
        let invalid = false;
        // Check application specific configs
        if (bot.commandsConfig.applications) {
            if (!process.env.applicationUrl.startsWith("http")) {
                console.log("Invalid applicationUrl in .env");
                invalid = true;
            }
            if (isNaN(bot.config.applicationChannel)) {
                console.log("Invalid applicationChannel in config/config.json");
                invalid = true;
            }
            if (isNaN(bot.config.archivedApps)) {
                console.log("Invalid archivedApps in config/config.json");
                invalid = true;
            }
            if (isNaN(bot.config.applicationMessage[0])) {
                console.log("Invalid applicationMessage in config/config.json");
                invalid = true;
            }
        }
        // Check chatbridge specific configs
        if (bot.commandsConfig.chatbridge) {
            if (isNaN(bot.chatbridge.channel_id)) {
                console.log("Invalid channel_id in config/chatbridge.json");
                invalid = true;
            }
            if (bot.chatbridge.launch_server && typeof bot.chatbridge.server_path !== 'string') {
                console.log("Invalid server_path in config/chatbridge.json");
                invalid = true;
            }
            if (typeof bot.chatbridge.client_name !== 'string') {
                console.log("Invalid client_name in config/chatbridge.json");
                invalid = true;
            }
            if (typeof bot.chatbridge.client_type !== 'string') {
                console.log("Invalid client_type in config/chatbridge.json");
                invalid = true;
            }
            if (typeof bot.chatbridge.color !== 'string') {
                console.log("Invalid color in config/chatbridge.json");
                invalid = true;
            }
        }
        // Check misc specific configs
        if (bot.commandsConfig.misc) {
            if (!process.env.flickrToken) {
                console.log("Invalid flickrToken in .env");
                invalid = true;
            }
            if (!bot.fs.existsSync('config/tags.json')) {
                console.log("Missing config/tags.json file");
                invalid = true;
            }
        }
        // Check utils specific configs
        if (bot.commandsConfig.utils) {
            if (isNaN(bot.config.pollChannel)) {
                console.log("Invalid pollChannel in config/config.json");
                invalid = true;
            }
        }
        // Check required configs
        if (!bot.config.prefix) {
            console.log("Invalid bot prefix in config/config.json");
            invalid = true;
        }
        if (isNaN(bot.config.memberRole)) {
            console.log("Invalid memberRole in config/config.json")
            invalid = true;
        }
        if (isNaN(bot.config.trialRole)) {
            console.log("Invalid trialRole in config/config.json");
            invalid = true;
        }
        if (isNaN(bot.config.fullMemberRole)) {
            console.log("Invalid fullMemberRole in config/config.json");
            invalid = true;
        }
        if (isNaN(bot.config.inactiveRole)) {
            console.log("Invalid inactiveRole in config/config.json");
            invalid = true;
        }
        
        return invalid;
    }
}
