import { motion } from 'framer-motion';
import { BsTrash } from '@react-icons/all-files/bs/BsTrash';
import { BsPencilSquare } from '@react-icons/all-files/bs/BsPencilSquare';
import { HiOutlineMail } from '@react-icons/all-files/hi/HiOutlineMail'
import { useToast } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, } from '@chakra-ui/react'
import Swal from 'sweetalert2'
import axios from 'axios';

function ModalOcorrencia({ isOpen, onClose, selectedOcorrencia }) {

    return (
        <>
            <Modal isCentered={true} isOpen={isOpen} onClose={onClose} size={'lg'} className='px-4'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <label>{selectedOcorrencia.nome}</label>
                        <div className='border w-full mt-2' />
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className='flex flex-row justify-between'>
                            <label className='px-1 w-full'>
                                <label className='font-semibold pr-2'>Categoria: </label>
                                {selectedOcorrencia.categoria}
                            </label>
                            <label className='px-1 w-full'>
                                <label className='font-semibold pr-2'>Local: </label>
                                {selectedOcorrencia.localizacao}
                            </label>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <label className='px-1 w-full'>
                                <label className='font-semibold pr-2'>Data: </label>
                                {selectedOcorrencia.data}
                            </label>
                            <label className='px-1 w-full'>
                                <label className='font-semibold pr-2'>Hora: </label>
                                {selectedOcorrencia.hora}
                            </label>
                        </div>
                        <div className='border w-full my-3' />
                        <div className='flex flex-col px-1'>
                            <div className='flex flex-col'>
                                <label className='font-semibold text-center'>
                                    Descrição
                                </label>
                                <label className='text-justify'>
                                    {selectedOcorrencia.descricao}
                                </label>
                            </div>
                            <div className='flex justify-center items-center max-w-full py-3'>
                                {
                                    selectedOcorrencia.image === undefined ?
                                        <label className='font-semibold text-center'>
                                            Sem imagem anexada
                                        </label>
                                        :
                                        <img className='max-w-full rounded-md' src={selectedOcorrencia.image} style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.5)' }} alt='' />
                                }
                            </div>
                            <label>
                                <label className='font-semibold pr-2 pt-2'>Registrado por: </label>
                                {selectedOcorrencia.registeredBy}
                            </label>
                        </div>
                        <div className='border w-full mt-2' />
                    </ModalBody>
                    <ModalFooter>
                        <div className='w-full flex justify-between'>
                            <motion.button>
                                <BsPencilSquare className='w-8 h-8' />
                            </motion.button>
                            <motion.button>
                                <HiOutlineMail className='w-8 h-8' />
                            </motion.button>
                            <motion.button>
                                <BsTrash className='w-8 h-8' />
                            </motion.button>
                        </div>

                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    );
}

export default ModalOcorrencia;