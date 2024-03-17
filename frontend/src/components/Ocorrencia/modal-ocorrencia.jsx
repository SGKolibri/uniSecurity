import { motion } from 'framer-motion';
import { BsTrash } from '@react-icons/all-files/bs/BsTrash';
import { BsPencilSquare } from '@react-icons/all-files/bs/BsPencilSquare';
import { HiOutlineMail } from '@react-icons/all-files/hi/HiOutlineMail'
import { useToast } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, } from '@chakra-ui/react'
import EditarOcorrencia from './editar-ocorrencia';
import Swal from 'sweetalert2'
import axios from 'axios';

function ModalOcorrencia({ isOpen, onClose, selectedOcorrencia }) {

    // const backendURL = process.env.REACT_APP_BACKEND_URL;
    // const toast = useToast();

    // /* Edit Modal */
    // const [editModalShow, setEditModalShow] = useState(false);
    // const handleCloseEdit = () => setEditModalShow(false);

    // /* Delete modal */
    // const [deleteModalShow, setDeleteModalShow] = useState(false);
    // const handleCloseDelete = () => setDeleteModalShow(false);

    // let nome = ocorrenciaDetails.nome;
    // let categoria = ocorrenciaDetails.categoria;
    // let data = ocorrenciaDetails.data;
    // let hora = ocorrenciaDetails.hora;
    // let localizacao = ocorrenciaDetails.localizacao;
    // let descricao = ocorrenciaDetails.descricao;
    // let image = ocorrenciaDetails.image;

    // const handleSendEmail = async () => {
    //     axios.post(`${backendURL}/pdf`, {
    //         nome: ocorrenciaDetails.nome,
    //         categoria,
    //         data,
    //         hora,
    //         localizacao,
    //         descricao,
    //         image,
    //     })
    //     toast({
    //         title: "Email enviado!",
    //         description: "Email enviado com sucesso!",
    //         status: "success",
    //         duration: "3000",
    //         isClosable: true,
    //     })
    //     await axios.post(`${backendURL}/send-email-by-id/${id}`, {
    //         emailTo: process.env.EMAIL_HOST_USER,
    //         title: ocorrenciaDetails.nome,
    //     })

    // }

    // const handleDelete = async () => {
    //     await axios.delete(`${backendURL}/delete-ocorrencia/${id}`);
    //     Swal.fire({
    //         title: 'Ocorrência deletada!',
    //         icon: 'success',
    //         confirmButtonText: 'Fechar',
    //         confirmButtonColor: '#3085d6',
    //     })
    //     refreshCards()
    // }

    // function ConfirmDeleteModal() {
    //     Swal.fire({
    //         title: 'Tem certeza que deseja deletar?',
    //         text: "Você não poderá reverter isso!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Sim, deletar!',
    //         cancelButtonText: 'Cancelar'
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             handleDelete()
    //         }
    //     })
    // }

    // function ModalEdit(props) {
    //     return (
    //         <Modal
    //             show={editModalShow}
    //             onHide={() => setEditModalShow(false)}
    //             {...props}
    //             size="lg"
    //             aria-labelledby="contained-modal-title-vcenter"
    //             centered
    //         >
    //             <Modal.Header closeButton>
    //                 <Modal.Title id="contained-modal-title-vcenter">
    //                     Editar Ocorrência
    //                 </Modal.Title>
    //             </Modal.Header>
    //             <Modal.Body>
    //                 <EditarOcorrencia id={id} handleClose={handleCloseEdit} ocorrenciaDetails={ocorrenciaDetails} />
    //             </Modal.Body>
    //         </Modal>
    //     );
    // }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
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