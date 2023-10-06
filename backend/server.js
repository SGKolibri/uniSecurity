const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const multer = require('multer');

const JWT_KEY = "y7SxirhO&6cA2%Mb16UziE095&L3#f&6y$o^c4)"

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoUrl = "mongodb+srv://fecarvalho05:PGUD7w3GZdFGNWWT@cluster0.cgnt3gi.mongodb.net/?retryWrites=true&w=majority";
/* mongodb+srv://fecarvalho05:PGUD7w3GZdFGNWWT@cluster0.cgnt3gi.mongodb.net/ */

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

require("./schemas/userDetails");
require("./schemas/ocorrenciaDetails");

const User = mongoose.model("UserInfo");
const Ocorrencia = mongoose.model("OcorrenciaInfo");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

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
        const token = jwt.sign({ email: user.email }, JWT_KEY);

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

app.get("/get-all-users", async (req, res) => {
    try {
        const allUsers = await User.find({});
        res.send({ status: "ok", users: allUsers });
    } catch (error) {
        console.error(error);
    }
});

app.patch("/user-recover-password", async (req, res) => {
    try {
        const { email } = req.body;
        console.log("AQUI: ", email);
        const { password } = req.body;
        console.log("AQUI 2: ", password);
        const encryptedPassword = await bcrypt.hash(password, 10);

        const response = User.findOneAndUpdate(email, {
            password: encryptedPassword,
        });
        res.send({ status: "200", user: response });
    } catch (error) {
        res.send({ status: "error", error: "Erro ao alterar senha." });
    }
});

app.post("/reg-ocorrencia", async (req, res) => {
    const { nome, categoria, data, hora, localizacao, descricao, image } = req.body;

    console.log("AQUI: ", image);

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

app.listen(3000, () => {
    console.log(`Server abrido; porta: ${3000}`);
});