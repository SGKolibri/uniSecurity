import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react"
import useWindowDimensions from '../Utils/getWindowDimensions'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaRegEdit } from "react-icons/fa";
import { motion } from 'framer-motion';
import { useToast } from '@chakra-ui/react'

export default function GuardaTable({ guardas }) {
    const { width } = useWindowDimensions();
    const mobile = width < 992;
    let backendURL = process.env.REACT_APP_BACKEND_URL;

    const toast = useToast()
    const [guardasState, setGuardasState] = useState(guardas);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(() => {
        setGuardasState(guardas);
    }, [guardas, guardasState]);

    const handleChangeStatus = (id) => {
        let guarda = guardasState.find(guarda => guarda._id === id);

        axios.patch(`${backendURL}/update-user-status/${id}`, {
            status: guarda.status === true ? false : true
        }).then((response) => {
            toast({
                title: "Status atualizado com sucesso!",
                description: "A página será recarregada.",
                position: "center",
                status: "success",
                duration: 2000,
                isClosable: true,
            })
            setGuardasState(guardasState.map(guarda =>
                guarda._id === id ? { ...guarda, status: response.data.user.status } : guarda
            ))
            handleClose();
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        })
    };

    return (
        <>
            <TableContainer>
                <Table size={mobile ? "sm" : "md"} >
                    <Thead>
                        <Tr>
                            <Th>Nome</Th>
                            <Th>Email</Th>
                            <Th >Status</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {guardas.map((guarda, index) => {
                            return (
                                <>
                                    <Tr key={guarda._id}>
                                        <Td id={index}>{guarda.name}</Td>
                                        <Td id={index}>{guarda.email}</Td>
                                        <Td id={index}>
                                            {guarda.status ? `Ativo` : `Inativo`}
                                        </Td>
                                        <Td id={index}>
                                            <motion.button
                                                whileHover={{
                                                    scale: 1.1,
                                                    backgroundColor: "#E8E8E8",
                                                    borderRadius: "50%",
                                                    width: "24px",
                                                    height: "24px",
                                                }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={handleShow}
                                            >
                                                <FaRegEdit style={{ width: "24px", height: "24px" }} />
                                            </motion.button>
                                        </Td>
                                    </Tr>
                                    <Modal key={guarda._id} show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Deseja {guarda.status ? "Inativar" : "Ativar"} o guarda {guarda.name}?</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>Ao confirmar, a página será recarregada.</Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClose}>
                                                cancelar
                                            </Button>
                                            <Button variant="primary" onClick={() => handleChangeStatus(guarda._id)}>
                                                {guarda.status ? "Inativar" : "Ativar"} guarda
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </>
                            )
                        }
                        )}
                    </Tbody>
                </Table>
            </TableContainer >


        </>
    )
}
