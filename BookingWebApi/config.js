const ENV_GROUP = 'Environment:';
const MONGODB_GROUP = 'MongoDB:';
const EMAIL_GROUP = 'Email service:'

const config = require('yargs')
    .env('BOOKING_WEB_API')
    .option('env', {
        group: ENV_GROUP,
        alias: 'environment',
        description: 'Environment to use',
        choices: ['', 'prod', 'docker'],
        default: ''
    })
    .option('envFolder', {
        group: ENV_GROUP,
        alias: 'env-folder',
        description: 'Environment files folder',
        default: './environments',
        normalize: true
    })
    .option('envConfig', {
        group: ENV_GROUP,
        alias: ['env-config', 'env-file'],
        description: 'Path to the environment file',
        defaultDescription: '{envFolder}/environment.{env}.json',
        config: true,
        normalize: true
    })
    .option('port', {
        description: 'Port to use',
        default: 3000,
        number: true
    })
    .option('secret', {
        description: 'App secret',
        default: 'secret'
    })
    .option('mongodb.host', {
        group: MONGODB_GROUP,
        description: 'MongoDB host',
        default: 'localhost'
    })
    .option('mongodb.port', {
        group: MONGODB_GROUP,
        description: 'MongoDB port',
        number: true,
        default: 27017
    })
    .option('mongodb.database', {
        group: MONGODB_GROUP,
        description: 'MongoDB database'
    })
    .option('mongodb.url', {
        group: MONGODB_GROUP,
        description: 'MongoDB url',
        defaultDescription: 'mongodb://{host}:{port}/{database}'
    })
    .option('email.service', {
        group: EMAIL_GROUP,
        description: 'Email service',
        default: 'gmail'
    })
    .option('email.authType', {
        group: EMAIL_GROUP,
        description: 'Email auth type',
        default: 'login'
    })
    .option('email.user', {
        group: EMAIL_GROUP,
        description: 'Email address'
    })
    .option('email.password', {
        group: EMAIL_GROUP,
        description: 'Email password'
    })
    .option('email.clientId', {
        group: EMAIL_GROUP,
        description: 'Email client ID'
    })
    .option('email.clientSecret', {
        group: EMAIL_GROUP,
        description: 'Email client secret'
    })
    .option('email.refreshToken', {
        group: EMAIL_GROUP,
        description: 'Email refresh token'
    })
    .option('email.accessToken', {
        group: EMAIL_GROUP,
        description: 'Email access'
    })
    .option('imageFolderPath', {
        alias: ['imageFolder', 'image-folder'],
        description: 'Folder of uploaded images',
        default: './upload/images',
        normalize: true
    })

module.exports = config
    .default('envConfig', `${config.argv.envFolder}/environment${config.argv.env && `.${config.argv.env}`}.json`)
    .default('mongodb.url', `mongodb://${config.argv.mongodb.host}:${config.argv.mongodb.port}/${config.argv.mongodb.database}`)
    .help()
    .argv;