const mongoose = require('mongoose');

const OcorrenciaInfoSchema = new mongoose.Schema({
    nome: String,
    categoria: String,
    hora: String,
    data: String,
    localizacao: String,
    descricao: String,
    image: String,
    registeredBy: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'OcorrenciaInfo'
});

mongoose.model('OcorrenciaInfo', OcorrenciaInfoSchema);