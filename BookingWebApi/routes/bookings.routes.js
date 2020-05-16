const router = require('express').Router();
const { requireLogin, allowForRole } = require('../middlewares/auth.middlewares');
const { createTransport: createMailTransport } = require('nodemailer');
const { email } = require('../config');
const { Types: { ObjectId } } = require('mongoose');
const Booking = require('../models/booking.model');
const Hotel = require('../models/hotel.model');

const transporter = createMailTransport({
    service: email.service,
    auth: {
        type: email.authType,
        user: email.user,
        clientId: email.clientId,
        clientSecret: email.clientSecret,
        refreshToken: email.refreshToken,
        accessToken: email.accessToken
    }
}, {
    from: email.user,
    subject: 'Booking confirmed'
});

transporter.verify((error, success) => {
    if (!success) {
        console.error(error);
        throw error;
    }
});

router.route('/')
    .get(
        requireLogin(),
        async (req, res) => {
            try {
                const bookingIds = req.query.bookingIds && req.query.bookingIds.map(bookingId => ObjectId(bookingId));

                const bookings = await Booking.aggregate([
                    {
                        $match: {
                            ...(req.user.role === 'admin' ?
                                {
                                    ...(req.query.user && { user: ObjectId(req.query.user) })
                                } : {
                                    user: req.user._id
                                }),
                            ...(req.query.hotel && {
                                hotel: ObjectId(req.query.hotel)
                            }),
                            ...(bookingIds && {
                                'bookedRooms._id': { $in: bookingIds }
                            })
                        }
                    },
                    {
                        $project: {
                            hotel: true,
                            bookedRooms: bookingIds ?
                                {
                                    $filter: {
                                        input: '$bookedRooms',
                                        as: 'bookedRoom',
                                        cond: {
                                            $in: ['$$bookedRoom._id', bookingIds]
                                        }
                                    }
                                } : true
                        }
                    }
                ]);

                const bookedRoomIds = bookings.reduce((result, current) => {
                    return [...result, ...current.bookedRooms.map(bookedRoom => bookedRoom.roomId)];
                }, []);

                const rooms = await Hotel.aggregate([
                    ...(req.query.hotel ? [{ $match: { _id: ObjectId(req.query.hotel) } }] : []),
                    { $unwind: { path: '$rooms' } },
                    { $match: { 'rooms._id': { $in: bookedRoomIds } } },
                    { $replaceRoot: { newRoot: '$rooms' } }
                ]);

                for (const booking of bookings) {
                    for (const bookedRoom of booking.bookedRooms) {
                        bookedRoom.room = rooms.find(room => room._id.toString() === bookedRoom.roomId.toString());
                    }
                }

                return res.status(200).json(bookings);
            } catch (error) {
                return res.status(500).json({ error: error });
            }
        })
    .delete(
        allowForRole('admin'),
        async (req, res) => {
            try {
                if (!req.query.hotel && !req.query.userId) {
                    return res.status(400).json({ message: 'At least one of the following must be provided: "hotel", "user"!' });
                }

                const deleted = await Booking.deleteMany({
                    ...(req.query.hotel && { hotel: req.query.hotel }),
                    ...(req.query.userId && { user: req.query.userId })
                }).exec();

                return res.status(200).json(deleted);
            } catch (error) {
                return res.status(500).json({ error: error });
            }
        });

router.route('/:bookingId')
    .put(
        requireLogin(),
        async (req, res) => {
            try {
                if (!req.body.room && !req.body.from && !req.body.until) {
                    return res.status(400).json({ message: 'You have provide valid fields to update!' });
                }

                // const updated = await Booking.findOneAndUpdate({
                //     ...(req.body.user && req.user.role === 'admin' ? {
                //         user: req.body.user
                //     } : {
                //             user: req.user._id
                //         }),
                //     bookedRooms: { $elemMatch: { _id: req.params.bookingId } }
                // }, {
                //     $set: {
                //         ...(req.body.roomId && { 'bookedRooms.$.roomId': req.body.roomId }),
                //         ...(req.body.from && { 'bookedRooms.$.from': req.body.from }),
                //         ...(req.body.until && { 'bookedRooms.$.until': req.body.until }),
                //     }
                // }, { runValidators: true, context: 'query', new: true }).exec();

                const booking = await Booking.findOne({
                    ...(req.body.user && req.user.role === 'admin' ? {
                        user: req.body.user
                    } : {
                            user: req.user._id
                        }),
                    bookedRooms: { $elemMatch: { _id: req.params.bookingId } }
                }).exec();

                for (bookedRoom of booking.bookedRooms) {
                    if (bookedRoom._id.toString() === req.params.bookingId) {
                        bookedRoom.roomId = req.body.roomId || bookedRoom.roomId;
                        bookedRoom.from = req.body.from || bookedRoom.from;
                        bookedRoom.until = req.body.until || bookedRoom.until;

                        break;
                    }
                }

                const updated = await booking.save();

                return res.status(200).json(updated);
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
        requireLogin(),
        async (req, res) => {
            try {
                const modified = await Booking.findOneAndUpdate({
                    bookedRooms: { $elemMatch: { _id: ObjectId(req.params.bookingId) } }
                }, {
                    $pull: { bookedRooms: { _id: ObjectId(req.params.bookingId) } }
                }, { runValidators: true, new: true }).exec();

                const result = await modified.toJSONAsync();
                if (req.user.role !== 'admin') {
                    delete result.user;
                }

                return res.status(200).json(result);
            } catch (error) {
                return res.status(500).json({ error: error });
            }
        });

router.route('/hotel/:hotelId')
    .post(
        requireLogin(),
        async (req, res) => {
            try {
                if (!req.body.rooms || !req.body.rooms.length) {
                    return res.status(400).json({ message: 'At least one room has to be provided, that needs to be booked!' });
                }

                const booking = await Booking.findOneAndUpdate({
                    user: req.user._id,
                    hotel: ObjectId(req.params.hotelId)
                }, {
                    $setOnInsert: { user: req.user._id, hotel: req.params.hotelId },
                    $push: { bookedRooms: { $each: req.body.rooms } }
                }, { upsert: true, runValidators: true, context: 'query', new: true }).exec();

                const hotel = await Hotel.findById(req.params.hotelId).exec();

                const result = booking.toJSON();
                result.bookedRooms = result.bookedRooms
                    .filter(bookedRoom => {
                        return req.body.rooms.some(br =>
                            br.roomId === bookedRoom.roomId.toString() &&
                            new Date(br.from).valueOf() === new Date(bookedRoom.from).valueOf() &&
                            new Date(br.until).valueOf() === new Date(bookedRoom.until).valueOf());
                    })
                    .map(bookedRoom => {
                        return {
                            ...(hotel.rooms.find(room => room._id.toString() === bookedRoom.roomId.toString()).toJSON()),
                            ...bookedRoom
                        };
                    });
                delete result.user;

                const bookedRoomsListElements = result.bookedRooms.map(bookedRoom => {
                    const fromDate = bookedRoom.from.toLocaleDateString('hu');
                    const untilDate = bookedRoom.until.toLocaleDateString('hu');
                    const bookingId = bookedRoom._id.toString();
                    return `
                    <li style="font-size:1.5em">
                        <div><b>Room ${bookedRoom.number}</b> from ${fromDate} until ${untilDate}</div>
                        <div>| Booking ID: <strong>${bookingId}</strong></div>
                    </li>
                `;
                });

                transporter.sendMail({
                    to: req.user.email,
                    html: `
                    <html>
                        <body>
                            <main>
                                <h1>You successfully booked the following rooms at ${hotel.name}:</h1>
                                <p>
                                    <ul>
                                        ${bookedRoomsListElements.join('\n')}
                                    </ul>
                            </main> 
                            <footer style="font-size:1.2em">
                            Thank you for choosing us!<br>
                            Griff&Ale Booking
                            </footer>
                        </body>
                    </html>
                `
                }, (error, info) => {
                    if (error) {
                        console.warn(`Email was not sent! Reason:\n${error}`);
                    }
                });

                return res.status(200).json(result);
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

router.route('/hotel/:hotelId/rating')
    .get(
        async (req, res) => {
            try {
                const ratings = await Booking.find({
                    hotel: ObjectId(req.params.hotelId),
                    rating: { $gte: 1 }
                }, {
                    _id: 0, rating: 1, opinion: 1
                }).exec();


                return res.status(200).json({
                    average: ratings.reduce((p, c) => p + c.rating, 0) / ratings.length,
                    ratings: ratings
                });
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
    .post(
        requireLogin(),
        async (req, res) => {
            try {
                if (!req.body || (req.body.rating === undefined && req.body.opinion === undefined)) {
                    return res.status(400).json({ message: 'You have to provide at least the rating or the comment!' });
                }

                const booking = await Booking.findOneAndUpdate({
                    user: (req.user.role === 'admin' && req.body.user ? ObjectId(req.body.user) : req.user._id),
                    hotel: ObjectId(req.params.hotelId),
                    'bookedRooms.until': { $lt: new Date() }
                }, {
                    $set: {
                        ...(req.body.rating !== undefined ? { rating: req.body.rating } : {}),
                        ...(req.body.opinion !== undefined ? { opinion: req.body.opinion } : {})
                    }
                }, { new: true }).exec();

                if (!booking) {
                    return res.status(404).json({ message: 'You cannot rate a hotel until you spent time there!' });
                }

                return res.status(200).json({});
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
        requireLogin(),
        async (req, res) => {
            try {
                const booking = await Booking.findOneAndUpdate({
                    user: (req.user.role === 'admin' && req.body.user ? ObjectId(req.body.user) : req.user._id),
                    hotel: ObjectId(req.params.hotelId)
                }, {
                    $unset: { rating: '', opinion: '' }
                }, { new: true }).exec();

                if (!booking) {
                    return res.status(404).json({ message: 'You have not booked a room in this hotel yet!' });
                }

                return res.status(200).json({});
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