const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { port, secret, mongodb } = require('./config');
const { connect:ConnectToMongoDB, connection:dbConnection } = require('mongoose');
const User = require('./models/user.model');

const app = express();

ConnectToMongoDB(mongodb.buildUrl(), {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => console.log(`Successfully connected to ${mongodb.database} database`))
    .catch((error) => console.log('Error during the database connection', error));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

passport.serializeUser((user, done) => {
    if (!user) return done("Log in properly!");
    return done(null, user);
});

passport.deserializeUser((user, done) => {
    if (!user) return done("You cannot log in, because you are not even logged in!");
    return done(null, user);
});

passport.use('local', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
    try {
        const user = await User.findOne({ email: username });

        if (user) {
            try {
                const isMatch = await user.passwordMatch(password);

                if (isMatch) {
                    return done(null, user);
                } else {
                    return done('Wrong password!');
                }
            } catch (error) {
                return done('There was an error when comparing the passwords')
            }
        } else {
            return done('There is no registered user with that email address!');
        }
    } catch (error) {
        return done('There was an error while retrieving the user');
    }
}));

app.use(session({ secret: secret }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', require('./routes/users.routes'));

app.listen(port, () => {
    console.log(`BookingWebApi is running on port ${port}`);
});