const moment = require('moment')

module.exports ={
    log: function(stringToLog, action,bot) {
        const logged = `[${moment().format('yyyy-mm-DD:hh:mm:ss')}] ${stringToLog} during ${action}`
        bot.fs.appendFile('./logs/log.txt', logged + '\n', function (err) {
            if (err) throw err;
        })
        console.log(logged)
    }
}