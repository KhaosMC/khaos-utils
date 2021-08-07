module.exports = function handleWebsocket(message, websocketEvents, chatbridge, client, config) {
    const data = JSON.parse(message);
    if (!data.type) return;
    if (!websocketEvents.includes(data.type)) return;
    const event = websocketEvents.get(data.type);
    event.run(data, websocketEvents, chatbridge, client, config);
}