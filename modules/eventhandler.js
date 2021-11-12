module.exports = async function eventHandler(bot) {
    const eventFiles = bot.fs.readdirSync('./events').filter(file => file.endsWith('.js'));
    console.log(`Loading ${eventFiles.length} event(s)`);
    bot.events = new Map();
    for (i = 0; i < eventFiles.length; i++) {
        bot.events.set(eventFiles[i].replace('.js', ''), require(`../events/${eventFiles[i]}`));
    }

    bot.events.forEach((values, eventName, events) => {
        const event = bot.events.get(eventName);
        bot.client.on(eventName, async (...args) => {
            await event.run(bot, ...args);
        })
    })
}
