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
                        return res.status(403).json({ message: error });
                    } else {
                        req.login(user, (error) => {
                            if (error) return res.status(500).json({ error: error });
                            return res.status(200).json(user);
                        });
                    }
                })(req, res);
            } else {
                res.status(400).json({ message: 'Missing email or password!' });
            }
        });

router.route('/logout')
    .post(
        requireLogin('Log in, before you log out!'),
        (req, res) => {
            req.logout();
            res.status(200).json({ });
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
                    switch (error.name) {
                        case 'ValidationError':
                            return res.status(400).json({ message: error.message });
                        case 'CastError':
                            let err = error;
                            while (err.reason && err.reason.path) {
                                err = err.reason;
                            }
                            return res.status(400).json({ message: `${err.value} is not a valid value for ${err.path}!` });
                        default:
                            return res.status(500).json({ error: error });
                    }
                }
            } else {
                return res.status(400).json({ message: 'Email address or password is missing!' });
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
                return res.status(500).json({ error: error });
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
                switch (error.name) {
                    case 'ValidationError':
                        return res.status(400).json({ message: error.message });
                    case 'CastError':
                        let err = error;
                        while (err.reason && err.reason.path) {
                            err = err.reason;
                        }
                        return res.status(400).json({ message: `${err.value} is not a valid value for ${err.path}!` });
                    default:
                        return res.status(500).json({ error: error });
                }
            }
        }
    );

module.exports = router;