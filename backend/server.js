const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });


const JWT_KEY = "y7SxirhO&6cA2%Mb16UziE095&L3#f&6y$o^c4)";


const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;
const mongoUrl = "mongodb+srv://fecarvalho05:PGUD7w3GZdFGNWWT@cluster0.cgnt3gi.mongodb.net/?retryWrites=true&w=majority";
/* mongodb + srv://fecarvalho05:PGUD7w3GZdFGNWWT@cluster0.cgnt3gi.mongodb.net/ */

mongoose
    .connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Banido da Twitch')
    })
    .catch((e) => {
        console.log(e, "Erro ao conectar ao banco de dados")
    });

require("./src/userDetails");
require("./src/ocorrenciaDetails");

const User = mongoose.model("UserInfo");
const Ocorrencia = mongoose.model("OcorrenciaInfo");
const ImageModel = mongoose.model('Image', { data: Buffer });


app.post("/register-user", async (req, res) => {
    const { name, surname, email, password, image } = req.body;

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
            image,
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
        return res.json({ status: "error", error: "Usuário não encontrado." });
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ email: user.email }, JWT_KEY);

        if (res.status(201)) {
            const jwtToken = jwt.sign({ email: user.email }, JWT_KEY);
            return res.json({ email: user.email, password: user.password, status: "ok", token: jwtToken });
        } else {
            return res.json({ status: "error", error: "Usuário não encontrado." });
        }
    }
    res.json({ status: "error", error: "Senha inválida." });
});


app.get("/get-image", async (req, res) => {
    try {
        const allUser = await User.findOne({})
        // if (!image) {
        //     return res.status(404).json({ message: 'Image not found' });
        // }
        res.send({ status: "ok", image: allUser.image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.post("/reg-ocorrencia", async (req, res) => {
    const { nome, data, hora, localizacao, descricao } = req.body;

    try {
        await Ocorrencia.create({
            nome,
            data,
            hora,
            localizacao,
            descricao,
        });
        res.send({ status: "Sucesso ao registrar ocorrência" });
    } catch (error) {
        res.send({ status: "Error" });
    }
});

app.listen(port, () => {
    console.log(`Server abrido; porta: ${port}`);
});