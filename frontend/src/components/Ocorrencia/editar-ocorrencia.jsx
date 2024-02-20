import React, { useEffect, useState } from 'react'
import { motion, transform } from 'framer-motion'
import axios from 'axios'
import { useToast, Select, Input, Button } from '@chakra-ui/react'
import { categorias } from './categorias'
import { AiOutlineEdit } from 'react-icons/ai'
import { TbSelect } from "react-icons/tb";
import { locais } from './locais'
import useWindowDimensions from '../Utils/getWindowDimensions'
import { Box, Stack, Textarea, FormControl, FormLabel, Text } from '@chakra-ui/react';


function EditarOcorrencia({ id, handleClose, ocorrenciaDetails }) {

    const backendURL = process.env.REACT_APP_BACKEND_URL;

    const toast = useToast();

    const { width } = useWindowDimensions();

    const [nome, setNome] = useState('')
    const [categoria, setCategoria] = useState('')
    const [hora, setHorario] = useState('')
    const [data, setData] = useState('')
    const [localizacao, setLocalizacao] = useState('')
    const [descricao, setDescricao] = useState('')
    const [image, setImage] = useState('')
    const [outraCategoria, setOutraCategoria] = useState(false)
    const [outraLocalizacao, setOutraLocalizacao] = useState(false)

    const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif';
    const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() });

    const changeCategoria = () => {
        setOutraCategoria(!outraCategoria)
        setCategoria('')
    }

    const changeLocalizacao = () => {
        setOutraLocalizacao(!outraLocalizacao)
        setLocalizacao('')
    }

    useEffect(() => {
        setNome(ocorrenciaDetails.nome)
        setCategoria(ocorrenciaDetails.categoria)
        setHorario(ocorrenciaDetails.hora)
        setData(ocorrenciaDetails.data)
        setLocalizacao(ocorrenciaDetails.localizacao)
        setDescricao(ocorrenciaDetails.descricao)
        setImage(ocorrenciaDetails.image)
    }, [ocorrenciaDetails])


    const patchOcorrencia = () => {

        if (nome === '' || categoria === '' || hora === '' || data === '' || localizacao === '' || descricao === '') {
            toast({
                title: "Campos vazios!",
                description: "Preencha todos os campos!",
                status: "error",
                duration: "2500",
                isClosable: true,
            });
            return;
        }

        axios.patch(`${backendURL}/edit-ocorrencia/${id}`, {
            nome: nome,
            hora: hora,
            data: data,
            categoria: categoria,
            localizacao: localizacao,
            descricao: descricao,
            image: image
        })
            .then((response) => {
                toast({
                    title: "Ocorrência editada!",
                    description: "Ocorrência editada com sucesso!",
                    status: "success",
                    duration: "2500",
                    isClosable: true,
                });
            })
        setTimeout(() => {
            window.location.reload();
        }, 1250);
    }

    /* convert image to base64 */
    function encodeImageFileAsURL(element) {
        let file = element;
        let reader = new FileReader();
        reader.addEventListener("load", function () {
            setImage(reader.result);
        });
        reader.readAsDataURL(file);
    }

    const changeImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (acceptedFileTypesArray.includes(file.type)) {
                encodeImageFileAsURL(file);
            } else {
                toast({
                    title: "Arquivo inválido!",
                    description: "Apenas arquivos de imagem são permitidos!",
                    status: "error",
                    duration: "2500",
                    isClosable: true,
                });
            }
        }
    }

    return (
        <>
            <Box className='flex place-content-center justify-center w-full'>
                <Box className="w-full shadow-lg p-4 sm:p-8">
                    <Stack spacing={4}>
                        <FormControl id="title" isRequired>
                            <FormLabel>Título</FormLabel>
                            <Input type="text" placeholder={ocorrenciaDetails.nome} onChange={(e) => setNome(e.target.value)} maxLength={40} required />
                        </FormControl>

                        <FormControl id="category" isRequired>
                            <FormLabel>Categoria</FormLabel>
                            {outraCategoria ?
                                <Input type="text" placeholder={ocorrenciaDetails.categoria} aria-label="Nome da categoria" maxLength={40} onChange={(e) => setCategoria(e.target.value)} />
                                :
                                <Select type="text" placeholder={ocorrenciaDetails.categoria} aria-label="Selecionar categoria" onChange={(e) => setCategoria(e.target.value)} >
                                    {categorias.map((categoria) => { return (<option value={categoria}>{categoria}</option>) })}
                                </Select>
                            }
                        </FormControl>

                        <FormControl id="category" isRequired>
                            <FormLabel>Localização</FormLabel>
                            {outraLocalizacao ?
                                <Input type="text" placeholder={ocorrenciaDetails.locais} aria-label="Nome do local" maxLength={40} onChange={(e) => setLocalizacao(e.target.value)} />
                                :
                                <Select type="text" placeholder={ocorrenciaDetails.locais} aria-label="Selecionar categoria" onChange={(e) => setLocalizacao(e.target.value)} >
                                    {locais.map((local) => { return (<option value={local}>{local}</option>) })}
                                </Select>
                            }
                        </FormControl>
                        <Stack direction="column" spacing={4}>
                            <Box w={{ base: "100%", sm: "22%" }} px={4}>
                                <FormControl id="data" isRequired>
                                    <FormLabel mt={2} mb={2}>
                                        Data
                                    </FormLabel>
                                    <Input type="date" placeholder={ocorrenciaDetails.data} onChange={(e) => setData(e.target.value)} />
                                </FormControl>
                            </Box>
                            <Box w={{ base: "100%", sm: "22%" }} px={4}>
                                <FormControl id="horario" isRequired>
                                    <FormLabel mt={2} mb={2}>
                                        Horário
                                    </FormLabel>
                                    <Input type="time" placeholder={ocorrenciaDetails.hora} onChange={(e) => setHorario(e.target.value)} />
                                </FormControl>
                            </Box>
                            <Box px={4} className='flex flex-wrap gap-1'>

                                <label mt={2} mb={2}>
                                    Imagem
                                </label>
                                <div className='justify-center'>
                                    {image && <img src={image} className="rounded-md" alt="ocorrencia" />}
                                </div>
                                <label className="w-full h-24 rounded-md cursor-pointer border-gray-200 text-gray-600 border flex flex-col text-center items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                                    </svg>
                                    <div>
                                        Trocar imagem
                                    </div>
                                    <input type="file" onChange={(e) => changeImage(e)} multiple className="hidden" />
                                </label>
                            </Box>
                        </Stack>

                        <footer className="flex justify-between flex-row">
                            <Button
                                mt={4}
                                onClick={() => handleClose()}
                            >
                                Cancelar
                            </Button>
                            <Button
                                colorScheme="blue"
                                onClick={() => patchOcorrencia()}
                                mt={4}
                            >
                                Editar
                            </Button>
                        </footer>
                    </Stack>
                </Box>
            </Box >
        </>
    )
}

export default EditarOcorrencia