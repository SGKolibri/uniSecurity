import React, { Component, useState } from 'react'
import Navbar from '../Navbar/navbar.component';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { color, motion } from 'framer-motion';

function SignUp() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
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
        <div className="auth-inner" style={{ height: "82%" }}>
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

            <div className="mb-3">
              <label>Imagem</label>
              <input
                type="file"
                className="form-control"
                // required
                onChange={convertBase64}
              />
              {image && (
                <img
                  src={image}
                  alt=""
                  style={{ height: '100px', width: '100px' }}
                />
              )}
            </div>


            <div className="d-grid">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="btn btn-primary">
                Registrar
              </motion.button>
            </div>
            <p className="forgot-password text-right">
              Já registrado <a href="/sign-in">login?</a>
            </p>
          </form>
        </div >
      </div >
    </>
  )

}

export default SignUp;
