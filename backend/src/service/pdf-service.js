const PDFDocument = require('pdfkit')
const http = require('http');
const fs = require('fs');
const path = require('path');

const buildPDF = async (dataCallback, endCallback, nome, categoria, localizacao, data, horario, descricao, image, registeredBy) => {

    let format = undefined;

    if (image !== undefined) {
        const base64ToImage = async (base64String, fileName) => {
            const match = base64String.match(/^data:image\/([a-zA-Z]+);base64,/);
            if (!match) {
                throw new Error('Invalid image data');
            }

            format = match[1];
            const base64Data = base64String.replace(match[0], "");
            await fs.promises.writeFile(path.join(__dirname, `/images/${fileName}.${format}`), base64Data, 'base64', (err) => {
                if (err) throw err;
            });
        }
        await base64ToImage(image, "ocorrencia");
    }
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream('ocorrencia.pdf'));

    doc.on('data', dataCallback);
    doc.on('end', endCallback)

    // Uni Logo Image
    doc.image(path.join(__dirname, '../service/images/unilogo.jpg'), 50, 15, {
        fit: [100, 100],
    });

    // UniSec Logo Image    
    doc.image(path.join(__dirname, '../service/images/uniseclogo.jpg'), 475, 25, {
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
    if (image !== undefined) {
        doc.image(path.join(__dirname, `../service/images/ocorrencia.${format}`), 50, 425, {
            fit: [500, 300],
            align: 'center',
            valign: 'center'
        });
    } else {
        doc
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('Não há imagem para esta ocorrência.', {
                align: 'center',
            }, 425)
    }

    // delete image file
    if (image !== undefined) {
        fs.unlinkSync(path.join(__dirname, `../service/images/ocorrencia.${format}`))
    }

    doc.end();
}

module.exports = { buildPDF }