import React, { useEffect, useState } from 'react'
import {
    useToast, Input, Textarea, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay
} from '@chakra-ui/react'
import axios from 'axios'
import { categorias } from '../Utils/categorias'
import { FaCamera } from "react-icons/fa";
import Swal from 'sweetalert2'
import NavbarHome from '../Navbar/navbar-home'
import { FaFileUpload } from "react-icons/fa";
import { MdOutlineHideImage } from "react-icons/md";
import { useAuthUser } from 'react-auth-kit';
import { motion } from 'framer-motion'

export default function ModalOcorrenciaEdit({ isOpen, onClose, selectedOcorrencia, getOcorrencias }) {


    const authUser = useAuthUser();
    const userName = authUser().userDetail.name;

    const backendURL = process.env.REACT_APP_BACKEND_URL;

    const toast = useToast();

    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('');
    const [data, setData] = useState('');
    const [hora, setHorario] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [image, setImage] = useState('');
    const [loadingImage, setLoadingImage] = useState(false);

    const [showImg, setShowImg] = useState(false);

    function encodeImageFileAsURL(element) {
        let file = element;
        let reader = new FileReader();
        reader.addEventListener("load", function () {
            setImage(reader.result);
        });
        reader.readAsDataURL(file);
    }

    const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif';
    const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() });

    const handleUpdateOcorrencia = async (e) => {
        e.preventDefault();

    }

    const openImageModal = () => {
        setShowImg(!showImg);
    }

    useEffect(() => {
        setNome(selectedOcorrencia.nome);
        setCategoria(selectedOcorrencia.categoria);
        setData(selectedOcorrencia.data);
        setHorario(selectedOcorrencia.hora);
        setLocalizacao(selectedOcorrencia.localizacao);
        setDescricao(selectedOcorrencia.descricao);
        setImage(selectedOcorrencia.imagem);
    }, [selectedOcorrencia])

    return (
        <>
            <Modal isCentered={true} isOpen={isOpen} onClose={onClose} size={'lg'} className='px-4' >
                <ModalOverlay />
                <ModalContent>
                    <div className='px-[24px]'>
                        <div className='w-full text-center pt-[30px] pb-8'>
                            <label className=' text-3xl font-semibold'>
                                Editar Ocorrência
                            </label>
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='py-1 text-sm text-[#333]'>
                                Nome da ocorrência
                            </label>
                            <Input className='border-black' type="text" placeholder="" aria-label="Nome da categoria" value={nome} maxLength={40} onChange={(e) => setNome(e.target.value)} />
                        </div>

                        <div className='flex flex-col w-full py-2'>
                            <label className='py-1 text-sm text-[#333]'>
                                Local da ocorrência
                            </label>
                            <Input className='border-black' type="text" placeholder="" aria-label="Nome da categoria" value={localizacao} maxLength={40} onChange={(e) => setLocalizacao(e.target.value)} />
                        </div>

                        <div className='flex flex-col md:flex-row justify-between w-full py-2'>
                            <div className='flex flex-col w-full md:w-1/4'>
                                <label className='py-1 text-sm text-[#333]'>
                                    Categoria
                                </label>
                                <Input className='border-black' value={categoria} list="categorias" type="text" placeholder="" aria-label="Nome da categoria" maxLength={40} onChange={(e) => setCategoria(e.target.value)} />
                                <datalist id="categorias">
                                    {categorias.map((categoria) => { return (<option value={categoria} />) })}
                                </datalist>
                            </div>
                            <div className='flex flex-col w-3/5 md:w-1/4'>
                                <label className='py-1 text-sm text-[#333]'>
                                    Data
                                </label>
                                <Input className='border-black' value={data} type="date" placeholder="" aria-label="Nome da categoria" maxLength={40} onChange={(e) => setData(e.target.value)} />
                            </div>
                            <div className='flex flex-col w-3/5 md:w-1/4'>
                                <label className='py-1 text-sm text-[#333]'>
                                    Hora
                                </label>
                                <Input className='justify-center border-black' value={hora} type="time" placeholder="" aria-label="Nome da categoria" maxLength={40} onChange={(e) => setHorario(e.target.value)} />
                            </div>

                        </div>
                        <div className='py-1'>
                            <motion.button className='flex items-center' onClick={() => openImageModal()}>
                                <FaCamera className='w-6 h-6 md:w-8 md:h-8' />
                                <label className='py-1 px-2 text-md text-[#000] cursor-pointer'>
                                    Adicionar imagem
                                </label>
                            </motion.button>
                        </div>
                        <div className='flex flex-col py-1'>
                            <label className='py-1 text-sm text-[#333]'>
                                Descrição
                            </label>
                            <Textarea size='lg' className='border-black' value={descricao} type="text" placeholder="" aria-label="Descrição da ocorrência" maxLength={150} onChange={(e) => setDescricao(e.target.value)} />
                        </div>
                        <div className='bottom-0 justify-evenly flex py-10'>
                            <div className='w-full md:w-1/3 px-2'>
                                <motion.button className='bg-black w-full text-white py-2 rounded-[5px]'
                                    onClick={(e) => handleUpdateOcorrencia(e)}
                                >
                                    Salvar
                                </motion.button>
                            </div>
                            <div className='w-full md:w-1/3 px-2'>
                                <motion.button className='w-full border border-black py-2 rounded-[5px]'
                                    onClick={() => onClose()}
                                >
                                    Cancelar
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </ModalContent>
            </Modal>

            <Modal isOpen={showImg} onClose={openImageModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Adicionar imagem</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className={`flex px-20 justify-center`}>
                            <label className="w-80 h-80 rounded-sm shadow-sm flex flex-col text-center items-center justify-center">
                                {!image ?
                                    <MdOutlineHideImage className='w-80 h-80 opacity-80' />
                                    :
                                    <img className='max-w-80 max-h-80 rounded-sm' src={image} alt="Imagem da ocorrência" />
                                }
                            </label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className='w-full d-flex justify-content-between'>
                            <motion.button className='flex w-2/6 text-black font-semibold py-2 rounded-md justify-center gap-2 items-center cursor-pointer' colorScheme='blue' onClick={() => {
                                setImage('');
                                toast({
                                    title: "Imagem removida com sucesso!",
                                    status: "success",
                                    duration: "2000",
                                    isClosable: true,
                                    position: "bottom-center"
                                })
                            }}>
                                Remover
                            </motion.button>
                            <label className='flex w-2/6 bg-black text-white rounded-[5px] justify-center gap-2 items-center hover:bg-sky-800 cursor-pointer' colorScheme='blue' >
                                <FaFileUpload />
                                Adicionar
                                <input type="file" accept={acceptedFileTypesArray} multiple={false} id='image' className="hidden" placeholder="imagem" onChange={e => {
                                    (encodeImageFileAsURL(e.target.files[0]));
                                    toast({
                                        title: "Imagem adicionada com sucesso!",
                                        status: "success",
                                        duration: "2000",
                                        isClosable: true,
                                        position: "bottom-center"
                                    })
                                }}
                                />
                            </label>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}