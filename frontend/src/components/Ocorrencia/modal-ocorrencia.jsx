import { useState } from 'react';
import { motion } from 'framer-motion';
import { BsTrash } from '@react-icons/all-files/bs/BsTrash';
import { BsPencilSquare } from '@react-icons/all-files/bs/BsPencilSquare';
import { HiOutlineMail } from '@react-icons/all-files/hi/HiOutlineMail'
import { useToast } from '@chakra-ui/react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import EditarOcorrencia from './editar-ocorrencia';
import axios from 'axios';

function ModalOcorrencia({ title, text, id, ocorrenciaDetails }) {

    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const toast = useToast();

    /* Edit Modal */
    const [editModalShow, setEditModalShow] = useState(false);
    const handleCloseEdit = () => setEditModalShow(false);

    /* Delete modal */
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const handleCloseDelete = () => setDeleteModalShow(false);

    /* Modal */
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSendEmail = async () => {

        axios.post(`${backendURL}/pdf`, {
            nome: ocorrenciaDetails.nome,
            categoria: ocorrenciaDetails.categoria,
            data: ocorrenciaDetails.data,
            hora: ocorrenciaDetails.hora,
            localizacao: ocorrenciaDetails.localizacao,
            descricao: ocorrenciaDetails.descricao,
            image: ocorrenciaDetails.image,
        })
        toast({
            title: "Email enviado!",
            description: "Email enviado com sucesso!",
            status: "success",
            duration: "3000",
            isClosable: true,
        })
        await axios.post(`${backendURL}/send-email-by-id/${id}`, {
            emailTo: process.env.EMAIL_HOST_USER,
            title: ocorrenciaDetails.nome,
        })

    }

    const handleDelete = async () => {
        await axios.delete(`${backendURL}/delete-ocorrencia/${id}`);
        toast({
            title: "Ocorrência deletada!",
            description: "Ocorrência deletada com sucesso!",
            status: "success",
            duration: "3000",
            isClosable: true,
        })
        setTimeout(() => {
            window.location.reload();
        }, 1250);
    }

    function ConfirmDeleteModal() {
        return (
            <>
                <Modal centered show={deleteModalShow} onHide={() => setDeleteModalShow(false)} >
                    <Modal.Header closeButton>
                        <Modal.Title>Deletar Ocorrência</Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        style={{
                            display: "flex",
                            height: "120px"
                        }}
                    >
                        Ao deletar a ocorrência ela não poderá mais ser acessada.
                    </Modal.Body>
                    <Modal.Footer
                        stle={{
                            justifyContent: "space-between"
                        }}
                    >
                        <Button variant="secondary" onClick={handleCloseDelete}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Deletar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    function ModalEdit(props) {
        return (
            <Modal
                show={editModalShow}
                onHide={() => setEditModalShow(false)}
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Editar Ocorrência
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditarOcorrencia id={id} handleClose={handleCloseEdit} ocorrenciaDetails={ocorrenciaDetails} />
                </Modal.Body>
            </Modal>
        );
    }


    return (
        <>
            <motion.button
                style={{
                    position: "absolute",
                    right: "0%",
                    top: "0%",
                    height: "100%",
                    width: "100%",
                    border: "none"
                }}
                onClick={() => handleShow()}
            />
            {/* Modal */}
            <Modal centered show={show} onHide={handleClose} >
                <Modal.Header title="Fechar" closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{text}</Modal.Body>
                <Modal.Footer className='flex-row justify-content-between'>
                    {/* Delete Button */}
                    <motion.button
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "#E8E8E8",
                            borderRadius: "50%",
                            width: "35px",
                            height: "35px",
                        }}
                        whileTap={{ scale: 0.9 }}
                        title='Deletar'
                        style={{
                            border: "none",
                            float: "left",
                        }}
                        onClick={() => setDeleteModalShow(true)}
                    >
                        <BsTrash
                            style={{
                                width: "35px",
                                height: "35px",
                            }}
                        />
                    </motion.button>

                    {/* Confirm Delete Modal */}
                    <ConfirmDeleteModal />

                    {/* Send Email Button */}
                    <motion.button
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "#E8E8E8",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                        }}
                        whileTap={{ scale: 0.9 }}
                        title='Enviar email'
                        style={{
                            border: "none",
                            float: "left",
                        }}
                        onClick={handleSendEmail}
                    >
                        <HiOutlineMail
                            style={{
                                width: "40px",
                                height: "40px",
                                float: "left",
                            }}
                        />
                    </motion.button>


                    {/* Edit Button */}
                    <motion.button
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "#E8E8E8",
                            borderRadius: "50%",
                            width: "35px",
                            height: "35px",

                        }}
                        whileTap={{ scale: 0.9 }}
                        title='Editar'
                        style={{
                            border: "none",
                        }}
                        onClick={() => setEditModalShow(true)}
                    >
                        <BsPencilSquare
                            style={{
                                width: "35px",
                                height: "35px",
                            }}
                        />
                    </motion.button>

                    {/* Edit Modal */}
                    <ModalEdit />

                </Modal.Footer>
            </Modal >
        </>
    );
}

export default ModalOcorrencia;