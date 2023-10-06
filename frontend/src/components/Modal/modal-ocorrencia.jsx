import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { motion } from 'framer-motion';
import { BsTrash } from '@react-icons/all-files/bs/BsTrash';
import { BsPencilSquare } from '@react-icons/all-files/bs/BsPencilSquare';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import Button from 'react-bootstrap/Button';
import EditarOcorrencia from '../Ocorrencia/editar-ocorrencia';
import { AiOutlinePushpin } from '@react-icons/all-files/ai/AiOutlinePushpin';
import { AiFillPushpin } from '@react-icons/all-files/ai/AiFillPushpin';

function ModalOcorrencia({ title, text, id, ocorrenciaDetails, pin, unpin, pinned }) {

    const toast = useToast();

    /* Edit Modal */
    const [modalShow, setModalShow] = useState(false);

    /* Delete modal */
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const handleCloseDelete = () => setShow(false);

    /* Modal */
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = async () => {
        //use axios to delete the occurrence
        try {
            await axios.delete(`http://localhost:3000/delete-ocorrencia/${id}`);
            toast({
                title: "Ocorrência deletada!",
                description: "Ocorrência deletada com sucesso!",
                status: "success",
                duration: "3000",
                isClosable: true,
            })
        } catch (error) {
            console.log(error);
        }
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
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Editar modal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditarOcorrencia id={id} handleClose={handleClose} ocorrenciaDetails={ocorrenciaDetails} />
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
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{text}</Modal.Body>
                <Modal.Footer
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",

                    }}
                >
                    {/* Delete Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
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

                    {/* Pin Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            border: "none",
                        }}
                        onClick={() => {
                            if (pinned) {
                                unpin();
                            } else {
                                pin();
                            }
                        }}
                    >
                        {!pinned ?
                            (<AiOutlinePushpin
                                style={{
                                    width: "35px",
                                    height: "35px",
                                }} />) : (
                                <AiFillPushpin
                                    style={{
                                        width: "35px",
                                        height: "35px",
                                    }} />
                            )}
                    </motion.button>

                    {/* Edit Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            border: "none",
                        }}
                        onClick={() => setModalShow(true)}
                    >
                        <BsPencilSquare
                            style={{
                                width: "35px",
                                height: "35px",
                            }}
                        />
                    </motion.button>

                    {/* Edit Modal */}
                    <ModalEdit
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                    />

                </Modal.Footer>
            </Modal >
        </>
    );
}

export default ModalOcorrencia;