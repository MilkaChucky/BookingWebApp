const router = require('express').Router();
const { allowForRole } = require('../middlewares/auth.middlewares');
const Hotel = require('../models/hotel.model');

router.route('/')
    .get(
        async (req, res) => {
            try {
                const hotels = await Hotel.find({}).exec();

                return res.status(200).json(hotels);
            } catch (error) {
                return res.status(500).json({ error: error });
            }
        })
    .post(
        allowForRole('admin'),
        async (req, res) => {
            try {
                const hotel = new Hotel(req.body);
                const saved = await hotel.save();

                return res.status(200).json(saved);
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
        });

router.route('/:hotelId')
    .get(
        async (req, res) => {
            try {
                const hotel = await Hotel.findById(req.params.hotelId).exec();

                return res.status(200).json(hotel);
            } catch (error) {
                return res.status(500).json({ error: error });
            }
        })
    .put(
        allowForRole('admin'),
        async (req, res) => {
            try {
                const hotel = new Hotel({ ...req.body, _id: req.params.hotelId });
                await Hotel.replaceOne({ _id: req.params.hotelId }, hotel).exec();

                return res.status(200).json(hotel);
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
        })
    .delete(
        allowForRole('admin'),
        async (req, res) => {
            try {
                const hotel = await Hotel.findByIdAndDelete(req.params.hotelId).exec();

                return res.status(200).json(hotel);
            } catch (error) {
                return res.status(500).json({ error: error });
            }
        });

router.use('/:hotelId/rooms', require('./rooms.routes'));

module.exports = router;