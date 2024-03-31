import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Card from 'react-bootstrap/Card'
import ModalOcorrencia from './modal-ocorrencia'
import { TableContainer } from '@chakra-ui/react';
import { BsPencilSquare } from '@react-icons/all-files/bs/BsPencilSquare';
import { BsTrash } from '@react-icons/all-files/bs/BsTrash';
import { FaEye } from "react-icons/fa";
import { useDisclosure } from '@chakra-ui/react'
import ModalOcorrenciaEdit from './modal-ocorrencia-edit';
import Swal from 'sweetalert2'
import axios from 'axios';

const DeleteOcorrencia = (id, getOcorrencias) => {
    Swal.fire({
        title: 'Você tem certeza?',
        text: "Essa ação não pode ser revertida!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: 'black',
        confirmButtonText: 'Deletar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Deletado!',
                text: 'Ocorrência deletada com sucesso.',
                icon: 'success',
                confirmButtonColor: 'green'
            }
            )
            axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-ocorrencia/${id}`)
                .then(res => {
                    getOcorrencias()
                })
        }
    })
}

function Cards({ ocorrencias, gridView, getOcorrencias }) {

    const [selectedOcorrencia, setSelectedOcorrencia] = useState(null);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();

    const sliceNameAtBlankSpace = (name) => {
        let nameArr = name.split(" ");
        let firstName = nameArr[0];
        if (nameArr[1] === undefined) return firstName;
        let lastName = nameArr[1];
        return firstName + " " + lastName + "...";
    }

    let cardsToFilter = [];
    const displayCard = () => {
        let i = 0;
        if (!ocorrencias || ocorrencias.length === 0) {
            return
        }
        const createCard = (ocorrencia) => (
            <>
                <Card.Title>
                    {sliceNameAtBlankSpace(ocorrencia.nome)}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    {ocorrencia.categoria}
                    <br />
                </Card.Subtitle>
                <hr />
                <Card.Text>
                    <div style={{ height: "75px" }}>
                        <h>{ocorrencia.data} - {ocorrencia.hora}</h><br />
                        <h>{ocorrencia.localizacao}</h>
                    </div>
                </Card.Text>
            </>
        );

        for (i = 0; i < ocorrencias.length; i++) {
            cardsToFilter.push(createCard(ocorrencias[i]));
        }

        const CardComponent = ({ ocorrencia }) => (
            <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.99 }}
                className="inline-block m-1 sm:w-72 w-32"
                onClick={() => {
                    setSelectedOcorrencia(ocorrencia);
                    onOpen();  // Open the modal
                }}
            >
                <Card className="relative h-16 min-h-16 sm:h-44 sm:min-h-44 shadow-md">
                    <Card.Body>
                        <div>{ocorrencia.nome}</div>
                        <div>{ocorrencia.categoria}</div>
                        <div>{ocorrencia.hora}</div>
                    </Card.Body>
                </Card>
            </motion.div>
        );

        return (
            <>
                {ocorrencias.map((ocorrencia) => <CardComponent ocorrencia={ocorrencia} />)}
                {selectedOcorrencia && (
                    <ModalOcorrencia isOpen={isOpen} onClose={onClose} selectedOcorrencia={selectedOcorrencia} />
                )}
            </>
        );
    }

    const displayTable = () => {
        if (!ocorrencias || ocorrencias.length === 0) {
            return (
                <div style={{ textAlign: "center", margin: "5%" }}>
                    <h>Nenhuma ocorrência registrada.</h>
                </div>
            )
        }

        const createTable = () => (
            <TableContainer>
                <table className='w-full bg-white rounded-tl-none rounded-tr-none md:rounded-tl-sm md:rounded-tr-sm overflow-hidden'>
                    <thead className='text-white bg-[#00151F] opacity-90 text-md '>
                        <tr>
                            <th className='text-center'>Registrado por</th>
                            <th className='text-center'>Categoria da ocorrência</th>
                            <th className='text-center'>Local</th>
                            <th className='text-center'>Data</th>
                            <th className='text-center'>Horário</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody  >
                        {ocorrencias.map((ocorrencia) => (
                            <tr key={ocorrencia._id} className='border-b border-gray-300' >
                                <td className='text-center'>
                                    {ocorrencia.registeredBy}
                                </td>
                                <td className='text-center'> {ocorrencia.categoria} </td>
                                <td className='text-center'> {ocorrencia.localizacao} </td>
                                <td className='text-center'> {ocorrencia.data} </td>
                                <td className='text-center'> {ocorrencia.hora} </td>
                                <td className='text-center'>
                                    <td className='flex justify-center items-center gap-2.5 py-[12px]'>
                                        <motion.button
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setSelectedOcorrencia(ocorrencia)
                                                onOpenEdit()
                                            }}
                                        >
                                            <BsPencilSquare />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => DeleteOcorrencia(ocorrencia._id, getOcorrencias)} >
                                            <BsTrash />
                                        </motion.button>
                                        <motion.button onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedOcorrencia(ocorrencia);
                                            onOpen();
                                        }}
                                            className='max-w-4 max-h-4 min-w-4 min-h-4'
                                        >
                                            <FaEye />
                                        </motion.button>
                                    </td>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </TableContainer >
        )

        return (
            <div className="flex flex-col w-full">
                {createTable()}
                {selectedOcorrencia && (
                    <ModalOcorrencia isOpen={isOpen} onClose={onClose} selectedOcorrencia={selectedOcorrencia} />,
                    <ModalOcorrenciaEdit isOpen={isOpenEdit} onClose={onCloseEdit} selectedOcorrencia={selectedOcorrencia} getOcorrencias={getOcorrencias} />

                )}
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-wrap justify-center items-center gap-4 h-full py-3 sm:py-0">
                {gridView ? displayCard() : displayTable()}
            </div>
        </>

    );
}

export default Cards;