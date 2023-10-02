import React, { useState } from 'react'
import Navbar from '../Navbar/navbar';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import Modal from 'react-bootstrap/Modal';
import Avatar from 'react-avatar-edit'
import { useToast } from '@chakra-ui/react'

function SignUp() {

  const toast = useToast()

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')
  const [image, setImage] = useState('');

  //Modal
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async e => {

    console.log(image.length)

    e.preventDefault();

    if (!name || !surname || !email || !password) {
      toast({
        title: "Preencha todos os campos!",
        description: "Todos os campos devem estar preenchidos.",
        position: "top-right",
        status: "error",
        duration: 2500,
        isClosable: true,
      })
      return;
    }

    //check if image isn't too large
    if (image && image.length > 100000) {
      toast({
        title: "Imagem muito grande!",
        description: "Selecione um pedaço menor da imagem.",
        position: "top-right",
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
        position: "top-right",
        status: "error",
        duration: 2500,
        isClosable: true,
      })
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
        toast({
          title: "Erro ao registrar usuário!",
          description: response.data.error,
          position: "top-right",
          status: "error",
          duration: 2500,
        })

      } else {
        toast({
          title: "Usuário registrado com sucesso!",
          position: "top-right",
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
      <ToastContainer />
      <Navbar opacity1={0.75} opacity2={1} />
      <div className="auth-wrapper">
        <div
          className="auth-inner"
          style={{
            marginTop: "7%"
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
    </>
  )

}

export default SignUp;
