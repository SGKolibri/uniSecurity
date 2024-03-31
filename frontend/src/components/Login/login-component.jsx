import { Input } from '@chakra-ui/react';
import BlueBg from '../../images/bg-o.png';
import React, { useState } from 'react'
import { useSignIn } from 'react-auth-kit';
import { Button, useToast } from '@chakra-ui/react'
import { MdOutlineEmail } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { motion } from 'framer-motion';
import guardaLogo from '../../images/guarda-logo.png';
import axios from 'axios';

export default function LoginComponent() {

    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = useSignIn();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast({
                title: "Preencha todos os campos.",
                position: "bottom-center",
                status: "error",
                duration: 2500,
                isClosable: true,
            })
            return;
        }

        try {
            const response = await axios.post(`${backendURL}/login-user`, {
                email: email,
                password: password
            });

            if (response.data.error !== undefined) {
                toast({
                    title: response.data.error,
                    position: "bottom-center",
                    status: "error",
                    duration: 2500,
                    isClosable: true,
                })
                return;
            }

            const userDetails = {
                name: response.data.name,
                surname: response.data.surname,
                email: response.data.email,
                role: response.data.role,
            }


            if (response.data.token !== undefined) {
                signIn({
                    user: response.data,
                    token: response.data.token,
                    expiresIn: 3600,
                    tokenType: 'Bearer',
                    authState: { userDetail: userDetails }
                });
                window.location.href = "/home/reg-ocorrencia";
            }

        } catch (error) {
            toast({
                title: "Erro ao conectar com o servidor.",
                position: "bottom-center",
                status: "error",
                duration: 2500,
                isClosable: true,
            })
        }
    };


    return (
        <>
            <div className="bg-gradient-md md:bg-gradient-bg w-screen h-screen place-items-center flex">
                <div className='hidden md:block w-3/4 h-5/6 ml-16 lg:ml-32 custom14:ml-64 relative'>
                    <div className='w-full bg-white h-full md:rounded-l-3xl' >
                        <img src={BlueBg} className="absolute rounded-l-3xl rounded-r-3xl top-0 left-0 w-full h-full object-cover" alt="background" ></img>
                    </div>
                </div>
                <div className=' w-full md:h-5/6 pt-4 md:pt-0 ml-8 mr-8 sm:ml-16 md:ml-0 sm:mr-16 lg:mr-32 custom14:mr-64 rounded-l-none rounded-r-none md:rounded-l-none md:rounded-r-3xl justify-start place-items-center text-center bg-white flex flex-col'>
                    <div className='w-full flex justify-center items-center'>
                        <img src={guardaLogo} alt="logo" className='w-[40%] md:w-1/4 py-3' />
                    </div>

                    <div className="w-full flex flex-col py-4 md:py-2 gap-5">
                        <label className='text-2xl font-semibold block md:hidden'>
                            Log-In
                        </label>
                        <form onSubmit={(e) => handleLogin(e)} className="flex flex-col gap-[40px] items-center">
                            <div className='w-full md:w-3/5 flex flex-col items-center'>
                                <div className='w-full'>
                                    <label className='block md:hidden text-[#555] py-1 font-normal text-sm'>
                                        Usuário
                                    </label>
                                </div>
                                <div className='w-3/4 border-[#aaa] rounded-md'>
                                    <Input type='email' onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />
                                </div>
                            </div>
                            <div className='w-full md:w-3/5 flex flex-col items-center'>
                                <div className='w-full'>
                                    <label className='block md:hidden text-[#555] py-1 font-normal text-sm'>
                                        Senha
                                    </label>
                                </div>
                                <div className='w-3/4 border-[#aaa] rounded-md'>
                                    <Input type='password' onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
                                </div>
                            </div>
                            <div className='w-1/2 md:w-2/5 py-[24px] md:py-0'>
                                <motion.button whileTap={{ scale: 0.98 }} className="bg-[#0C5668] md:bg-black w-full text-white font-bold py-2 rounded-md">
                                    Entrar
                                </motion.button>
                            </div>
                        </form>
                    </div>
                    <div className='hidden md:flex font-lg font-normal flex-col px-2'>
                        <label>Não possui cadastro?</label>
                        <label>Contate o administrador do sistema.</label>
                    </div>
                    <div>
                        <label className='hidden md:block text-sm font-bold py-3'>
                            © 2024 - Todos os direitos reservados à FTT
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}