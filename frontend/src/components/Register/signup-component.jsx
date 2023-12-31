import React, { useState } from 'react'
import Navbar from '../Navbar/navbar';
import axios from 'axios';
import { motion } from 'framer-motion';
import Modal from 'react-bootstrap/Modal';
import Avatar from 'react-avatar-edit'
import { useToast } from '@chakra-ui/react'
import useWindowDimensions from '../Utils/getWindowDimensions';
import { Link } from 'react-router-dom';

import bgJPG from '../../images/bg.jpg';

function SignUp() {

    let ROUTE = process.env.REACT_APP_BACKEND_ROUTE;
    console.log("ROUTE :", ROUTE)

    const toast = useToast()

    const { width } = useWindowDimensions();

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [image, setImage] = useState('');

    //Modal
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
        toast({
            title: "Imagem adicionada com sucesso!",
            position: "center",
            status: "success",
            duration: 2500,
            isClosable: true,
        })
    };
    const handleShow = () => setShow(true);

    const handleSubmit = async e => {

        e.preventDefault();

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
            const response = await axios.post(`${ROUTE}register-user`, {
                name: name,
                surname: surname,
                email: email,
                password: password,
                image: image
            });

            // if request not was successful
            if (response.data.error) {
                toast({
                    title: "Erro ao registrar usuário!",
                    description: response.data.error,
                    position: "center",
                    status: "error",
                    duration: 2500,
                })

            } else {
                toast({
                    title: "Usuário registrado com sucesso!",
                    position: "center",
                    status: "success",
                    duration: 2500,
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Navbar opacity1={0.75} opacity2={1} />
            {width > 992 ?
                (
                    // Desktop Version
                    <div className="auth-wrapper"
                        style={{
                            zIndex: -1,
                            backgroundImage: `url(${bgJPG})`,
                        }}
                    >
                        <div
                            className="auth-inner"
                            style={{
                                justifySelf: "center",
                                alignSelf: "center",
                                position: "relative",
                                marginTop: "7.5%",
                            }}
                        >
                            <form onSubmit={handleSubmit}>
                                <h3>Registrar</h3>
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
                                <div className="d-grid">
                                    <label>Adicionar imagem</label>
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
                                        Selecionar imagem
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
                                                <Avatar
                                                    alt="profile-img-file-input"
                                                    size={150}
                                                    onCrop={(preview) => setImage(preview)}
                                                    type="file"
                                                    className="form-control"
                                                    placeholder="selecione uma imagem"
                                                    accept="image/jpeg, image/png"
                                                    width={250}
                                                    height={250}
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
                                <div className="d-grid">
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
                                        Registrar
                                    </motion.button>
                                </div>
                                <p className="forgot-password text-right">
                                    <a href="/login">Já registrado?</a>
                                </p>
                            </form>
                        </div >
                    </div >
                ) : (
                    // Mobile Version
                    <div className="auth-wrapper"
                        style={{
                            zIndex: -1,
                            backgroundImage: `url(${bgJPG})`,
                        }}
                    >
                        <div
                            className="auth-inner"
                            style={{
                                position: "relative",
                                width: "95%",
                                padding: "10%",
                                marginTop: "20%",
                                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)"
                            }}
                        >
                            <form onSubmit={handleSubmit}>
                                <h3>Criar Conta</h3>

                                <hr
                                    style={{
                                        marginTop: "25px",
                                        marginBottom: "50px",
                                    }}
                                />

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
                                        marginBottom: "5%",
                                        marginTop: "10%"
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
                                                <Avatar
                                                    alt="profile-img-file-input"
                                                    size={150}
                                                    onCrop={(preview) => setImage(preview)}
                                                    type="file"
                                                    className="form-control"
                                                    placeholder="selecione uma imagem"
                                                    accept="image/jpeg, image/png"
                                                    width={250}
                                                    height={250}
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
                                <div className="d-grid">
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
                                        Criar conta
                                    </motion.button>
                                </div>
                                <p className="forgot-password text-center">
                                    <Link to="/login">Já possui conta?</Link>
                                </p>
                            </form>
                        </div >
                    </div >
                )}

        </>
    )

}

export default SignUp;
