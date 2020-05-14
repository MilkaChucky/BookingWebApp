const fs = require('fs');
const { port, secret, mongodb, email } = loadConfig(
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
    },
    email: {
        service: process.env.EMAIL_SERVICE || 'gmail',
        authType: process.env.EMAIL_AUTH_TYPE || 'login',
        user: process.env.EMAIL_USER || '',
        password: process.env.EMAIL_PASSWORD || '',
        clientId: process.env.EMAIL_CLIENT_ID || '',
        clientSecret: process.env.EMAIL_CLIENT_SECRET || '',
        refreshToken: process.env.EMAIL_REFRESH_TOKEN || '',
        accessToken: process.env.EMAIL_ACCESS_TOKEN || '',
        ...email
    }
}