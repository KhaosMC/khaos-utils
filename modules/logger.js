const moment = require('moment')

module.exports = function log(stringToLog, action) {
    const logged = `[${moment().format('yyyy-mm-DD:hh:mm:ss')}] ${stringToLog} during ${action}`
    fs.appendFile('./logs/log.txt', logged + '\n', function (err) {
        if (err) throw err;
    })
    console.log(logged)
}