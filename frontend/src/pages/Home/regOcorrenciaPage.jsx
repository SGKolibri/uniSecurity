import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence, transform } from 'framer-motion'
import 'react-toastify/dist/ReactToastify.css';

/* Components */
import NavbarHome from '../../components/Navbar/navbar-home.component'
import Modal from '../../components/Modal/index';


function RegOcorrenciaPage() {

    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [hora, setHorario] = useState('');
    const [categoria, setCategoria] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [descricao, setDescricao] = useState('');

    /* Open and Close Modal */
    const [modalOpen, setModalOpen] = useState(false);

    const open = () => setModalOpen(true);
    const close = () => setModalOpen(false);

    const handleSubmit = async e => {
        e.preventDefault();

        //check if all fields are filled
        if (nome === '' || data === '' || hora === '' || categoria === '' || localizacao === '' || descricao === '') {
            toast.error('Por favor, preencha todos os campos!', {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true
            });
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

        toast.success('Ocorrência registrada com sucesso!', {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true
        });
        setNome("");
        setData("");
        setHorario("");
        setCategoria("");
        setLocalizacao("");
        setDescricao("");
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => input.value = '');

    }

    /* Limpar os campos das ocorrências */
    const clearFields = () => {
        toast.success('Ocorrência cancelada com sucesso!', {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true
        });
        setNome("");
        setData("");
        setHorario("");
        setCategoria("");
        setLocalizacao("");
        setDescricao("");
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
        close();
    }

    return (
        <>
            <ToastContainer />

            <NavbarHome opacity1={1} opacity2={0.75} />

            <div className="auth-wrapper">
                <div style={{
                    width: "98%",
                    height: "86%",
                    marginTop: "4.5%",
                }}
                    className="auth-inner">
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
                        <input
                            style={{
                                height: transform(0.5, [0, 1], ["-100px", "550px"]),
                            }}
                            id='descricao'
                            type="text"
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
                        marginRight: "2%"
                    }}>
                        <b>Anexar imagem</b>
                        <input
                            type="file"
                            className="form-control"
                            placeholder="imagem"
                            onChange={e => this.setState({ image: e.target.value })}
                        />
                    </div>

                    {/* Botão Salvar */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            float: "right",
                            width: "10%",
                            marginTop: "-2%",
                            marginLeft: "2%"
                        }}
                        type="submit"
                        className="btn btn-primary"
                        background-color="#4DA325"
                        onClick={handleSubmit}
                    >
                        Salvar
                    </motion.button>

                    {/* Botão Cancelar */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            float: "right",
                            width: "10%",
                            marginTop: "-2%",
                            marginRight: "2%"
                        }}
                        className='btn btn-primary'
                        onClick={() => (modalOpen ? close() : open())}
                    >
                        Cancelar
                    </motion.button>

                    {/* Modal */}
                    <AnimatePresence
                        initial={false}
                        wait={true}
                        onExitComplete={() => null}
                    >
                        {modalOpen &&
                            <Modal modalOpen={modalOpen} handleClose={close}
                                child={
                                    <>
                                        <div
                                            style={{
                                                position: 'relative',
                                                fontSize: '1.5rem',
                                                textAlign: 'center',
                                                top: '50px',
                                            }}
                                        >
                                            Para cancelar a Ocorrência atual clique em 'Ok'.
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            style={{
                                                position: 'absolute',
                                                top: '220%',
                                                width: '50%',
                                                right: '-40%',
                                                cursor: 'pointer',
                                            }}
                                            className='btn btn-primary'
                                            onClick={clearFields}
                                        >
                                            Ok
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            style={{
                                                position: 'absolute',
                                                top: '220%',
                                                width: '50%',
                                                left: '-40%',
                                                background: 'transparent'
                                            }}
                                            className="form-control"
                                            onClick={close}
                                        >
                                            Cancelar
                                        </motion.button>
                                    </>
                                }
                            >

                            </Modal>}

                    </AnimatePresence>

                </div >
            </div >
        </>
    )
}

export default RegOcorrenciaPage