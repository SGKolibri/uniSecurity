import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { motion, transform } from 'framer-motion'
import Modal from 'react-bootstrap/Modal'
import useWindowDimensions from '../Utils/getWindowDimensions'
import Compressor from 'compressorjs'

function CriarOcorrencia() {

    const { width } = useWindowDimensions();

    const toast = useToast();

    /* Image Compressor */
    const handleCompressedUpload = (imageToBeCompressed) => {
        new Compressor(imageToBeCompressed, {
            quality: 0.8,
            success: (result) => {
                const formData = new FormData();
                // The third parameter is required for server
                formData.append('file', result, result.name);
                encodeImageFileAsURL(result)
            },
        });
    };

    /* convert image to base64 */
    function encodeImageFileAsURL(element) {
        let file = element;
        let reader = new FileReader();
        reader.addEventListener("load", function () {
            if (reader.result.length > 1048576) {
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


    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [hora, setHorario] = useState('');
    const [categoria, setCategoria] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [image, setImage] = useState('');

    /* Open and Close Modal */
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif';
    const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() });

    const handleSubmit = async e => {
        e.preventDefault();

        console.log("Inside handle: ", image.length)

        if (nome === '' || data === '' || hora === '' || categoria === '' || localizacao === '' || descricao === '') {
            toast({
                title: "Preencha todos os campos!",
                description: "Campos não foram preenchidos corretamente.",
                status: "error",
                duration: "2000",
                isClosable: true,
                position: "top-right"
            })
            return;
        }

        console.log(image)

        /* Enviar os dados para o backend */
        const response = await fetch("http://localhost:3000/reg-ocorrencia", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, data, hora, categoria, localizacao, descricao, image })
        });

        console.log("Response: ", response)

        toast({
            title: "Ocorrência registrada!",
            description: "Sucesso ao registrar a ocorrência.",
            status: "success",
            duration: "2000",
            isClosable: true,
            position: "bottom-center"
        })
        clearAllField();
    }

    /* Limpar os campos das ocorrências */
    const clearFields = () => {
        if (nome === '' && data === '' && hora === '' && categoria === '' && localizacao === '' && descricao === '') {
            toast({
                title: "Nenhuma ocorrência para cancelar!",
                description: "Campos já estão limpos.",
                status: "error",
                duration: "2000",
                isClosable: true,
                position: "bottom-center"
            })
            handleClose();
            return;
        }
        toast({
            title: "Ocorrência cancelada com sucesso!",
            status: "success",
            duration: "2000",
            isClosable: true,
            position: "bottom-center"
        })
        clearAllField();
        handleClose();
    }

    const clearAllField = () => {
        setNome("");
        setData("");
        setHorario("");
        setCategoria("");
        setLocalizacao("");
        setDescricao("");
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
        const textarea = document.querySelectorAll('textarea');
        textarea.forEach(textarea => textarea.value = '');
        const file = document.querySelectorAll('file');
        file.forEach(file => file.value = '');
    }


    return (
        <>

            {width > 992 ? (

                <div className="auth-wrapper">
                    <div style={{
                        width: "98%",
                        height: "89%",
                        maxHeight: "89%",
                        marginTop: "4.5%",
                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)"
                    }}
                        className="auth-inner"
                    >
                        <div style={{
                            marginTop: "-1.5%",
                            marginBottom: "2%",
                            marginLeft: "-1%",
                            fontSize: 30
                        }}>
                            Registrar Ocorrência
                        </div>
                        {/* Nome */}
                        <div style={{
                            float: "left",
                            width: "40%",
                            marginBottom: "1.5%",
                        }}>
                            <label>
                                Nome
                            </label>
                            <input
                                style={{ height: "-100px" }}
                                id='nome'
                                type="text"
                                className="form-control"
                                placeholder="Nome da ocorrência"
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
                            </label>
                            <input
                                id='horario'
                                type="time"
                                className="form-control"
                                placeholder="Horário da ocorrência"
                                onChange={(e) => setHorario(e.target.value)}
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
                            </label>
                            <input
                                id='data'
                                type="date"
                                className="form-control"
                                placeholder="Data da ocorrência"
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
                            </label>
                            <input
                                id='categoria'
                                type="text"
                                className="form-control"
                                placeholder="Categoria da ocorrência"
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
                            </label>
                            <input
                                type="text"
                                id='localizacao'
                                className="form-control"
                                placeholder="Localização da ocorrência"
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
                            </label>
                            <textarea
                                style={{
                                    height: transform(0.5, [0, 1], ["-100px", "550px"]),
                                }}
                                id='descricao'
                                type="text"
                                cols="40"
                                rows="5"
                                className="form-control"
                                placeholder="Descrição da ocorrência"
                                onChange={(e) => setDescricao(e.target.value)}
                                required
                            />
                        </div>

                        {/* Botão Anexar Imagem */}
                        <div style={{
                            float: "left",
                            width: "25%",
                            marginTop: "-4%",
                            marginRight: "2%",
                        }}>
                            Anexar imagem
                            <input
                                type="file"
                                accept={acceptedFileTypesArray}
                                multiple={false}
                                id='image'
                                className="form-control"
                                placeholder="imagem"
                                onChange={e => (handleCompressedUpload(e.target.files[0]))}
                            />
                        </div>

                        {/* Botão Salvar */}
                        <div style={{
                            float: "right",
                            width: "50%",
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "-1.5%",
                        }} className='wrapperButton'>

                            {/* Botão Cancelar */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{

                                    width: "25%",
                                    marginRight: "2%",
                                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)"
                                }}
                                className='btn btn-primary'
                                onClick={() => (handleShow())}
                            >
                                Cancelar
                            </motion.button >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{

                                    width: "25%",
                                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)"
                                }}
                                type="submit"
                                className="btn btn-primary"
                                background-color="#4DA325"
                                onClick={handleSubmit}
                            >
                                Salvar
                            </motion.button>
                        </div>

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Deseja cancelar a ocorrência?</Modal.Title>
                            </Modal.Header>
                            <Modal.Footer>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    variant="primary"
                                    className='btn btn-primary'
                                    style={{
                                        marginRight: "0.5%",
                                        backgroundColor: "#4DA325",
                                        border: "none",
                                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
                                    }}
                                    onClick={clearFields}>
                                    Cancelar ocorrência
                                </motion.button>
                            </Modal.Footer>
                        </Modal>
                    </div >
                </div >

            ) : (
                // Mobile Version
                <div className="auth-wrapper">
                    <div className='auth-inner'
                        style={{
                            height: "100%",
                            width: "95%",
                            padding: "10%",
                            marginTop: "20%",
                            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)"
                        }}
                    >
                        <div
                            style={{
                                textAlign: "center",
                                alignItems: "center",
                            }}
                        >
                            <h
                                style={{
                                    fontSize: 28,
                                }}

                            >
                                Registrar
                            </h>
                        </div>

                        {/* Título */}
                        <div style={{
                            width: "100%",
                            marginTop: "10%",
                            marginBottom: "5%",
                        }}>
                            <label>
                                Título
                            </label>
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <input
                                    id='nome'
                                    type="text"
                                    className="form-control"
                                    placeholder="Título da ocorrência"
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Categoria */}
                        <div style={{
                            width: "100%",
                            marginBottom: "5%",
                        }}>
                            <label>
                                Categoria
                            </label>
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <input
                                    id='categoria'
                                    type="text"
                                    className="form-control"
                                    placeholder="Categoria da ocorrência"
                                    onChange={(e) => setCategoria(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Localização */}
                        <div style={{
                            width: "100%",
                            marginBottom: "5%",
                        }}>
                            <label>
                                Localização
                            </label>
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <input
                                    id='localizacao'
                                    type="text"
                                    className="form-control"
                                    placeholder="Localização da ocorrência"
                                    onChange={(e) => setLocalizacao(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Descrição */}
                        <div style={{
                            width: "100%",
                            marginBottom: "5%",
                        }}>
                            <label>
                                Descrição
                            </label>
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <textarea
                                    style={{
                                        height: transform(0.5, [0, 1], ["-100px", "450px"]),
                                    }}
                                    id='descricao'
                                    type="text"
                                    cols="40"
                                    rows="5"
                                    className="form-control"
                                    placeholder="Descrição da ocorrência"
                                    onChange={(e) => setDescricao(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Data*/}
                        <div style={{
                            width: "40%",
                            marginBottom: "5%",
                            position: "relative",
                            display: "inline-block",
                            float: "left",
                        }}>
                            <label>
                                Data
                            </label>
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <input
                                    id='data'
                                    type="date"
                                    className="form-control"
                                    placeholder="Data da ocorrência"
                                    onChange={(e) => setData(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Horário */}
                        <div
                            style={{
                                width: "40%",
                                marginBottom: "5%",
                                position: "relative",
                                display: "inline-block",
                                float: "right",
                            }}
                        >
                            <label>
                                Horário
                            </label>
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                }}
                            >
                                <input
                                    id='horario'
                                    type="time"
                                    className="form-control"
                                    placeholder="Horário da ocorrência"
                                    onChange={(e) => setHorario(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Botão Anexar imagem */}
                        <div style={{
                            width: "100%",
                            marginBottom: "5%",
                        }}>
                            <label>
                                Anexar imagem
                            </label>
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <input
                                    type="file"
                                    accept={acceptedFileTypesArray}
                                    multiple={false}
                                    id='image'
                                    className="form-control"
                                    placeholder="imagem"
                                    onChange={e => (handleCompressedUpload(e.target.files[0]))}
                                />
                            </div>
                        </div>

                        {/* Botão Cancelar */}
                        <div style={{
                            width: "40%",
                            marginBottom: "5%",
                            position: "relative",
                            display: "inline-block",
                            float: "left",
                        }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    width: "100%",
                                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)"
                                }}
                                className='btn btn-primary'
                                onClick={() => (handleShow())}
                            >
                                Cancelar
                            </motion.button >
                            <Modal show={show} onHide={handleClose} centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>Deseja cancelar a ocorrência?</Modal.Title>
                                </Modal.Header>
                                <Modal.Footer>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        variant="primary"
                                        className='btn btn-primary'
                                        style={{
                                            marginRight: "0.5%",
                                            backgroundColor: "#4DA325",
                                            border: "none",
                                            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",

                                        }}
                                        onClick={clearFields}>
                                        Cancelar ocorrência
                                    </motion.button>
                                </Modal.Footer>
                            </Modal>
                        </div>

                        {/* Botão Salvar */}
                        <div style={{
                            width: "40%",
                            marginBottom: "5%",
                            position: "relative",
                            display: "inline-block",
                            float: "right",
                        }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    width: "100%",
                                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)"
                                }}
                                type="submit"
                                className="btn btn-primary"
                                background-color="#4DA325"
                                onClick={handleSubmit}
                            >
                                Salvar
                            </motion.button>
                        </div>

                    </div>
                </div>

            )}

        </>
    )
}

export default CriarOcorrencia