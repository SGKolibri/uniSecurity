import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { TableContainer, Switch, Spinner, Input, InputGroup, InputLeftElement, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, useDisclosure, Select } from '@chakra-ui/react'
import { motion } from 'framer-motion';
import { useToast } from '@chakra-ui/react'
import { BsPencilSquare } from '@react-icons/all-files/bs/BsPencilSquare';
import ModalGuarda from './modal-guarda';

export default function GuardaTable({ guardas, statusChange, getGuardas }) {


    const { isOpen, onOpen, onClose } = useDisclosure()

    const [guardasState, setGuardasState] = useState(guardas);
    const [selectedGuarda, setSelectedGuarda] = useState(null);

    useEffect(() => {
        setGuardasState(guardas);
    }, [guardas, guardasState]);

    const formatDate = (date) => {
        if (!date) return;

        let dateArray = date.split("T");
        let dateFormatted = dateArray[0].split("-").reverse().join("/");
        return dateFormatted;
    }

    return (
        <>
            <TableContainer>
                <table className='w-full bg-white rounded-tl-none md:rounded-tl-sm rounded-tr-none md:rounded-tr-sm overflow-hidden'>
                    <thead className='text-white bg-[#00151F] opacity-90 text-md '>
                        <tr>
                            <th className='text-center'>Nome Completo</th>
                            <th className='text-center'>Turno</th>
                            <th className='text-center'>Data da efetivação</th>
                            <th className='text-center'>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className='ml-20' >
                        {guardas.map((guarda) => (
                            <tr key={guarda._id} className='text-center border-b-2 border-gray-200'>
                                <td className='py-2'>{guarda?.name} {guarda?.surname}</td>
                                <td className='py-2'>
                                    {guarda?.turno === 'manha' ? 'Manhã' : guarda?.turno === 'tarde' ? 'Tarde' : 'Noite'}
                                </td>
                                <td className='py-2'>
                                    {formatDate(guarda?.efetivacao)}
                                </td>
                                <td className='py-2'>{guarda?.status ? 'Ativo' : 'Inativo'}</td>
                                <td className='text-center'>
                                    <td className='flex justify-center items-center gap-2.5 py-[12px]'>
                                        <Switch
                                            colorScheme='green'
                                            size='sm'
                                            isChecked={guarda?.status}
                                            onChange={() => {
                                                statusChange(guarda._id);
                                            }}
                                        />
                                        <motion.button onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedGuarda(guarda);
                                            onOpen();
                                        }} >
                                            <BsPencilSquare />
                                        </motion.button>
                                    </td>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table >
                {
                    selectedGuarda && (
                        <ModalGuarda isOpen={isOpen} onClose={onClose} selectedGuarda={selectedGuarda} getGuardas={getGuardas} />
                    )
                }
            </TableContainer >
        </>
    )
}
