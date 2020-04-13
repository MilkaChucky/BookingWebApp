const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user.model');

router.route('/login')
    .post((req, res) => {
        if (req.body.username && req.body.password) {
            passport.authenticate('local', (error, user) => {
                if (error) {
                    return res.status(403).send(error);
                } else {
                    req.logIn(user, (error) => {
                        if (error) return res.status(500).send(error);
                        return res.status(200).send('Login successful');
                    });
                }
            })(req, res);
        } else {
            res.status(400).send('Missing username or password!');
        }
    });

router.route('/logout')
    .post((req, res) => {
        if (req.isAuthenticated()) {
            req.logout();
            res.status(200).send('Logout successful');
        } else {
            res.status(403).send('Log in, before you log out!')
        }
    });

router.route('/register')
    .post(async (req, res) => {
        if (req.body.username && req.body.password) {
            const user = new User({
                username: req.body.username,
                password: req.body.password,
                role: 'guest'
            });

            try {
                await user.save();
                return res.status(200).send('User registered');
            } catch (error) {
                return res.status(500).send(error);
            }
        } else {
            return res.status(400).send('Username or password is missing!');
        }
    });

module.exports = router;