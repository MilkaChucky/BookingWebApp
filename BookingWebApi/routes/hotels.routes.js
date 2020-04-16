const router = require('express').Router();
const { allowForRole } = require('../middlewares/auth.middlewares');
const Hotel = require('../models/hotel.model');

router.route('/')
    .get(
        async (req, res) => {
            try {
                const hotels = await Hotel.find({});

                return res.status(200).json(hotels);
            } catch (error) {
                return res.status(500).send(error);
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
                if (error.name === 'ValidationError') {
                    return res.status(400).send(error.message);
                } else {
                    return res.status(500).send(error);
                }
            }
        });

router.route('/:hotelId')
    .get(
        async (req, res) => {
            try {
                const hotel = await Hotel.findById(req.params.hotelId);

                return res.status(200).json(hotel);
            } catch (error) {
                return res.status(500).send(error);
            }
        })
    .put(
        allowForRole('admin'),
        async (req, res) => {
            try {
                const hotel = new Hotel({ ...req.body, _id: req.params.hotelId });
                await Hotel.replaceOne({ _id: req.params.hotelId }, hotel);

                return res.status(200).json(hotel);
            } catch (error) {
                if (error.name === 'ValidationError') {
                    return res.status(400).send(error.message);
                } else {
                    return res.status(500).send(error);
                }
            }
        })
    .delete(
        allowForRole('admin'),
        async (req, res) => {
            try {
                const hotel = await Hotel.findByIdAndDelete(req.params.hotelId);

                return res.status(200).json(hotel);
            } catch (error) {
                return res.status(500).send(error);
            }
        });

// router.use('/:hotelId/rooms', require('./rooms.routes'));

module.exports = router;