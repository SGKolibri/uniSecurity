const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    turno: String,
    efetivacao: String,
    role: String,
    status: {
        type: Boolean,
        default: true
    },
    cpf: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'UserInfo'
});

mongoose.model('UserInfo', userDetailsSchema);