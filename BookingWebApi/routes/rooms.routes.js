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
        async (req, res, next) => {
            try {
                const rooms = await Hotel.aggregate([
                    { $match: { _id: ObjectId(req.params.hotelId) } },
                    { $unwind: { path: '$rooms' } },
                    { $replaceRoot: { newRoot: '$rooms' } }
                ]).exec();

                return res.status(200).json(rooms);
            } catch (error) {
                return next(error);
            }
        })
    .post(
        allowForRole('admin'),
        async (req, res, next) => {
            try {
                console.log(req.body);
                console.log(req.params.hotelId);
                const hotel = await Hotel.findById(req.params.hotelId).exec();
                hotel.rooms.push(req.body);
                console.log(hotel.rooms)
                const saved = await hotel.save();
                console.log(saved)
                const savedRoom = saved.rooms.find(room => room.number === req.body.number);
                console.log(savedRoom)

                return res.status(200).json(savedRoom);
            } catch (error) {
                return next(error);
            }
        });

router.route('/:roomNumber')
    .get(
        async (req, res, next) => {
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
                return next(error);
            }
        })
    .put(
        allowForRole('admin'),
        async (req, res, next) => {
            try {
                const hotel = await Hotel.findById(req.params.hotelId).exec();
                const i = hotel.rooms.findIndex(room => room.number === parseInt(req.params.roomNumber));
                hotel.rooms[i] = req.body;
                await hotel.save();

                return res.status(200).json(hotel.rooms[i]);
            } catch (error) {
                return next(error);
            }
        })
    .delete(
        allowForRole('admin'),
        async (req, res, next) => {
            try {
                const hotel = await Hotel.findById(req.params.hotelId).exec();
                const i = hotel.rooms.findIndex(room => room.number === parseInt(req.params.roomNumber));
                const room = hotel.rooms.splice(i, 1);
                await hotel.save();

                return res.status(200).json(room);
            } catch (error) {
                return next(error);
            }
        });

router.route('/:roomNumber/images')
    .post(
        allowForRole('admin'),
        saveFiles(roomImagesPath),
        async (req, res, next) => {
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
                return next(error);
            }
        })
    .delete(
        allowForRole('admin'),
        deleteFiles(roomImagesPath),
        async (req, res, next) => {
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
                return next(error);
            }
        });

module.exports = router;