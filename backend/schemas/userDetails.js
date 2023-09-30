const { encodeBase64 } = require('bcryptjs');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: { type: String, unique: true },
    password: String,
    image: String,
    role: String
}, {
    collection: 'UserInfo'
});

mongoose.model('UserInfo', userDetailsSchema);