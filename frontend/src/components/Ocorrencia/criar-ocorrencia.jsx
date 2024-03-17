import React, { useState } from 'react'
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
import { motion } from 'framer-motion'

function CriarOcorrencia() {

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
    const registeredBy = localStorage.getItem('userName');

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(image)

        if (nome === '' || data === '' || hora === '' || categoria === '' || localizacao === '' || descricao === '') {
            toast({
                title: "Preencha todos os campos!",
                description: "Campos não foram preenchidos corretamente.",
                status: "info",
                duration: "2000",
                isClosable: true,
                position: "bottom-center"
            })
            return;
        }

        let dataToSend = { nome, data, hora, categoria, localizacao, descricao, registeredBy };

        if (image !== '') dataToSend.image = image;

        const responsePromise = new Promise((resolve, reject) => {
            axios.post(`${backendURL}/reg-ocorrencia`, dataToSend);
            axios.post(`${backendURL}/pdf`, dataToSend);
            resolve();
        });

        toast.promise(responsePromise, {
            loading: { title: 'Salvando ocorrência...' },
            success: { title: 'Ocorrência salva com sucesso!' },
            error: { title: 'Erro ao salvar ocorrência.' },
        }, {
            position: "bottom-center"
        })

        clearAllField();
    }

    const clearAllField = () => {
        setNome("");
        setCategoria("");
        setData("");
        setHorario("");
        setLocalizacao("");
        setDescricao("");
        setImage("");
        const inputs = document.querySelectorAll('input, Input, Textarea, file, select, Select');
        inputs.forEach(input => input.value = '');
    }

    const openImageModal = () => {
        setShowImg(!showImg);
    }

    const clearOcorrencia = () => {
        if (nome === '' && data === '' && hora === '' && localizacao === '' && descricao === '' && image === '') {
            toast({
                title: "Nenhuma ocorrência para cancelar!",
                description: "Campos já estão limpos.",
                status: "info",
                duration: "2000",
                isClosable: true,
                position: "bottom-center"
            })
            return;
        }
        Swal.fire({
            title: 'Tem certeza que deseja cancelar?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, cancelar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                clearAllField();
            }
        })
    }

    return (
        <>

            <div className='w-full h-screen flex flex-col items-center bg-[#F2F2F2] relative'>
                <NavbarHome />
                <div className='w-[90%] h-full bg-white mt-[1rem] mb-4 rounded-sm shadow-lg px-4 md:px-24 lg:px-32'>
                    <div className='w-full text-center pt-[30px] pb-8'>
                        <label className=' text-3xl font-semibold'>
                            Registrar Ocorrência
                        </label>
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='py-1 text-sm text-[#333]'>
                            Nome da ocorrência
                        </label>
                        <Input className='border-black' type="text" placeholder="" aria-label="Nome da categoria" maxLength={40} onChange={(e) => setNome(e.target.value)} />
                    </div>

                    <div className='flex flex-col w-full py-2'>
                        <label className='py-1 text-sm text-[#333]'>
                            Local da ocorrência
                        </label>
                        <Input className='border-black' type="text" placeholder="" aria-label="Nome da categoria" maxLength={40} onChange={(e) => setLocalizacao(e.target.value)} />
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
                            <Input className='border-black' type="date" placeholder="" aria-label="Nome da categoria" maxLength={40} onChange={(e) => setData(e.target.value)} />
                        </div>
                        <div className='flex flex-col w-3/5 md:w-1/4'>
                            <label className='py-1 text-sm text-[#333]'>
                                Hora
                            </label>
                            <Input className='justify-center border-black' type="time" placeholder="" aria-label="Nome da categoria" maxLength={40} onChange={(e) => setHorario(e.target.value)} />
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
                        <Textarea size='lg' className='border-black' type="text" placeholder="" aria-label="Descrição da ocorrência" maxLength={150} onChange={(e) => setDescricao(e.target.value)} />
                    </div>
                    <div className='bottom-0 justify-evenly flex pt-10'>
                        <div className='w-full md:w-1/5 px-2'>
                            <motion.button className='bg-black w-full text-white py-2 rounded-[5px]'
                                onClick={(e) => handleSubmit(e)}
                            >
                                Salvar
                            </motion.button>
                        </div>
                        <div className='w-full md:w-1/5 px-2'>
                            <motion.button className='w-full border border-black py-2 rounded-[5px]'
                                onClick={() => clearOcorrencia()}
                            >
                                Cancelar
                            </motion.button>

                        </div>
                    </div>
                </div>
            </div >

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

export default CriarOcorrencia