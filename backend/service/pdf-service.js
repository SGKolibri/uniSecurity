const PDFDocument = require('pdfkit')
const http = require('http');
const fs = require('fs');

function buildPDF(dataCallback, endCallback, nome, categoria, localizacao, data, horario, descricao) {

    // let nome = "Ocorrência Teste dytaufsdyufasd"
    // let categoria = "Discussão"
    // let localizacao = "0123456789"
    // let data = "01/01/2021"
    // let horario = "12:00"
    // let descricao = "01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
    let image = "service/images/unilogo.jpg"

    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream('ocorrencia.pdf'));

    doc.on('data', dataCallback);
    doc.on('end', endCallback)

    // Uni Logo Image
    doc.image('service/images/unilogo.jpg', 50, 15, {
        fit: [100, 100],
    });

    // UniSec Logo Image
    doc.image('service/images/uniseclogo.jpg', 475, 25, {
        fit: [75, 75],
    });

    // UniSecurity Title
    doc
        .fontSize(30)
        .font('Helvetica')
        .text('UniSecurity', {
            align: 'center'
        }, 55)

    // Separator Line
    doc
        .moveTo(50, 130)
        .lineTo(550, 130)
        .stroke();

    // Ocorrencia Title
    doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text(`${nome}`, { align: 'center' }, 150)

    // Separator Line
    doc
        .moveTo(50, 180)
        .lineTo(550, 180)
        .stroke();

    // Ocorrencia Category
    doc
        .fontSize(12)
        .font('Helvetica')
        .text('Categoria:', 50, 200) // Ocorrencia Categoria
        .font('Helvetica-Bold')
        .text(`${categoria}`, 110, 200)
        .font('Helvetica')
        .text('Local:', 400, 200) // Ocorrencia Local
        .font('Helvetica-Bold')
        .text(`${localizacao}`, 435, 200)
        .font('Helvetica')
        .text('Data:', 50, 255) // Ocorrencia Data
        .font('Helvetica-Bold')
        .text(`${data}`, 80, 255)
        .font('Helvetica')
        .text('Horário:', 400, 255) // Ocorrencia Horario
        .font('Helvetica-Bold')
        .text(`${horario}`, 450, 255)

    // Separator Line
    doc
        .moveTo(50, 285)
        .lineTo(550, 285)
        .stroke();

    // Ocorrencia Description
    doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Descrição da ocorrência', 233, 300)
        .font('Helvetica')
        .text(`${descricao}`, 50, 330, {
            align: 'justify',
        })

    // Ocorrencia Image
    doc.image(`${image}`, 50, 425, {
        fit: [500, 300],
        align: 'center',
        valign: 'center'
    });

    doc.end();

}

module.exports = { buildPDF }