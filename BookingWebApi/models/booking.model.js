const { Schema, model, Error, Types: { ObjectId } } = require('mongoose');
const Hotel = require('./hotel.model');

const bookedRoomSchema = new Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        required: [true, 'The room ID must be provided!']
    },
    from: {
        type: Date,
        required: [true, 'The number of beds must be provided!'],
        default: new Date(),
        validate: [
            function (value) { return value >= new Date(); },
            'The starting date must be in the future!'
        ]
    },
    until: {
        type: Date,
        required: [true, 'The room price must be provided!'],
        validate: [
            function (value) {
                const { $setOnInsert, $set } = this.getUpdate && this.getUpdate() || {};
                const { 'bookedRooms.$.from': from } = $setOnInsert || $set || { 'bookedRooms.$.from': this.from };

                return value >= from;
            },
            'The end date must be later than the starting date!'
        ]
    }
}, { toObject: { versionKey: false }, toJSON: { versionKey: false } });

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'The user ID must me provided!']
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'hotel',
        required: [true, 'The hotel ID must me provided!']
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    opinion: {
        type: String
    },
    bookedRooms: {
        type: [bookedRoomSchema],
        validate: [
            async function (values) {
                const queryParams = this.getUpdate && this.getUpdate() || {};
                const { hotel: hotelId } = queryParams.$setOnInsert || queryParams.$set || this;

                return await Hotel.exists({
                    _id: hotelId,
                    'rooms._id': { $all: values.map(value => value.roomId) }
                });
            },
            'Some of the rooms do not exist in the given hotel!'
        ]
    }
}, { toObject: { versionKey: false }, toJSON: { versionKey: false } });

schema.index({ user: 1, hotel: 1 }, { unique: true });

schema.methods.toJSONAsync = async function () {
    const hotel = await Hotel.findById(this.hotel).exec();

    const result = this.toJSON();
    result.bookedRooms = result.bookedRooms
        .map(bookedRoom => {
            return {
                ...(hotel.rooms.find(room => room._id.toString() === bookedRoom.roomId.toString()).toJSON()),
                ...bookedRoom
            };
        });

    return result;
}

const Booking = model('booking', schema);

Booking.schema.path('bookedRooms')
    .validate({
        validator: async function (values) {
            for (value of values) {
                let overlap = values.some(v => 
                    v !== value &&
                    v.roomId.toString() === value.roomId.toString() &&
                    v.from < value.until &&
                    v.until > value.from);

                if (overlap) {
                    throw new Error(`You cannot book a room more than once in the same time!`);
                }

                overlap = await Booking.exists({
                    ...(value._id ? { 'bookedRooms._id': { $ne: value._id } } : { }),
                    'bookedRooms.roomId': ObjectId(value.roomId),
                    'bookedRooms.from': { $lt: value.until },
                    'bookedRooms.until': { $gt: value.from }
                });

                if (overlap) {
                    throw new Error(`You have a scheduling conflict for the booking between ${value.from.toLocaleString()} and ${value.until.toLocaleString()}!`);
                }
            }

            return true;
        },
        message: (props) => props.reason.message
    });

module.exports = Booking;