const pdfService = require('../service/pdf-service');
const nodemailer = require('nodemailer');
const env = require('dotenv').config();

const userE = process.env.EMAIL_HOST_USER;
const passE = process.env.EMAIL_HOST_PASSWORD;

module.exports = {
    sendEmailByID(req, res) {
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
    },
    generatePDF(req, res) {
        const { nome, categoria, localizacao, data, hora, descricao, image, registeredBy } = req.body;

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
            image,
            registeredBy
        )
    }
}