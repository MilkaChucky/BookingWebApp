const router = require('express').Router();
const path = require('path');
const { allowForRole } = require('../middlewares/auth.middlewares');
const { saveFiles, deleteFiles } = require('../middlewares/file.middlewares');
const { imageFolderPath } = require('../config');
const Hotel = require('../models/hotel.model');

const hotelImagesPath = path.normalize(`${imageFolderPath}/hotels`);

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

router.route('/:hotelId/images')
    .post(
        allowForRole('admin'),
        saveFiles(hotelImagesPath),
        async (req, res) => {
            if (!req.uploadResult) {
                return res.status(400).json({ message: 'No images have been uploaded!' });
            }

            try {
                await Hotel.findByIdAndUpdate(req.params.hotelId, {
                    $addToSet: { images: { $each: req.uploadResult.savedImages.map(info => info.name) } }
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
        deleteFiles(hotelImagesPath),
        async (req, res) => {
            if (!req.deleteResult) {
                return res.status(400).json({ message: 'No images have been deleted!' });
            }

            try {
                await Hotel.findByIdAndUpdate(req.params.hotelId, {
                    $pullAll: { images: req.deleteResult.deletedImages }
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

router.use('/:hotelId/rooms', require('./rooms.routes'));

module.exports = router;