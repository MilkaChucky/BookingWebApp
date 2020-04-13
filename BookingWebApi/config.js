const fs = require('fs');
const { port, secret } = loadConfig(
    process.env.BOOKING_WEB_API_ENV || './environments/environment.json');

function loadConfig(path) {
    try {
        return JSON.parse(fs.readFileSync(path));
    } catch (ex) {
        return { };
    }
}

module.exports = {
    port: port || process.env.BOOKING_WEB_API_PORT || 3000,
    secret: secret || process.env.BOOKING_WEB_API_SECRET || 'secret'
}