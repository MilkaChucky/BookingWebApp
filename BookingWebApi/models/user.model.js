const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new Schema({
    email: { type: String,
        required: [true, 'Email address must be provided!'],
        unique: [true, 'Email address is already registered!'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'The email must be a valid email address!']
    },
    password: { type: String,
        required: [true, 'Password must be provided!']
    },
    role: { type: String, default: 'guest' }
});

schema.pre('save', async function(next) {
    const user = this;

    if(user.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.password, salt);

            user.password = hash;
        } catch (error) {
            return next('There was an error during hashing the password!')
        }
    }

    return next();
});

schema.methods.passwordMatch = async function(password) {
    return bcrypt.compare(password, this.password);
}

module.exports = model('user', schema);