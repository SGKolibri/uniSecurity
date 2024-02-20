import { useState } from 'react';
import { motion } from 'framer-motion';
import { BsTrash } from '@react-icons/all-files/bs/BsTrash';
import { BsPencilSquare } from '@react-icons/all-files/bs/BsPencilSquare';
import { HiOutlineMail } from '@react-icons/all-files/hi/HiOutlineMail'
import { useToast } from '@chakra-ui/react';
import Modal from 'react-bootstrap/Modal';
import EditarOcorrencia from './editar-ocorrencia';
import Swal from 'sweetalert2'
import axios from 'axios';

function ModalOcorrencia({ title, text, id, ocorrenciaDetails, refreshCards }) {

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
        Swal.fire({
            title: 'Ocorrência deletada!',
            icon: 'success',
            confirmButtonText: 'Fechar',
            confirmButtonColor: '#3085d6',
        })
        refreshCards()
    }

    function ConfirmDeleteModal() {
        Swal.fire({
            title: 'Tem certeza que deseja deletar?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete()
            }
        })
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
                        onClick={() => ConfirmDeleteModal()}
                    >
                        <BsTrash
                            style={{
                                width: "35px",
                                height: "35px",
                            }}
                        />
                    </motion.button>

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