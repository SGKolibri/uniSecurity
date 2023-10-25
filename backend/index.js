const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const validator = require('email-validator');
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


const mongoUrl = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`;
/* mongodb+srv://fecarvalho05:PGUD7w3GZdFGNWWT@cluster0.cgnt3gi.mongodb.net/ */

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

require("./schemas/userDetails");
require("./schemas/ocorrenciaDetails");

const User = mongoose.model("UserInfo");
const Ocorrencia = mongoose.model("OcorrenciaInfo");

const JWT_KEY = process.env.JWT_KEY;

app.get("/hello", (req, res) => {
    res.send("Hello World!");
});

app.post("/register-user", async (req, res) => {
    const { name, surname, email, password } = req.body;

    const isValid = validator.validate(email);
    if (!isValid) {
        console.log("Email inválido!");
        return res.json({ status: "error", error: "Email inválido!" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    try {

        const oldUser = await User.findOne({ email: email });
        if (oldUser) {
            return res.json({ status: "error aqui", error: "Email já cadastrado!" });
        }

        const response = await User.create({
            name,
            surname,
            email,
            password: encryptedPassword,
            image
        });
        res.send({ status: "ok", user: response });
    } catch (error) {
        console.log(error);
        res.send({ status: "error", error: "Erro ao registrar usuário." });
    }

});

app.post("/login-user", async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.json({ status: "error", error: "Email não registrado." });
    }

    if (await bcrypt.compare(password, user.password)) {

        if (res.status(201)) {
            const jwtToken = jwt.sign({ email: user.email }, JWT_KEY);
            return res.json({ name: user.name, surname: user.surname, email: user.email, password: user.password, status: "ok", token: jwtToken });
        } else {
            return res.json({ status: "error", error: "Usuário não encontrado." });
        }
    } else {
        return res.json({ status: "error", error: "Senha inválida!" });
    }
});

app.get("/get-user/:email", async (req, res) => {
    const email = req.params.email;

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            res.send({ status: "ok", name: user.name, surname: user.surname, email: user.email, password: user.password, image: user.image });
        }
    } catch (error) {
        console.error(error);
    }
});

app.post("/reg-ocorrencia", async (req, res) => {
    const { nome, categoria, data, hora, localizacao, descricao, image, email } = req.body;

    try {
        await Ocorrencia.create({
            nome,
            categoria,
            data,
            hora,
            localizacao,
            descricao,
            image
        });
        sendEmail(nome, email);
        res.send({ status: "Sucesso ao registrar ocorrência" });
    } catch (error) {
        res.send({ status: "Error" });
    }
});

app.get("/get-ocorrencia", async (req, res) => {
    try {
        const allOcorrencia = await Ocorrencia.find({});
        res.send({ status: "ok", ocorrencia: allOcorrencia });
    } catch (error) {
        console.error(error);
    }
});

app.patch("/edit-ocorrencia/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { nome, data, hora, localizacao, descricao, image } = req.body;

        const response = await Ocorrencia.findByIdAndUpdate(id, {
            nome,
            data,
            hora,
            localizacao,
            descricao,
            image
        });
        sendUpdatedOcorrenciaEmail(nome);
        res.send({ status: "ok", ocorrencia: response });
    }
    catch (error) {
        console.error(error);
    }
});

app.delete("/delete-ocorrencia/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await Ocorrencia.findByIdAndDelete(id);
        res.send({ status: "ok" });
    } catch (error) {
        console.error(error);
    }
});

// Send Email Details
const userE = process.env.EMAIL_HOST_USER;
const passE = process.env.EMAIL_HOST_PASSWORD;

const sendEmail = (title, emailTo) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: { user: userE, pass: passE }
    });

    transporter.sendMail({
        from: userE,
        to: emailTo,
        subject: "UniSecurity - nova ocorrência registrada.",
        text: "Título da ocorrência: " + title,
        attachments: [
            {
                filename: "ocorrencia.pdf",
                path: "./ocorrencia.pdf",
                cid: "ocorrencia",
            }
        ]
    })
}

app.post('/send-email/:id', (req, res) => {
    const { emailTo, title } = req.body;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: { user: userE, pass: passE }
    });

    transporter.sendMail({
        from: userE,
        to: emailTo,
        subject: "UniSecurity - ocorrência previamente registrada.",
        text: "Título da ocorrência: " + title,
        attachments: [
            {
                filename: "ocorrencia.pdf",
                path: "./ocorrencia.pdf",
                cid: "ocorrencia",
            }
        ]
    })
});

const sendUpdatedOcorrenciaEmail = (title) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: { user: userE, pass: passE }
    });

    transporter.sendMail({
        from: userE,
        to: userE,
        subject: "UniSecurity - ocorrência atualizada.",
        text: "Título da ocorrência: " + title,
        attachments: [
            {
                filename: "ocorrencia.pdf",
                path: "./ocorrencia.pdf",
                cid: "ocorrencia",
            }
        ]
    })
}

app.post('/pdf', (req, res) => {

    const { nome, categoria, localizacao, data, hora, descricao, image } = req.body;

    const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=invoice.pdf'
    })

    pdfService.buildPDF(
        (data) => stream.write(data),
        () => stream.end(),
        nome,
        categoria,
        localizacao,
        data,
        hora,
        descricao,
        image
    )
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor aberto; porta: ${PORT}`);
});