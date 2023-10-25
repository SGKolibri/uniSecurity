const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: { type: String, unique: true },
    password: String,
    image: {
        data: Buffer,
        contentType: String
    }
}, {
    collection: 'UserInfo'
});

mongoose.model('UserInfo', userDetailsSchema);