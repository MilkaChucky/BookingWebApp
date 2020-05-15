const router = require('express').Router({ mergeParams: true });
const path = require('path');
const { allowForRole } = require('../middlewares/auth.middlewares');
const { saveFiles, deleteFiles } = require('../middlewares/file.middlewares');
const { imageFolderPath } = require('../config');
const { Types: { ObjectId } } = require('mongoose');
const Hotel = require('../models/hotel.model');

const roomImagesPath = path.normalize(`${imageFolderPath}/rooms`);

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
                return res.status(500).json({ error: error });
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
                return res.status(500).json({ error: error });
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
                const hotel = await Hotel.findById(req.params.hotelId).exec();
                const i = hotel.rooms.findIndex(room => room.number === parseInt(req.params.roomNumber));
                const room = hotel.rooms.splice(i, 1);
                await hotel.save();

                return res.status(200).json(room);
            } catch (error) {
                return res.status(500).json({ error: error });
            }
        });

router.route('/:roomNumber/images')
    .post(
        allowForRole('admin'),
        saveFiles(roomImagesPath),
        async (req, res) => {
            if (!req.uploadResult) {
                return res.status(400).json({ message: 'No images have been uploaded!' });
            }

            try {
                await Hotel.findOneAndUpdate({
                    _id: ObjectId(req.params.hotelId),
                    'rooms.number': req.params.roomNumber
                }, {
                    $addToSet: { 'rooms.$.images': { $each: req.uploadResult.savedImages.map(info => info.name) } }
                });

                return res.status(200).json(req.uploadResult);
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
        deleteFiles(roomImagesPath),
        async (req, res) => {
            if (!req.deleteResult) {
                return res.status(400).json({ message: 'No images have been deleted!' });
            }

            try {
                await Hotel.findOneAndUpdate({
                    _id: ObjectId(req.params.hotelId),
                    'rooms.number': req.params.roomNumber
                }, {
                    $pullAll: { 'rooms.$.images': req.deleteResult.deletedImages }
                });

                return res.status(200).json(req.deleteResult);
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

module.exports = router;