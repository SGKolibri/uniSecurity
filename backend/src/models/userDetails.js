const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: { type: String, unique: true },
    password: String,
    image: String,
    role: {
        type: String,
        default: 'user'
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    collection: 'UserInfo'
});

mongoose.model('UserInfo', userDetailsSchema);