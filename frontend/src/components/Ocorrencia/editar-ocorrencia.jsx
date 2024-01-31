import React, { useEffect, useState } from 'react'
import { motion, transform } from 'framer-motion'
import axios from 'axios'
import {
    useToast,
    Select,
    Input
} from '@chakra-ui/react'
import { categorias } from './categorias'
import { AiOutlineEdit } from 'react-icons/ai'
import { TbSelect } from "react-icons/tb";
import { locais } from './locais'
import useWindowDimensions from '../Utils/getWindowDimensions'
import { Button } from '@chakra-ui/react'

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

    return (
        <>

            <div className='flex place-content-center justify-center w-full h-screen bg-slate-100'>
                <div className="w-11/12 mt-16 sm:mt-[4.5%] rounded-xl shadow-lg bg-white">
                    <h1 className="mt-4 sm:mb-8 md:text-gray-800 md:text-3xl sm:text-right text-center">
                        Editar Ocorrência
                    </h1>

                    <div className="flex flex-col -mt-2 sm:mb-4 md:grid md:grid-cols-3">
                        <div className="w-full -mt-2 px-4">
                            <label className="text-lg font-semibold tracking-wider text-gray-900 mt-4 mb-2">
                                Título
                                <label className='text-red-500'>*</label>
                            </label>
                            <Input type="text" placeholder={ocorrenciaDetails.nome} onChange={(e) => setNome(e.target.value)} maxLength={40} required />
                        </div>
                        <div className="w-full -mt-4 px-4 ">
                            <label className="text-lg font-semibold tracking-wider text-gray-900 mt-4 mb-2">
                                Categoria
                                <label className='text-red-500'>*</label>
                            </label>
                            {outraCategoria ?
                                <Input type="text" placeholder={ocorrenciaDetails.categoria} aria-label="Nome da categoria" maxLength={40} onChange={(e) => setCategoria(e.target.value)} />
                                :
                                <Select type="text" placeholder={ocorrenciaDetails.categoria} aria-label="Selecionar categoria" onChange={(e) => setCategoria(e.target.value)} >
                                    {categorias.map((categoria) => { return (<option value={categoria}>{categoria}</option>) })}
                                </Select>
                            }
                        </div>

                        <div className="w-full -mt-4 px-4  ">
                            <label className="text-lg font-semibold tracking-wider text-gray-900 mt-4 mb-2">
                                Localização
                                <label className='text-red-500'>*</label>
                            </label>
                            {/* <motion.button className=' ml-[64%]' whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title={outraLocalizacao ? "Locais existentes" : "Outro local"} onClick={() => changeLocalizacao(!outraLocalizacao)}>
                                <AiOutlineEdit style={{ width: '30px', height: '30px' }} />
                            </motion.button> */}
                            {outraLocalizacao ?
                                <Input type="text" placeholder={ocorrenciaDetails.localizacao} aria-label="Nome do local" maxLength={40} onChange={(e) => setLocalizacao(e.target.value)} />
                                :
                                <Select type="text" placeholder={ocorrenciaDetails.localizacao} onChange={(e) => setLocalizacao(e.target.value)} >
                                    {locais.map((local) => { return <option value={local}>{local}</option> })}
                                </Select>
                            }
                        </div>
                    </div>

                    <div className="w-full sm:mb-4 px-4">
                        <label className="text-lg font-semibold tracking-wider text-gray-900 mt-2 mb-2">
                            Descrição
                            <label className='text-red-500'>*</label>
                        </label>
                        <textarea style={{ height: transform(0.5, [0, 1], ["-100px", "450px"]), }} id='descricao' type="text" cols="40" rows="5" className="form-control" placeholder={ocorrenciaDetails.descricao} maxLength={500} onChange={(e) => setDescricao(e.target.value)} required />
                    </div>

                    <div className="flex">
                        <div className=' sm:w-[22%] px-4 '>
                            <label className="text-lg font-semibold tracking-wider text-gray-900 mt-2 mb-2">
                                Data
                                <label className='text-red-500'>*</label>
                            </label>
                            <input id='data' type="date" className="form-control" placeholder={ocorrenciaDetails.data} onChange={(e) => setData(e.target.value)} required />
                        </div>
                        <div className=' sm:w-[22%]  px-4 '>
                            <label className="text-lg font-semibold tracking-wider text-gray-900 mt-2 mb-2">
                                Horário
                                <label className='text-red-500'>*</label>
                            </label>
                            <input id='horario' type="time" className="form-control" placeholder={ocorrenciaDetails.hora} onChange={(e) => setHorario(e.target.value)} required />
                        </div>
                        <div className="px-4 mr-auto">
                            <label className="text-lg font-semibold tracking-wider text-gray-900 mt-2 mb-2">
                                Anexar imagem (opcional)
                            </label>
                            <input type="file" accept={acceptedFileTypesArray} multiple={false} id='image' className="form-control" placeholder={ocorrenciaDetails.image} onChange={e => (encodeImageFileAsURL(e.target.files[0]))} />
                        </div>
                    </div>

                    <footer className="flex flex-row justify-end mt-4 mb-4 mr-4">
                        <Button
                            className="mr-4"
                            onClick={() => handleClose()}
                        >
                            Cancelar
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => patchOcorrencia()}
                        >
                            Editar Ocorrência
                        </Button>
                    </footer>

                </div>
            </div >
        </>
    )
}

export default EditarOcorrencia