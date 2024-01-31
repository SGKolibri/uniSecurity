import React, { useState } from 'react'
import {
    useToast,
    Select,
    Input,
    Button
} from '@chakra-ui/react'
import { motion, transform } from 'framer-motion'
import Modal from 'react-bootstrap/Modal'
import useWindowDimensions from '../Utils/getWindowDimensions'
import axios from 'axios'
import { categorias } from './categorias'
import { locais } from './locais'
import { AiOutlineEdit } from "react-icons/ai";
import { TbSelect } from "react-icons/tb";
function CriarOcorrencia() {

    const backendURL = process.env.REACT_APP_BACKEND_URL;

    const { width } = useWindowDimensions();

    const toast = useToast();

    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('');
    const [data, setData] = useState('');
    const [hora, setHorario] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [image, setImage] = useState('');
    const [outraCategoria, setOutraCategoria] = useState(true);
    const [outraLocalizacao, setOutraLocalizacao] = useState(true);
    const registeredBy = localStorage.getItem('userName');

    const changeCategoria = () => {
        setOutraCategoria(!outraCategoria);
        setCategoria('');
    }
    const changeLocalizacao = () => {
        setOutraLocalizacao(!outraLocalizacao);
        setLocalizacao('');
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

    /* Open and Close Categoria Modal */

    /* Open and Close Modal */
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif';
    const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nome === '' || data === '' || hora === '' || categoria === '' || localizacao === '' || descricao === '') {
            toast({
                title: "Preencha todos os campos!",
                description: "Campos não foram preenchidos corretamente.",
                status: "error",
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

    /* Limpar os campos das ocorrências */
    const clearFields = () => {
        if (nome === '' && data === '' && hora === '' && localizacao === '' && descricao === '') {
            toast({
                title: "Nenhuma ocorrência para cancelar!",
                description: "Campos já estão limpos.",
                status: "info",
                duration: "2000",
                isClosable: true,
                position: "bottom-center"
            })
            handleClose();
            return;
        }
        toast({
            title: "Ocorrência cancelada com sucesso!",
            status: "success",
            duration: "2000",
            isClosable: true,
            position: "bottom-center"
        })
        clearAllField();
        handleClose();
    }

    const clearAllField = () => {
        setNome("");
        setCategoria("");
        setData("");
        setHorario("");
        setLocalizacao("");
        setDescricao("");
        const inputs = document.querySelectorAll('input, Input, textarea, file, select, Select');
        inputs.forEach(input => input.value = '');
    }

    return (
        <>
            {/* Styling with Tailwind CSS */}
            <div className='flex place-content-center justify-center w-full h-screen bg-slate-100'>
                <div className="w-11/12 mt-16 sm:mt-[4.5%] rounded-xl shadow-lg bg-white">
                    <h1 className="mt-4 sm:mb-8 md:text-gray-800 md:text-3xl sm:text-right text-center">
                        Registrar Ocorrência
                    </h1>

                    <div className="flex flex-col -mt-2 sm:mb-4 md:grid md:grid-cols-3">
                        <div className="w-full -mt-2 px-4">
                            <label className="text-lg font-semibold tracking-wider text-gray-900 mt-4 mb-2">
                                Título
                                <label className='text-red-500'>*</label>
                            </label>
                            <Input type="text" placeholder="Nome da ocorrência" onChange={(e) => setNome(e.target.value)} maxLength={40} required />
                        </div>
                        <div className="w-full -mt-4 px-4 ">
                            <label className="text-lg font-semibold tracking-wider text-gray-900 mt-4 mb-2">
                                Categoria
                                <label className='text-red-500'>*</label>
                            </label>
                            {outraCategoria ?
                                <Input type="text" placeholder="Nome da categoria" aria-label="Nome da categoria" maxLength={40} onChange={(e) => setCategoria(e.target.value)} />
                                :
                                <Select type="text" placeholder="Selecionar categoria" aria-label="Selecionar categoria" onChange={(e) => setCategoria(e.target.value)} >
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
                                <Input type="text" placeholder="Nome do local" aria-label="Nome do local" maxLength={40} onChange={(e) => setLocalizacao(e.target.value)} />
                                :
                                <Select type="text" placeholder="Selecionar local" onChange={(e) => setLocalizacao(e.target.value)} >
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
                        <textarea style={{ height: transform(0.5, [0, 1], ["-100px", "450px"]), }} id='descricao' type="text" cols="40" rows="5" className="form-control" placeholder="Descrição da ocorrência" maxLength={500} onChange={(e) => setDescricao(e.target.value)} required />
                    </div>

                    <div className="flex">
                        <div className='w-3/6 sm:w-[22%] px-4 '>
                            <label className="text-lg font-semibold tracking-wider text-gray-900 mt-2 mb-2">
                                Data
                                <label className='text-red-500'>*</label>
                            </label>
                            <input id='data' type="date" className="form-control" placeholder="Data da ocorrência" onChange={(e) => setData(e.target.value)} required />
                        </div>
                        <div className='w-3/6 sm:w-[22%]  px-4 '>
                            <label className="text-lg font-semibold tracking-wider text-gray-900 mt-2 mb-2">
                                Horário
                                <label className='text-red-500'>*</label>
                            </label>
                            <input id='horario' type="time" className="form-control" placeholder="Horário da ocorrência" onChange={(e) => setHorario(e.target.value)} required />
                        </div>
                    </div>

                    <div className="sm:flex w-full justify-end items-end mt-2 md:fixed sm:px-16 sm:py-4 bottom-0 left-0 right-0">
                        <div className="w-full sm:w-2/6 px-4 mr-auto">
                            <label className="text-lg font-semibold tracking-wider text-gray-900 mt-2 mb-2">
                                Anexar imagem (opcional)
                            </label>
                            <input type="file" accept={acceptedFileTypesArray} multiple={false} id='image' className="form-control" placeholder="imagem" onChange={e => (encodeImageFileAsURL(e.target.files[0]))} />
                        </div>

                        <div className='flex w-full py-8 sm:py-0 px-[5%] sm:px-3 justify-between sm:justify-end'>
                            <div className="w-5/12 sm:w-1/6 px-1 sm:px-4">
                                <Button className='w-100' onClick={() => (handleShow())}>
                                    Cancelar
                                </Button >
                                <Modal show={show} onHide={handleClose} centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Deseja cancelar a ocorrência?</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Footer>
                                        <Button colorScheme='green' onClick={clearFields}>
                                            Cancelar ocorrência
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                            <div className="w-5/12 sm:w-1/6 px-1 sm:l-auto">
                                <Button className='w-full h-full sm:3/6' colorScheme="blue" onClick={(e) => handleSubmit(e)}>
                                    Salvar
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div >


            {/* 
            {width > 992 ? (
                <div className="auth-wrapper">
                    <div style={{
                        width: '98%',
                        height: '88%',
                        marginTop: '4.5%',
                        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)',
                        overflowY: 'hidden',
                    }}
                        className="auth-inner"
                    >
                        <div style={{
                            marginTop: "-1.5%",
                            marginBottom: "2%",
                            marginLeft: "-1%",
                            fontSize: 30
                        }}>
                            Registrar Ocorrência
                        </div>
                        
                        <div style={{
                            float: "left",
                            width: "40%",
                            marginBottom: "1.5%",
                        }}>
                            <label>
                                Título
                                <label className='text-red-500'>*</label>
                            </label>
                            <h
                                style={{
                                    position: "absolute",
                                    marginTop: "0.25%",
                                    right: "59%",
                                    fontSize: 14,
                                    color: "#AAA"
                                }}
                            >
                                Caracteres restantes: {40 - nome.length}
                            </h>
                            <input
                                style={{ height: "-100px" }}
                                id='nome'
                                type="text"
                                className="form-control"
                                placeholder="Nome da ocorrência"
                                onChange={(e) => setNome(e.target.value)}
                                maxLength={40}
                                required
                            />
                        </div>

                        
                        <div style={{
                            float: "left",
                            width: "17.5%",
                            marginBottom: "1.5%",
                            marginLeft: "20%",
                            position: "relative",
                            display: "inline-block"
                        }}>
                            <label>
                                Horário
                                <label className='text-red-500'>*</label>
                            </label>
                            <input
                                id='horario'
                                type="time"
                                className="form-control"
                                placeholder="Horário da ocorrência"
                                onChange={(e) => setHorario(e.target.value)}
                                required
                            />

                        </div>

                        
                        <div style={{
                            float: "right",
                            width: "17.5%",
                            marginBottom: "1.5%"
                        }}>
                            <label>
                                Data
                                <label className='text-red-500'>*</label>
                            </label>
                            <input
                                id='data'
                                type="date"
                                className="form-control"
                                placeholder="Data da ocorrência"
                                onChange={(e) => setData(e.target.value)}
                                required
                            />
                        </div>

                        
                        <div style={{
                            float: "left",
                            width: "40%",
                            marginBottom: "1.5%",
                        }}>
                            <label>
                                Categoria
                                <label className='text-red-500'>*</label>
                            </label>
                            <motion.button
                                whileHover={{
                                    scale: 1.1,
                                    backgroundColor: "#E8E8E8",
                                    borderRadius: "50%",
                                    width: "30px",
                                    height: "30px",
                                }}
                                whileTap={{ scale: 0.9 }}
                                title={outraCategoria ? "Categorias existentes" : "Outra categoria"}
                                style={{
                                    position: "absolute",
                                    width: "28px",
                                    height: "28px",
                                    marginTop: "-0.1%",
                                    right: "59%",

                                }}
                                onClick={() => changeCategoria(!outraCategoria)}
                            >
                                {outraCategoria ?
                                    <TbSelect style={{ width: '28px', height: '28px' }} />
                                    :
                                    <AiOutlineEdit style={{ width: '28px', height: '28px' }} />
                                }

                            </motion.button>
                            {
                                outraCategoria ?
                                    <>
                                        <h
                                            style={{
                                                position: "absolute",
                                                marginTop: "0.25%",
                                                right: "61%",
                                                fontSize: 14,
                                                color: "#AAA"
                                            }}
                                        >
                                            Caracteres restantes: {40 - categoria.length}
                                        </h>
                                        <Input
                                            type="text"
                                            placeholder="Nome da categoria"
                                            aria-label="Nome da categoria"
                                            maxLength={40}
                                            onChange={(e) => setCategoria(e.target.value)}
                                        />
                                    </>
                                    :
                                    <>
                                        <Select
                                            type="text"
                                            placeholder="Selecionar categoria"
                                            aria-label="Selecionar categoria"
                                            onChange={(e) => setCategoria(e.target.value)}
                                        >
                                            {categorias.map((categoria) => {
                                                return (
                                                    <option value={categoria}>{categoria}</option>
                                                )
                                            })}
                                        </Select>
                                    </>
                            }
                        </div>

                        
                        <div style={{
                            float: "right",
                            width: "40%",
                            marginBottom: "1.5%",
                        }}>
                            <label>
                                Localização
                                <label className='text-red-500'>*</label>
                            </label>
                            <motion.button
                                whileHover={{
                                    scale: 1.1,
                                    backgroundColor: "#E8E8E8",
                                    borderRadius: "50%",
                                    width: "30px",
                                    height: "30px",
                                }}
                                whileTap={{ scale: 0.9 }}
                                title={outraLocalizacao ? "Locais existentes" : "Outro local"}
                                style={{
                                    position: "absolute",
                                    width: "28px",
                                    height: "28px",
                                    marginTop: "-0.1%",
                                    right: "4.6%",

                                }}
                                onClick={() => changeLocalizacao(!outraLocalizacao)}
                            >
                                {outraLocalizacao ?
                                    <TbSelect style={{ width: '28px', height: '28px' }} />
                                    :
                                    <AiOutlineEdit style={{ width: '28px', height: '28px' }} />
                                }
                            </motion.button>
                            {
                                outraLocalizacao ?
                                    <>
                                        <h
                                            style={{
                                                position: "absolute",
                                                marginTop: "0.25%",
                                                right: "6.6%",
                                                fontSize: 14,
                                                color: "#AAA"
                                            }}

                                        >
                                            Caracteres restantes: {40 - localizacao.length}
                                        </h>
                                        <Input
                                            type="text"
                                            placeholder="Nome do local"
                                            aria-label="Nome do local"
                                            maxLength={40}
                                            onChange={(e) => setLocalizacao(e.target.value)}
                                        />
                                    </>
                                    :
                                    <>
                                        <Select
                                            type="text"
                                            placeholder="Selecionar local"
                                            aria-label="Selecionar local"
                                            onChange={(e) => setLocalizacao(e.target.value)}
                                        >
                                            {locais.map((local) => {
                                                return (
                                                    <option value={local}>{local}</option>
                                                )
                                            })}
                                        </Select>
                                    </>
                            }
                        </div>

                        
                        <div style={{
                            float: "left",
                            marginBottom: "5%",
                            width: "100%"
                        }}>
                            <label>
                                Descrição
                                <label className='text-red-500'>*</label>
                            </label>
                            <h
                                style={{
                                    position: "absolute",
                                    marginTop: "0.25%",
                                    right: "4.6%",
                                    fontSize: 14,
                                    color: "#AAA"
                                }}
                            >
                                Caracteres restantes: {500 - descricao.length}
                            </h>
                            <textarea
                                style={{
                                    height: transform(0.5, [0, 1], ["-100px", "550px"]),
                                }}
                                id='descricao'
                                type="text"
                                cols="40"
                                rows="5"
                                className="form-control"
                                placeholder="Descrição da ocorrência"
                                maxLength={500}
                                onChange={(e) => setDescricao(e.target.value)}
                                required
                            />
                        </div>

                        
                        <div style={{
                            float: "left",
                            width: "25%",
                            marginTop: "-4%",
                            marginRight: "2%",
                        }}>
                            Anexar imagem (opcional)
                            <input
                                type="file"
                                accept="image/*"
                                multiple={false}
                                id='image'
                                className="form-control"
                                placeholder="imagem"
                                onChange={e => (
                                    encodeImageFileAsURL(e.target.files[0])
                                )}
                            />
                        </div>

                        
                        <div style={{
                            float: "right",
                            width: "50%",
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "-1.5%",
                        }} className='wrapperButton'>

                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{

                                    width: "25%",
                                    marginRight: "2%",
                                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)"
                                }}
                                className='btn btn-primary'
                                onClick={() => (handleShow())}
                            >
                                Cancelar
                            </motion.button >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{

                                    width: "25%",
                                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)"
                                }}
                                type="submit"
                                className="btn btn-primary"
                                background-color="#4DA325"
                                onClick={handleSubmit}
                            >
                                Salvar
                            </motion.button>
                        </div>

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Deseja cancelar a ocorrência?</Modal.Title>
                            </Modal.Header>
                            <Modal.Footer>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    variant="primary"
                                    className='btn btn-primary'
                                    style={{
                                        marginRight: "0.5%",
                                        border: "none",
                                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
                                    }}
                                    onClick={clearFields}>
                                    Cancelar ocorrência
                                </motion.button>
                            </Modal.Footer>
                        </Modal>
                    </div >
                </div >

            ) : (
                <>
                    <div className="auth-wrapper">
                        <div className='auth-inner'
                            style={{
                                height: "auto",
                                minHeight: "100%",
                                width: "95%",
                                padding: "10%",
                                marginTop: "20%",
                                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)"
                            }}
                        >
                            <div style={{ textAlign: "center", alignItems: "center" }}>
                                <h style={{ fontSize: 28 }}>
                                    Registrar
                                </h>
                            </div>

                            
                            <div style={{
                                width: "100%",
                                marginTop: "10%",
                                marginBottom: "5%",
                            }}>
                                <label>
                                    Título
                                    <label className='text-red-500'>*</label>
                                </label>
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <input
                                        id='nome'
                                        type="text"
                                        className="form-control"
                                        placeholder="Título da ocorrência"
                                        onChange={(e) => setNome(e.target.value)}
                                        maxInput={40}
                                        required
                                    />
                                </div>
                            </div>

                            
                            <div style={{
                                width: "100%",
                                marginBottom: "5%",
                            }}>
                                <label>
                                    Categoria
                                    <label className='text-red-500'>*</label>
                                </label>
                                <motion.button
                                    whileHover={{
                                        scale: 1.1,
                                        backgroundColor: "#E8E8E8",
                                        borderRadius: "50%",
                                        width: "28px",
                                        height: "28px",
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    title={outraCategoria ? "Categorias existentes" : "Outra categoria"}
                                    style={{
                                        position: "absolute",
                                        width: "28px",
                                        height: "28px",
                                        marginTop: "-1%",
                                        right: "13%",
                                    }}
                                    onClick={() => setOutraCategoria(!outraCategoria)}
                                >
                                    {outraCategoria ?
                                        <TbSelect style={{ width: '29px', height: '29px' }} />
                                        :
                                        <AiOutlineEdit style={{ width: '30px', height: '30px' }} />
                                    }

                                </motion.button>

                                {
                                    outraCategoria ?
                                        <>
                                            <Input
                                                type="text"
                                                placeholder="Nome da categoria"
                                                aria-label="Nome da categoria"
                                                maxLength={40}
                                                onChange={(e) => setCategoria(e.target.value)}
                                            />
                                        </>
                                        :
                                        <>
                                            <Select
                                                type="text"
                                                placeholder="Selecionar categoria"
                                                aria-label="Selecionar categoria"
                                                onChange={(e) => setCategoria(e.target.value)}
                                            >
                                                {categorias.map((categoria) => {
                                                    return (
                                                        <option value={categoria}>{categoria}</option>
                                                    )
                                                })}
                                            </Select>
                                        </>
                                }
                            </div>

                            
                            <div style={{
                                width: "100%",
                                marginBottom: "5%",
                            }}>
                                <label>
                                    Localização
                                    <label className='text-red-500'>*</label>
                                </label>
                                <motion.button
                                    whileHover={{
                                        scale: 1.1,
                                        backgroundColor: "#E8E8E8",
                                        borderRadius: "50%",
                                        width: "28px",
                                        height: "28px",
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    title={outraLocalizacao ? "Locais existentes" : "Outro local"}
                                    style={{
                                        position: "absolute",
                                        width: "28px",
                                        height: "28px",
                                        marginTop: "-1%",
                                        right: "13%",
                                    }}
                                    onClick={() => setOutraLocalizacao(!outraLocalizacao)}
                                >
                                    {outraLocalizacao ?
                                        <TbSelect style={{ width: '29px', height: '29px' }} />
                                        :
                                        <AiOutlineEdit style={{ width: '30px', height: '30px' }} />
                                    }
                                </motion.button>
                                {
                                    outraLocalizacao ?
                                        <>
                                            <Input
                                                type="text"
                                                placeholder="Nome do local"
                                                aria-label="Nome do local"
                                                maxLength={40}
                                                onChange={(e) => setLocalizacao(e.target.value)}
                                            />
                                        </>
                                        :
                                        <>
                                            <Select
                                                type="text"
                                                placeholder="Selecionar local"
                                                aria-label="Selecionar local"
                                                onChange={(e) => setLocalizacao(e.target.value)}
                                            >
                                                {locais.map((local) => {
                                                    return (
                                                        <option value={local}>{local}</option>
                                                    )
                                                })}
                                            </Select>
                                        </>
                                }
                            </div>

                            
                            <div style={{
                                width: "100%",
                                marginBottom: "5%",
                            }}>
                                <label>
                                    Descrição
                                    <label className='text-red-500'>*</label>
                                </label>
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <textarea
                                        style={{
                                            height: transform(0.5, [0, 1], ["-100px", "450px"]),
                                        }}
                                        id='descricao'
                                        type="text"
                                        cols="40"
                                        rows="5"
                                        maxLength={500}
                                        className="form-control"
                                        placeholder="Descrição da ocorrência"
                                        onChange={(e) => setDescricao(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            
                            <div style={{
                                width: "40%",
                                marginBottom: "5%",
                                position: "relative",
                                display: "inline-block",
                                float: "left",
                            }}>
                                <label>
                                    Data
                                    <label className='text-red-500'>*</label>
                                </label>
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <input
                                        id='data'
                                        type="date"
                                        className="form-control"
                                        placeholder="Data da ocorrência"
                                        onChange={(e) => setData(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            
                            <div
                                style={{
                                    width: "40%",
                                    marginBottom: "5%",
                                    position: "relative",
                                    display: "inline-block",
                                    float: "right",
                                }}
                            >
                                <label>
                                    Horário
                                    <label className='text-red-500'>*</label>
                                </label>
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                    }}
                                >
                                    <input
                                        id='horario'
                                        type="time"
                                        className="form-control"
                                        placeholder="Horário da ocorrência"
                                        onChange={(e) => setHorario(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            
                            <div style={{
                                width: "100%",
                                marginBottom: "5%",
                            }}>
                                <label>
                                    Anexar imagem
                                </label>
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <input
                                        type="file"
                                        accept={acceptedFileTypesArray}
                                        multiple={false}
                                        id='image'
                                        className="form-control"
                                        placeholder="imagem"
                                        onChange={e => (encodeImageFileAsURL(e.target.files[0]))}
                                    />
                                </div>
                            </div>

                            
                            <div style={{
                                width: "40%",
                                marginBottom: "5%",
                                position: "relative",
                                display: "inline-block",
                                float: "left",
                            }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        width: "100%",
                                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)"
                                    }}
                                    className='btn btn-primary'
                                    onClick={() => (handleShow())}
                                >
                                    Cancelar
                                </motion.button >
                                <Modal show={show} onHide={handleClose} centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Deseja cancelar a ocorrência?</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Footer>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            variant="primary"
                                            className='btn btn-primary'
                                            style={{
                                                marginRight: "0.5%",
                                                backgroundColor: "#4DA325",
                                                border: "none",
                                                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",

                                            }}
                                            onClick={clearFields}>
                                            Cancelar ocorrência
                                        </motion.button>
                                    </Modal.Footer>
                                </Modal>
                            </div>

                            
                            <div style={{
                                width: "40%",
                                marginBottom: "5%",
                                position: "relative",
                                display: "inline-block",
                                float: "right",
                            }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        width: "100%",
                                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)"
                                    }}
                                    type="submit"
                                    className="btn btn-primary"
                                    background-color="#4DA325"
                                    onClick={handleSubmit}
                                >
                                    Salvar
                                </motion.button>
                            </div>

                        </div>
                    </div>
                </>
            )
            }
             */}

        </>
    )
}

export default CriarOcorrencia