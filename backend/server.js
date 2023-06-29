const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_KEY = "y7SxirhO&6cA2%Mb16UziE095&L3#f&6y$oEcU)";

const app = express();
app.use(express.json());
app.use(cors());

const mongoUrl = "mongodb+srv://fecarvalho05:PGUD7w3GZdFGNWWT@cluster0.cgnt3gi.mongodb.net/?retryWrites=true&w=majority";

mongoose
    .connect(mongoUrl, {
        useNewUrlParser: true,

    })
    .then(() => {
        console.log('MongoDB conectado')
    })
    .catch((e) => {
        console.log(e, "no")
    });

require("./src/userDetails");

const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
    const { name, surname, email, password } = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);
    try {

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            alert("Email já cadastrado.");
            return res.json({ error: "Email já cadastrado" })
        }

        await User.create({
            name,
            surname,
            email,
            password: encryptedPassword,
        });
        res.send({ status: "Ok" });
    } catch (error) {
        res.send({ status: "Error" });
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
        //não sei se é necessário mas vai que, né
        return res.json({ status: "ok" });
    }

    res.json({ status: "error", error: "Senha inválida." });
});

app.post("/user-data", async (req, res) => {
    const { token } = req.body;

    try {
        const user = jwt.verify(token, JWT_KEY);
        const userEmail = user.email;
        User.findOne({ email: userEmail })
            .then((data) => {
                res.send({ status: "ok", data: data });
            })
            .catch((error) => {
                res.send({ status: "error", data: error });
            });
    } catch (error) {
        res.send({ status: "Error" });

    }
});

app.listen(3000, () => {
    console.log("Server abrido; porta: 3000");
});