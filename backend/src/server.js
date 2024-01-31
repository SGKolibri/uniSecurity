const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const pdfService = require('./service/pdf-service');
const { image } = require('pdfkit');

const app = express();

var jsonParser = bodyParser.json({ limit: 1024 * 1024 * 10, type: 'application/json' });
var urlencodedParser = bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 10, type: 'application/x-www-form-urlencoded' });
app.use(jsonParser);
app.use(urlencodedParser);

app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});


const mongoUrl = process.env.MONGODB_URL;

mongoose
    .connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Conectado ao MongoDB')
    })
    .catch((e) => {
        console.log(e, "Erro ao conectar ao banco de dados")
    });

// Routes
const ocorrenciaRoutes = require('./routes/Ocorrencia');
const userRoutes = require('./routes/User');
const utilsRoutes = require('./routes/Utils');

app.use(ocorrenciaRoutes);
app.use(userRoutes);
app.use(utilsRoutes);

const port = process.env.PORT || 5050;

app.listen(port, () => {
    console.log(`Servidor aberto; porta: ${port}`);
});