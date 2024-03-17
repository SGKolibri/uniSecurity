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
                <table className='w-full bg-white rounded-md rounded-tl-md rounded-tr-md overflow-hidden'>
                    <thead className='text-white bg-[#00151F] opacity-90 text-md '>
                        <tr>
                            <th className='text-center'>id</th>
                            <th className='text-center'>Nome</th>
                            <th className='text-center'>Turno</th>
                            <th className='text-center'>Data da efetivação</th>
                            <th className='text-center'>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className='ml-20' >
                        {guardas.map((guarda) => (
                            <tr key={guarda._id} className='text-center border-b-2 border-gray-200'>
                                <td className='py-2'>{guarda?._id}</td>
                                <td className='py-2'>{guarda?.name}</td>
                                <td className='py-2'>{guarda?.turno}</td>
                                <td className='py-2'>{guarda?.dataEfetivacao}</td>
                                <td className='py-2'>{guarda?.status ? 'Ativo' : 'Inativo'}</td>
                                <td>
                                    <Button
                                        onClick={handleShow}
                                        variant="outline-primary"
                                        className='text-[#00151F] border-[#00151F] border-2 rounded-md'
                                    >
                                        <FaRegEdit />
                                    </Button>
                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Editar Guarda</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className='flex flex-col items-center'>
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 260,
                                                        damping: 20
                                                    }}
                                                >
                                                    <input
                                                        type="text"
                                                        placeholder="Nome"
                                                        className='border-2 border-[#00151F] rounded-md p-2 my-2'
                                                        value={guarda.nome}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Turno"
                                                        className='border-2 border-[#00151F] rounded-md p-2 my-2'
                                                        value={guarda.turno}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Data da efetivação"
                                                        className='border-2 border-[#00151F] rounded-md p-2 my-2'
                                                        value={guarda.dataEfetivacao}
                                                    />
                                                    <Button
                                                        onClick={() => handleChangeStatus(guarda._id)}
                                                        variant="outline-primary"
                                                        className='text-[#00151F] border-[#00151F] border-2 rounded-md'
                                                    >
                                                        Atualizar
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table >
            </TableContainer >


        </>
    )
}
