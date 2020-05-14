const router = require('express').Router();
const passport = require('passport');
const { requireLogin } = require('../middlewares/auth.middlewares');
const User = require('../models/user.model');

router.route('/login')
    .post(
        (req, res) => {
            if (req.body.email && req.body.password) {
                passport.authenticate('local', (error, user) => {
                    if (error) {
                        return res.status(403).send(error);
                    } else {
                        req.login(user, (error) => {
                            if (error) return res.status(500).send(error);
                            return res.status(200).json(user);
                        });
                    }
                })(req, res);
            } else {
                res.status(400).send('Missing email or password!');
            }
        });

router.route('/logout')
    .post(
        requireLogin('Log in, before you log out!'),
        (req, res) => {
            req.logout();
            // Need to return empty JSON so Angular2+ won't treat code: 200 as error!
            res.status(200).send("{}");
        });

router.route('/register')
    .post(
        async (req, res) => {
            if (req.body.email && req.body.password) {
                const user = new User({
                    email: req.body.email,
                    password: req.body.password
                });

                try {
                    const registeredUser = await user.save();
                    return res.status(200).json(registeredUser);
                } catch (error) {
                    if (error.name === 'ValidationError') {
                        return res.status(400).send(error.message);
                    } else {
                        return res.status(500).send(error);
                    }
                }
            } else {
                return res.status(400).send('Email address or password is missing!');
            }
        });

router.route('/profile')
    .get(
        requireLogin(),
        async (req, res) => {
            try {
                const user = await User.findById(req.user._id).exec();

                res.status(200).json(user);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
    )
    .put(
        requireLogin(),
        async (req, res) => {
            try {
                const updated = await User.findByIdAndUpdate(req.user._id, {
                    ...req.body,
                    _id: req.user._id,
                    role: req.user.role
                }, { runValidators: true, new: true }).exec();

                res.status(200).json(updated);
            } catch (error) {
                if (error.name === 'ValidationError') {
                    return res.status(400).send(error.message);
                } else {
                    return res.status(500).send(error);
                }
            }
        }
    );

module.exports = router;