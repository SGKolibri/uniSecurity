import React, { useState } from 'react'
import Navbar from '../Navbar/navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

function SignUp() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')
  const [image, setImage] = useState('');

  //Convert image to base64
  const convertBase64 = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      console.log(reader.result);
      setImage(reader.result);
      localStorage.setItem('userImage', reader.result);
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!name || !surname || !email || !password) {
      toast.error('Preencha todos os campos!', {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Senhas não coincidem!', {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/register-user", {
        name: name,
        surname: surname,
        email: email,
        password: password,
        image: image
      });

      console.log("Data:", response.data);
      console.log("Status: ", response.status);
      console.log("Response: ", response);

      // if request not was successful
      if (response.data.error) {
        toast.error(response.data.error, {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true
        });

      } else {
        toast.success('Usuário registrado com sucesso!', {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true
        });
      }
    } catch (error) {
      console.log("Olha aqui ", error);
      toast.error(error, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true
      });
    }
  }

  return (
    <>
      <ToastContainer />
      <Navbar opacity1={0.75} opacity2={1} />
      <div className="auth-wrapper" style={{ height: "100%" }}>
        <div className="auth-inner" style={{ marginTop: "4%", height: "90%" }}>
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginTop: "-2%" }}>Registrar</h3>

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

            <div className="mb-3">
              <label>Imagem</label>
              <input
                type="file"
                className="form-control"
                // required
                onChange={e => setImage(e.target.value)}
              />

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
                className="btn btn-primary">
                Registrar
              </motion.button>
            </div>
            <p className="forgot-password text-right">
              <a href="/login">Já registrado?</a>
            </p>
          </form>
        </div >
      </div >
    </>
  )

}

export default SignUp;
