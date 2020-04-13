const express = require('express');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { port, secret } = require('./config');

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

passport.serializeUser((user, done) => {
    if(!user) return done("Jelentkezz be megfelelően!", undefined);
    return done(null, user);
});

passport.deserializeUser((user, done) => {
    if(!user) return done("Nem tudsz kijelentkezni, mert be se vagy jelentkezve!", undefined);
    return done(null, user);
});

passport.use('local', new LocalStrategy((username, password, done) => {
    if(username !== '' && password === '') {
        return done(null, {username: username, role: 'user'});
    } else {
        return done("Hibás felhasználónév vagy jelszó", undefined);
    }
}));

app.use(expressSession({ secret: secret }));
app.use(passport.initialize());
app.use(passport.session());

app.listen(port, () => {
    console.log(`BookingWebApi is running on port ${port}`);
});