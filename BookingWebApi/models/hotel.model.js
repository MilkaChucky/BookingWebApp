const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
    number: {
        type: Number,
        required: [true, 'The room number must me provided!']
    },
    beds: {
        type: Number,
        required: [true, 'The number of beds must be provided!']
    },
    price: {
        type: Number,
        required: [true, 'The room price must be provided!']
    }
}, { toObject: { versionKey: false }, toJSON: { versionKey: false } });

const schema = new Schema({
    name: {
        type: String,
        required: [true, 'The hotel name must me provided!']
    },
    address: {
        type: String,
        required: [true, 'The hotel address must be provided!']
    },
    rooms: {
        type: [roomSchema],
        validate: [
            function (values) {
                return values.length === (new Set(values.map(value => value._id))).size;
            },
            'The room number must be unique!'
        ]
    },
    review: { type: Number }
}, { toObject: { versionKey: false }, toJSON: { versionKey: false } });

module.exports = model('hotel', schema);