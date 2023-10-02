import React, { useState } from 'react'
import Navbar from '../Navbar/navbar';
import axios from 'axios';
import { useSignIn } from 'react-auth-kit';
import { useToast } from '@chakra-ui/react'
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";

export default function Login() {

  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const [credentialResponse, setCredentialResponse] = useState(null);

  const signIn = useSignIn();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Preencha todos os campos.",
        position: "top-right",
        status: "error",
        duration: 2500,
        isClosable: true,
      })
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/login-user", {
        email: email,
        password: password
      })

      console.log("Response: ", response.data.error)

      if (response.data.error !== undefined) {
        toast({
          title: response.data.error,
          position: "top-right",
          status: "error",
          duration: 2500,
          isClosable: true,
        })
        return;
      }

      const responseUser = await axios.get(`http://localhost:3000/get-user/${email}`);

      localStorage.setItem('userName', responseUser.data.name);
      localStorage.setItem('userSurname', responseUser.data.surname);
      localStorage.setItem('userImage', responseUser.data.image);

      setUser(response.data);
      localStorage.setItem('userEmail', email);

      if (response.data.token !== undefined) {
        signIn({
          token: response.data.token,
          expiresIn: 3600, // token expira em 1 hora
          tokenType: 'Bearer',
          authState: { email: email }
        });
        localStorage.setItem('loggedIn', true);
        window.location.href = "/home/reg-ocorrencia";
      }

    } catch (error) {
      toast({
        title: "Erro ao conectar com o servidor.",
        position: "top-right",
        status: "error",
        duration: 2500,
        isClosable: true,
      })
      if (!error?.response) {
        setError("Erro ao conectar com o servidor");
      } else if (!user) {
        setError("Erro ao realizar login.");
      }
    }
  };

  return (
    <>
      <Navbar opacity1={1} opacity2={0.75} />
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form
            onSubmit={handleLogin}
          >
            <h3>Login</h3>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="digite seu email"
                // required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Senha</label>
              <input
                type="password"
                className="form-control"
                placeholder="digite sua senha"
                // required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="d-grid">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  boxShadow: "0px 0px 12px 0px rgba(0,0,0,0.2)",
                }}
                type="submit"
                className="btn btn-primary"
                background-color="#0850BC"
              >
                Login
              </motion.button>

              <hr />

              <div id="google-login"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <GoogleLogin
                  onSuccess={credentialResponse => {
                    let decoded = jwt_decode(credentialResponse.credential);
                    setCredentialResponse(decoded);
                    console.log(decoded);
                    localStorage.setItem('userGoogleName', decoded.name);
                    localStorage.setItem('userGoogleImage', decoded.picture);
                    localStorage.setItem('userGoogleEmail', decoded.email);
                    signIn({
                      token: credentialResponse.credential,
                      expiresIn: 3600, // token expira em 1 hora
                      tokenType: 'Bearer',
                      authState: { email: email }
                    });
                    window.location.href = "/home/reg-ocorrencia";
                  }}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                />
              </div>

            </div>
          </form>
          <p className="forgot-password text-right">
            Não possui login <a href="/register">registrar?</a>
          </p>
        </div >
      </div >
    </>
  )

}
