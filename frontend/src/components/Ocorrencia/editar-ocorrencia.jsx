import React, { useState } from 'react'
import { motion, transform } from 'framer-motion'
import axios from 'axios'
import { useToast } from '@chakra-ui/toast'
import Compressor from 'compressorjs'

function EditarOcorrencia({ id, handleClose, ocorrenciaDetails }) {

    const toast = useToast();

    const [nome, setNome] = useState('')
    const [categoria, setCategoria] = useState('')
    const [hora, sethora] = useState('')
    const [data, setData] = useState('')
    const [localizacao, setLocalizacao] = useState('')
    const [descricao, setDescricao] = useState('')
    const [image, setImage] = useState('')

    const patchOcorrencia = () => {

        if (nome === '' || categoria === '' || hora === '' || data === '' || localizacao === '' || descricao === '') {
            toast({
                title: "Campos vazios!",
                description: "Preencha todos os campos!",
                status: "error",
                duration: "3000",
                isClosable: true,
            });
            return;
        }

        axios.patch(`https://uni-security.vercel.app/edit-ocorrencia/${id}`, {
            nome: nome,
            hora: hora,
            data: data,
            categoria: categoria,
            localizacao: localizacao,
            descricao: descricao,
            image: image
        })
            .then((response) => {
                console.log(response);
                toast({
                    title: "Ocorrência editada!",
                    description: "Ocorrência editada com sucesso!",
                    status: "success",
                    duration: "3000",
                    isClosable: true,
                });
            })
            .catch((error) => {
                console.log(error);
            })

        setTimeout(() => {
            window.location.reload();
        }, 1250);
    }

    /* Image Compressor */
    const handleCompressedUpload = (imageToBeCompressed) => {
        new Compressor(imageToBeCompressed, {
            quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
            success: (result) => {
                const formData = new FormData();

                // The third parameter is required for server
                formData.append('file', result, result.name);
                console.log("Inside Compress: ", result);
                encodeImageFileAsURL(result)
            },
        });
    };

    /* convert image to base64 */
    function encodeImageFileAsURL(element) {
        let file = element;
        let reader = new FileReader();
        reader.addEventListener("load", function () {
            console.log(reader.result)
            if (reader.result.length > 1000000) {
                console.log("Size: ", reader.result.length)
                toast({
                    title: "Imagem muito grande!",
                    description: "Tamanho máximo de 1MB.",
                    status: "error",
                    duration: "2000",
                    isClosable: true,
                    position: "top-right"
                })
                return;
            }
            setImage(reader.result);
        });
        reader.readAsDataURL(file);
    }

    return (
        <>
            {/* Nome */}
            <div style={{
                float: "left",
                width: "40%",
                marginBottom: "1.5%",
            }}>
                <label>
                    Título
                    <label style={{ color: "red" }}> *</label>
                </label>
                <input
                    style={{ height: "-100px" }}
                    id='titulo'
                    type="text"
                    className="form-control"
                    placeholder={ocorrenciaDetails[0]}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
            </div>

            {/* Horário */}
            <div style={{
                float: "left",
                width: "17.5%",
                marginBottom: "1.5%",
                marginLeft: "20%",
                position: "relative",
                display: "inline-block"
            }}>
                <label>
                    Horário
                    <label style={{ color: "red" }}> *</label>
                </label>
                <input
                    id='hora'
                    type="time"
                    className="form-control"
                    placeholder={ocorrenciaDetails[3]}
                    onChange={(e) => sethora(e.target.value)}
                    required
                />

            </div>

            {/* Data */}
            <div style={{
                float: "right",
                width: "17.5%",
                marginBottom: "1.5%"
            }}>
                <label>
                    Data
                    <label style={{ color: "red" }}> *</label>
                </label>
                <input
                    id='data'
                    type="date"
                    className="form-control"
                    placeholder={ocorrenciaDetails[2]}
                    onChange={(e) => setData(e.target.value)}
                    required
                />
            </div>

            {/* Categoria */}
            <div style={{
                float: "left",
                width: "40%",
                marginBottom: "1.5%",
            }}>
                <label>
                    Categoria
                    <label style={{ color: "red" }}> *</label>
                </label>
                <input
                    id='categoria'
                    type="text"
                    className="form-control"
                    placeholder={ocorrenciaDetails[1]}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                />

            </div>

            {/* Localização */}
            <div style={{
                float: "right",
                width: "40%",
                marginBottom: "1.5%",
            }}>
                <label>
                    Localização
                    <label style={{ color: "red" }}> *</label>
                </label>
                <input
                    type="text"
                    id='localizacao'
                    className="form-control"
                    placeholder={ocorrenciaDetails[4]}
                    onChange={(e) => setLocalizacao(e.target.value)}
                    required
                />
            </div>

            {/* Descrição */}
            <div style={{
                float: "left",
                marginBottom: "5%",
                width: "100%"
            }}>
                <label>
                    Descrição
                    <label style={{ color: "red" }}> *</label>
                </label>
                <textarea
                    style={{
                        height: transform(0.5, [0, 1], ["-100px", "550px"]),
                    }}
                    id='descricao'
                    type="text"
                    cols="40"
                    rows="5"
                    maxLength={500}
                    className="form-control"
                    placeholder={ocorrenciaDetails[5]}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                />
            </div>

            {/* Botão Anexar Imagem */}
            <div style={{
                float: "left",
                width: "25%",
                marginTop: "-4%",
                marginRight: "2%"
            }}>
                Imagem
                <input
                    type="file"
                    className="form-control"
                    placeholder="imagem"
                    onChange={e => (handleCompressedUpload(e.target.files[0]))}
                />
            </div>
            <footer>
                {/* Botão Cancelar */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        float: "left",
                        boxShadow: "2px 2px 5px 0 rgba(0,0,0,0.3)"
                    }}
                    type="submit"
                    className="btn btn-primary"
                    background-color="#00abff"
                    onClick={() => handleClose()}
                >
                    Cancelar
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        float: "right",
                        boxShadow: "2px 2px 5px 0 rgba(0,0,0,0.3)"
                    }}
                    type="submit"
                    className="btn btn-primary"
                    background-color="#00abff"
                    onClick={() => patchOcorrencia()}
                >
                    Editar Ocorrência
                </motion.button>
            </footer>

        </>
    )
}

export default EditarOcorrencia