module.exports = {
    requireLogin: (unauthorizedMessage) => function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        return res.status(403).send(unauthorizedMessage || "You don't have permission for this operation!");
    },
    allowForRole: (...roles) => function (req, res, next) {
        if (req.isAuthenticated() && roles.includes(req.user.role)) {
            return next();
        }

        return res.status(403).send("You don't have permission for this operation!");
    }
}