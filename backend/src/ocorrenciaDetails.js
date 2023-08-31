const { encodeBase64 } = require('bcryptjs');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');

const OcorrenciaInfoSchema = new mongoose.Schema({
    nome: String,
    hora: String,
    data: String,
    localizacao: String,
    descricao: String
}, {
    collection: 'OcorrenciaInfo'
});

mongoose.model('OcorrenciaInfo', OcorrenciaInfoSchema);