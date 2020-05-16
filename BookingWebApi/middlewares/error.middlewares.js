module.exports = {
    globalErrorHandler: function (error, req, res, next) {
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