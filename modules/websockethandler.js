module.exports = function handleWebsocket(message, websocketEvents) {
    const data = JSON.parse(message);
    if (!websocketEvents.includes(data.type));
}