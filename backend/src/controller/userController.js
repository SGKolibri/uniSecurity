const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('email-validator');
const mongoose = require('mongoose');
const env = require('dotenv').config();

require("../models/userDetails");
const User = mongoose.model("UserInfo");

const JWT_KEY = process.env.JWT_KEY;

module.exports = {
    async registerUser(req, res) {
        const { name, surname, email, password, image, efetivacao, turno, cpf } = req.body;

        const encryptedPassword = await bcrypt.hash(password, 10);
        try {
            const response = await User.create({
                name,
                surname,
                email,
                password: encryptedPassword,
                image,
                turno,
                efetivacao,
                role: "user",
                cpf
            });
            res.send({ status: "ok", user: response });
        } catch (error) {
            res.send({ status: "error", error: "Houve um problema ao registrar usuário." });
        }
    },
    async loginUser(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ status: "error", error: "Email não registrado." });
        }
        if (!user.status) {
            return res.json({ status: "error", error: "Usuário inativado do UniSecurity." });
        }

        if (await bcrypt.compare(password, user.password)) {

            if (res.status(201)) {
                const jwtToken = jwt.sign({ email: user.email }, JWT_KEY);
                return res.json({ name: user.name, surname: user.surname, email: user.email, password: user.password, status: "ok", token: jwtToken, role: user.role, image: user.image });
            }
        }
        else {
            return res.json({ status: "error", error: "Senha incorreta." });
        }
    },
    async getUsers(req, res) {
        const page = Number(req.query.page) || 0;
        const limit = Number(req.query.limit) || 7;
        const search = req.query.search || undefined;
        const role = "user";

        if (page < 0) page = 0;

        let query = { role };
        if (search !== undefined) {
            query.search = { $regex: new RegExp(search, 'i') };
        }

        try {
            const users = await User.find(query).limit(limit).skip(limit * page);
            const usersCount = await User.countDocuments(query);
            res.send({ status: "get-users", users: users, usersLength: usersCount });
        } catch (error) {
            console.error(error);
        }
    },

    async updateUser(req, res) {
        const id = req.params.id;
        const { name, surname, email, password, image, efetivacao, turno, cpf } = req.body;

        const encryptedPassword = await bcrypt.hash(password, 10);
        try {
            const response = await User.findByIdAndUpdate(id, {
                name,
                surname,
                email,
                password: encryptedPassword,
                image,
                efetivacao,
                turno,
                cpf
            });
            res.send({ status: "ok", user: response });
        } catch (error) {
            res.send({ status: "error", error: "Houve um problema ao atualizar usuário." });
        }
    },
    async updateUserStatus(req, res) {
        try {
            const id = req.params.id;
            const { status } = req.body

            const response = await User.findByIdAndUpdate(id, { status: status });
            res.send({ status: "suave", user: response });
        } catch (error) {
            console.error(error);
        }
    },
    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.send({ status: "get-all-users", users: users });
        } catch (error) {
            console.error(error);
        }
    },
    async getUserImage(req, res) {
        const email = req.params.email;

        try {
            const userImage = await User.find({ email });
            res.send({
                status: "user-image", userImage: userImage[0].image

            });
        } catch (error) {
            res.send({ status: "error", error: "Houve um problema ao buscar imagem do usuário." });
        }
    }

}