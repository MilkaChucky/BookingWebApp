const router = require('express').Router({ mergeParams: true });
const { allowForRole } = require('../middlewares/auth.middlewares');
const { Types:{ ObjectId } } = require('mongoose');
const Hotel = require('../models/hotel.model');

router.route('/')
    .get(
        async (req, res) => {
            try {
                const rooms = await Hotel.aggregate([
                    { $match: { _id: ObjectId(req.params.hotelId) } },
                    { $unwind: { path: '$rooms' } },
                    { $replaceRoot: { newRoot: '$rooms' } }
                ]).exec();

                return res.status(200).json(rooms);
            } catch (error) {
                return res.status(500).send(error);
            }
        })
    .post(
        allowForRole('admin'),
        async (req, res) => {
            try {
                const hotel = await Hotel.findById(req.params.hotelId).exec();
                hotel.rooms.push(req.body);
                const saved = await hotel.save();
                const savedRoom = saved.rooms.find(room => room.number === req.body.number);

                return res.status(200).json(savedRoom);
            } catch (error) {
                if (error.name === 'ValidationError') {
                    return res.status(400).send(error.message);
                } else {
                    return res.status(500).send(error);
                }
            }
        });

router.route('/:roomNumber')
    .get(
        async (req, res) => {
            try {
                const [room] = await Hotel.aggregate([
                    { $match: { _id: ObjectId(req.params.hotelId) } },
                    { $unwind: { path: '$rooms' } },
                    { $match: { 'rooms.number': parseInt(req.params.roomNumber) } },
                    { $replaceRoot: { newRoot: '$rooms' } },
                    { $limit: 1 }
                ]).exec();

                return res.status(200).json(room);
            } catch (error) {
                return res.status(500).send(error);
            }
        })
    .put(
        allowForRole('admin'),
        async (req, res) => {
            try {
                const hotel = await Hotel.findById(req.params.hotelId).exec();
                const i = hotel.rooms.findIndex(room => room.number === parseInt(req.params.roomNumber));
                hotel.rooms[i] = req.body;
                await hotel.save();

                return res.status(200).json(hotel.rooms[i]);
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
                const hotel = await Hotel.findById(req.params.hotelId).exec();
                const i = hotel.rooms.findIndex(room => room.number === parseInt(req.params.roomNumber));
                const room = hotel.rooms.splice(i, 1);
                await hotel.save();

                return res.status(200).json(room);
            } catch (error) {
                return res.status(500).send(error);
            }
        });

module.exports = router;