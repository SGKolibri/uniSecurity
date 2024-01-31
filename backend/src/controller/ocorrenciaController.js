const mongoose = require('mongoose');

require("../models/ocorrenciaDetails");
const Ocorrencia = mongoose.model("OcorrenciaInfo");

const emailService = require('../service/email-service');
const { fillAndStroke } = require('pdfkit');

module.exports = {
    async registerOcorrencia(req, res) {
        const { nome, categoria, data, hora, localizacao, descricao, image, registeredBy } = req.body;

        if (image === undefined) {
            try {
                await Ocorrencia.create({
                    nome,
                    categoria,
                    data,
                    hora,
                    localizacao,
                    descricao,
                    registeredBy
                });
                emailService.sendEmail(nome);
                res.send({ status: "Sucesso ao registrar ocorrência" });
            } catch (error) {
                res.send({ status: "Error" });
            }
        } else {
            try {
                await Ocorrencia.create({
                    nome,
                    categoria,
                    data,
                    hora,
                    localizacao,
                    descricao,
                    image,
                    registeredBy
                });
                emailService.sendEmail(nome);
                res.send({ status: "Sucesso ao registrar ocorrência" });
            } catch (error) {
                res.send({ status: "Error" });
            }
        }
    },
    async getOcorrencia(req, res) {

        let search = req.query.search || undefined; // Filtro por nome
        let categoria = req.query.categoria || undefined; // Filtro por categoria
        let localizacao = req.query.localizacao || undefined; // Filtro por localizacao
        let sortOrder = req.query.sortOrder || 1; // 1 most recent, -1 oldest
        let page = Number(req.query.page) || 0; // Paginação
        let limit = Number(req.query.limit) || 8;

        if (page < 0) page = 0;

        let query = {};
        if (search !== undefined) {
            query.nome = { $regex: new RegExp(search, 'i') }; // Changed from query.search to query.nome
        }
        if (categoria !== undefined) {
            query.categoria = categoria;
        }
        if (localizacao !== undefined) {
            query.localizacao = { $regex: new RegExp(localizacao, 'i') };
        }
        console.log(query);
        try {
            const ocorrencia = await Ocorrencia.find(query).limit(limit).skip(limit * page).sort({ data: sortOrder });
            const allOcorrencia = await Ocorrencia.find({});
            res.send({ status: "ok", ocorrencia: ocorrencia, numberOfOcorrencias: allOcorrencia.length });
        } catch (error) {
            console.error(error);
        }
    },
    async editOcorrencia(req, res) {
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
    },

    async deleteOcorrencia(req, res) {
        const id = req.params.id;
        try {
            await Ocorrencia.findByIdAndDelete(id);
            res.send({ status: "ok" });
        } catch (error) {
            console.error(error);
        }
    },

    async getTotalOfOcorrencias(req, res) {
        try {
            const ocorrencias = await Ocorrencia.find({});
            res.send({ status: "ok", length: ocorrencias.length });
        } catch (error) {
            console.error(error);
        }
    }

}