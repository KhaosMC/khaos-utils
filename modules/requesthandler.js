module.exports = {
	handler: async function(bot, target, request, other = {}) {
    	const data = {
        	type: "request",
        	targets: target,
        	payload: {
            		type: request,
            		request: other
        	}
    	}

    	socket.send(JSON.stringify(data));
    	return await new Promise(response => {
        	socket.on('message', async data => {
            		resolve(data);
        	})
    	})
	}
}
