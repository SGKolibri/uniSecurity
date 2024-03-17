import React, { useState } from 'react'
import Navbar from '../Navbar/navbar';
import axios from 'axios';
import { useSignIn } from 'react-auth-kit';
import { Button, useToast } from '@chakra-ui/react'
import { MdOutlineEmail } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { motion } from 'framer-motion';
// import UserContext from '../Context/user-context'

export default function Login() {

  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

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

      setUser(response.data);

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
          expiresIn: 3600, // token expira em 1 hora
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
      {/* <Navbar opacity1={1} opacity2={0.75} /> */}

      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 ">
        <div className="flex flex-col items-center justify-center w-11/12  max-w-md px-4 py-8 bg-white shadow-lg rounded-2xl">
          <div className="flex flex-col w-full mb-8">
            <div className="flex flex-col mb-4">

              {/* Title */}
              <div className="flex items-center justify-center w-full">
                <h1 className="text-3xl font-semibold text-gray-900">
                  Login
                </h1>
              </div>
            </div>

            {/* Subtitle */}
            <div className="flex w-full">
              <div className="flex items-center justify-center w-full">
                <span className="text-sm text-gray-500 text-center">
                  Não possui cadastro?
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full pb-4 -mt-6">
            <div className="flex items-center justify-center w-full">
              <span className="text-sm text-gray-500 text-center">
                Entre em contato com o administrador do sistema.
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col w-full">
            <form onSubmit={handleLogin}>
              <div className="flex flex-col mb-4">
                <div className="flex relative ">
                  <span className="rounded-l-md inline-flex items-center px-3 border-t bg-white border-l border-b border-gray-300 text-gray-500 shadow-sm text-sm">
                    <MdOutlineEmail />
                  </span>
                  <input
                    type="email"
                    className="rounded-r-md flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col mb-6">
                <div className="flex relative ">
                  <span className="rounded-l-md inline-flex items-center px-3 border-t bg-white border-l border-b border-gray-300 text-gray-500 shadow-sm text-sm">
                    <IoKeyOutline />
                  </span>
                  <input
                    type="password"
                    className="rounded-r-md flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Senha"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex w-full">
                <Button type="submit" className="py-2 px-4 w-full shadow-md rounded-lg" colorScheme='blue'>
                  Login
                </Button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center justify-center w-full py-4">
            <span className="text-sm text-gray-500">
              © 2021 - Todos os direitos reservados à FTT
            </span>
          </div>

        </div >
      </div >

    </>
  )

}
