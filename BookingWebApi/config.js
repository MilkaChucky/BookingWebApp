const fs = require('fs');
const { port, secret, mongodb } = loadConfig(
    process.env.BOOKING_WEB_API_ENV || './environments/environment.json');

function loadConfig(path) {
    try {
        return JSON.parse(fs.readFileSync(path));
    } catch (error) {
        return { };
    }
}

module.exports = {
    port: port || process.env.BOOKING_WEB_API_PORT || 3000,
    secret: secret || process.env.BOOKING_WEB_API_SECRET || 'secret',
    mongodb: {
        host: process.env.MONGODB_HOST || 'localhost',
        port: process.env.MONGODB_PORT || 27017,
        database: process.env.MONGODB_DB || '',
        ...mongodb,
        buildUrl: function () {
            return `mongodb://${this.host}:${this.port}/${this.database}`;
        }
    }
}