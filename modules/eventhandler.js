module.exports = async function eventHandler(client, config, socket, fs, log) {
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
    console.log(`Loading ${eventFiles.length} event(s)`);
    var events = new Map();
    for (i = 0; i < eventFiles.length; i++) {
        events.set(eventFiles[i].replace('.js', ''), require(`../events/${eventFiles[i]}`));
    }

    events.forEach((values, eventName, events) => {
        const event = events.get(eventName);
        client.on(eventName, async (...args) => {
            const toLog = await event.run(client, config, socket, ...args);
            if (toLog == undefined || toLog.length == 0) return;
            for (i = 0; i < toLog.length; i++) {
                log(`${toLog[i]} at event ${eventName}`)
            }
        })
    })
}