const express = require('express');
const router = express.Router();
const env = require('dotenv').config();
const nodemailer = require('nodemailer');
const pdfService = require('../service/pdf-service');

const userE = process.env.EMAIL_HOST_USER;
const passE = process.env.EMAIL_HOST_PASSWORD;

const path = require('path');

module.exports = {

    sendEmail(title) {
        console.log("sendEmail");
        try {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                auth: { user: userE, pass: passE }
            });

            transporter.sendMail({
                from: userE,
                to: userE,
                subject: "UniSecurity - nova ocorrência registrada.",
                text: "Título da ocorrência: " + title,
                attachments: [
                    {
                        filename: "ocorrencia.pdf",
                        path: "./ocorrencia.pdf",
                        cid: "ocorrencia",
                    }
                ]
            });

        } catch (error) {
            return console.log('Erro ao enviar email: ' + error);
        }
    },

    sendUpdatedOcorrenciaEmail(title) {
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
                    path: "/backend/ocorrencia.pdf",
                    cid: "ocorrencia",
                }
            ]
        })
    }
}