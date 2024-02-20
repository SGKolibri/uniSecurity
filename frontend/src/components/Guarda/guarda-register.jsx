import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { motion } from 'framer-motion';
import Modal from 'react-bootstrap/Modal';
import Avatar from 'react-avatar-edit'
import { useToast } from '@chakra-ui/react'
import useWindowDimensions from '../Utils/getWindowDimensions';

function SignUp() {

    let backendURL = process.env.REACT_APP_BACKEND_URL;

    const toast = useToast()

    const { width } = useWindowDimensions();

    const curUser = localStorage.getItem("userName")

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [image, setImage] = useState('');

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
        toast({
            title: "Imagem adicionada com sucesso!",
            position: "center",
            status: "success",
            duration: 2000,
            isClosable: true,
        })
    };
    const handleShow = () => setShow(true);

    const handleSubmit = async e => {
        if (!name || !surname || !email || !password) {
            toast({
                title: "Preencha todos os campos!",
                description: "Todos os campos devem estar preenchidos.",
                position: "center",
                status: "error",
                duration: 2500,
                isClosable: true,
            })
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Senhas não coincidem!",
                description: "As senhas devem ser iguais.",
                position: "center",
                status: "error",
                duration: 2500,
                isClosable: true,
            })
            return;
        }

        try {
            await axios.post(`${backendURL}/register-user`, {
                name: name,
                surname: surname,
                email: email,
                password: password,
                image: image
            });

            toast({
                title: "Usuário registrado com sucesso!",
                description: "Tela será recarregada.",
                position: "center",
                status: "success",
                duration: 2500,
            })
            setTimeout(() => {
                window.location.reload();
            }, 2500);

        } catch (error) {
            toast({
                title: "Erro ao registrar usuário!",
                position: "center",
                status: "error",
                duration: 2500,
            })
        }

    }


    return (
        <>
            <div
                className="container"
                style={{
                    position: "relative"
                }}
            >
                <div className="mb-3">
                    <label>Nome</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="nome"
                        // required
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label>Sobrenome</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="sobrenome"
                        // required
                        onChange={e => setSurname(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="digite seu email"
                        // required
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label>Senha</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="digite sua senha"
                        minLength={6}
                        maxLength={12}
                        // required
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                {/* Confirmar senha */}
                <div className="mb-3">
                    <label>Confirmar senha</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="confirme sua senha"
                        minLength={6}
                        maxLength={12}
                        // required
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>

                {/* Imagem */}
                <div className="d-grid"
                    style={{
                        marginTop: "5%"
                    }}
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.2)",
                            backgroundColor: "#fff",
                            borderColor: "rgba(0,0,0,0.3)",
                            borderWidth: "1px",
                            height: "40px",
                            marginBottom: "5%",
                            color: "#000"
                        }}
                        className='btn btn-primary'
                        type="button"
                        onClick={() => (handleShow())}
                    >
                        Adicionar imagem
                    </motion.button>

                    {/* Modal */}
                    <Modal show={show} onHide={() => handleClose}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Selecionar imagem</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                            </div>
                            <div className="modal-body" style={{
                                display: "flex",
                                justifyContent: "center",

                            }}>
                                {/* Mobile Avatar */}
                                <Avatar
                                    alt="profile-img-file-input"
                                    size={150}
                                    onCrop={(preview) => setImage(preview)}
                                    type="file"
                                    className="form-control"
                                    placeholder="selecione uma imagem"
                                    accept="image/jpeg, image/png"
                                    // limit size so that it doesn't overflow
                                    width={width > 450 ? 250 : 150}
                                    height={width > 450 ? 250 : 150}
                                    style={{
                                        padding: "80px",
                                    }}

                                />
                                <div>
                                    {image && <img alt="profile" src={image} />}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Fechar</button>

                            </div>
                        </div>
                    </Modal>
                </div>

                {/* Botão registrar */}
                <div className="d-grid"
                    style={{
                        marginBottom: "5%"
                    }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            boxShadow: "0px 0px 12px 0px rgba(0,0,0,0.2)",
                        }}
                        type="submit"
                        className="btn btn-primary"
                        onClick={(e) => handleSubmit(e)}
                    >
                        Registrar Guarda
                    </motion.button>
                </div>
            </div >
        </>
    )

}

export default SignUp;