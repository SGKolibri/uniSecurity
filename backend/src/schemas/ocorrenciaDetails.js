const mongoose = require('mongoose');

const OcorrenciaInfoSchema = new mongoose.Schema({
    nome: String,
    categoria: String,
    hora: String,
    data: String,
    localizacao: String,
    descricao: String,
    image: String
}, {
    collection: 'OcorrenciaInfo'
});

mongoose.model('OcorrenciaInfo', OcorrenciaInfoSchema);