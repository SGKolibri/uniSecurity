import React, { useState } from 'react'
import Navbar from '../../components/Navbar/navbar'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'

export const RecoverPassword = () => {

    let ROUTE = process.env.REACT_APP_BACKEND_ROUTE || process.env.REACT_APP_VERCEL_ROUTE;

    const toast = useToast();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRecoverPassword = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast({
                title: "Preencha todos os campos.",
                position: "center",
                status: "error",
                duration: 2500,
                isClosable: true,
            })
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "As senhas não coincidem.",
                position: "center",
                status: "error",
                duration: 2500,
                isClosable: true,
            })
            return;
        }

        const response = await axios.patch(ROUTE + `user-recover-password`, {
            email: "admin@gmail.com",
            password: password
        })
            .then((response) => {
                console.log("Response: ", response.data.error)
                if (response.data.error !== undefined) {
                    toast({
                        title: response.data.error,
                        position: "center",
                        status: "error",
                        duration: 2500,
                        isClosable: true,
                    })
                    return;
                }
                console.log("Response 2: ", response.data)
                toast({
                    title: "Senha alterada com sucesso.",
                    position: "center",
                    status: "success",
                    duration: 2500,
                    isClosable: true,
                })
            })

    }

    return (
        <>
            <Navbar />
            <div
                style={{
                    marginTop: "7%",
                    height: "500px"
                }}
                className='auth-inner recover-password'
            >
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "2rem"
                    }}
                >
                    Criar nova senha
                </h2>

                <form
                    onSubmit={handleRecoverPassword}
                >
                    <div className="mb-3">
                        <label>Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="digite sua nova senha"
                            minLength={6}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                marginBottom: "1rem"
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Confirmar senha</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirme sua nova senha"
                            minLength={6}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{
                                marginBottom: "1rem"
                            }}
                        />
                    </div>
                    <motion.button
                        // onClick={handleRecoverPassword}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn btn-primary"
                        style={{
                            backgroundColor: "#0850BC",
                            boxShadow: "0px 0px 12px 0px rgba(0,0,0,0.2)",
                            width: "100%",
                            marginTop: "125px"
                        }}
                        type='submit'
                    >
                        Enviar
                    </motion.button>
                </form>


            </div>
        </>
    )
}

export default RecoverPassword
