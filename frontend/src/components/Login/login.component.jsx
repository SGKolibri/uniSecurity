import React, { useState } from 'react'
import Navbar from '../Navbar/navbar.component';
import axios from 'axios';
import { useSignIn } from 'react-auth-kit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const signIn = useSignIn();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Preencha todos os campos.");
      return console.log(error);
    }

    try {
      const response = await axios.post("http://localhost:3000/login-user", {
        email: email,
        password: password
      });
      setUser(response.data);
      console.log(response.data);
      console.log("Response: ", response);

      // 
      if (response.data.token !== undefined) {
        signIn({
          token: response.data.token,
          expiresIn: 3600, // token expira em 1 hora
          tokenType: 'Bearer',
          authState: { email: email }
        });
        window.location.href = "/home/reg-ocorrencia";
      }
      toast.error("Erro ao realizar login!");

    } catch (error) {
      toast.error("Erro ao realizar login!");
      if (!error?.response) {
        setError("Erro ao conectar com o servidor");
      } else if (error.response.status === 401) {
        setError("Email ou senha incorretos");
      }
    }

  };

  return (
    <>
      <ToastContainer />
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
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Senha</label>
              <input
                type="password"
                className="form-control"
                placeholder="digite sua senha"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label onClick={() => alert("lembrado")} className="custom-control-label" htmlFor="customCheck1">
                  Lembrar de mim
                </label>
              </div>
            </div>

            <div className="d-grid">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="btn btn-primary"
                background-color="#0850BC"
              >
                Login
              </motion.button>
            </div>
            {/* <p className="forgot-password text-right">
                Esqueceu sua <a href="#">senha?</a>
              </p> */}
          </form>
        </div >
      </div >
    </>
  )

}
