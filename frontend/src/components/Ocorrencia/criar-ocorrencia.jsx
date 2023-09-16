import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { motion, transform } from 'framer-motion'
import Modal from 'react-bootstrap/Modal';

function CriarOcorrencia() {

    const toast = useToast();

    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [hora, setHorario] = useState('');
    const [categoria, setCategoria] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [descricao, setDescricao] = useState('');

    /* Open and Close Modal */
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = async e => {
        e.preventDefault();

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

        /* Enviar os dados para o backend */
        const response = await fetch("http://localhost:3000/reg-ocorrencia", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, data, hora, categoria, localizacao, descricao })
        });
        console.log(response)

        toast({
            title: "Ocorrência registrada!",
            description: "Sucesso ao registrar a ocorrência.",
            status: "success",
            duration: "2000",
            isClosable: true,
            position: "top-right"
        })
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
                position: "top-right"
            })
            handleClose();
            return;
        }
        toast({
            title: "Ocorrência cancelada com sucesso!",
            status: "success",
            duration: "2000",
            isClosable: true,
            position: "top-right"
        })
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
        handleClose();
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
                    Nome
                    <label style={{ color: "red" }}> *</label>
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
                    <label style={{ color: "red" }}> *</label>
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
                    <label style={{ color: "red" }}> *</label>
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
                    <label style={{ color: "red" }}> *</label>
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
                    <label style={{ color: "red" }}> *</label>
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
                    className="form-control"
                    placeholder="imagem"
                    onChange={e => this.setState({ image: e.target.value })}
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
        </>
    )
}

export default CriarOcorrencia