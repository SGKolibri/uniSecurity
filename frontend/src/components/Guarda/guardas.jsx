import React, { useEffect, useState } from "react"
import { Spinner, Input, InputGroup, InputLeftElement, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, useDisclosure, Select } from '@chakra-ui/react'
import GuardaTable from "../../components/Guarda/guarda-table"
import { motion } from "framer-motion"
import axios from "axios"
import NavbarHome from "../Navbar/navbar-home";
import { TbAdjustmentsHorizontal } from 'react-icons/tb';
import { FaUser } from "react-icons/fa";
import InputMask from 'react-input-mask';
import { useToast } from '@chakra-ui/react';
import PaginationComponent from "../Pagination/pagination";

export default function Guardas() {

    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { isOpenFilter, onOpenFilter, onCloseFilter } = useDisclosure()


    const [search, setSearch] = useState('');
    const [guardas, setGuardas] = useState([]);
    const [curPage, setCurPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [guardaImage, setGuardaImage] = useState('');
    const [efetivacao, setEfetivacao] = useState('');
    const [turno, setTurno] = useState('manha');
    const [cpf, setCpf] = useState('');

    const guardasPerPage = 8;

    useEffect(() => {
        getGuardas();
    }, [curPage, search]);

    const getGuardas = async () => {
        try {
            const response = await axios.get(`${backendURL}/get-users?page=${curPage - 1}&limit=${guardasPerPage}&search=${search}`);
            setTotalPages(Math.ceil(response.data.usersLength / guardasPerPage))
            setGuardas(response.data.users)
            setLoading(false)
        } catch (error) {
            toast({
                title: "Erro ao conectar com o servidor.",
                position: "bottom-center",
                status: "error",
                duration: 2500,
                isClosable: true,
            })
        }
    }

    const handleRegister = async () => {

        try {
            await axios.post(`${backendURL}/register-user`, {
                name: name,
                surname: surname,
                email: email,
                password: password,
                image: guardaImage,
                efetivacao: efetivacao,
                turno: turno,
                cpf: cpf
            })
                .then((response) => {
                    if (response.data.status === "error") {
                        toast({
                            title: "Erro ao registrar guarda.",
                            description: response.data.error,
                            position: "bottom-center",
                            status: "error",
                            duration: 2500,
                            isClosable: true,
                        })
                    }
                })
            onClose();
            getGuardas();
        } catch (error) {
            toast({
                title: "Erro ao conectar com o servidor.",
                description: error.message,
                position: "bottom-center",
                status: "error",
                duration: 2500,
                isClosable: true,
            })
        }
    }

    const handleStatusChange = async (id, handleClose) => {
        let guarda = guardas.find(guarda => guarda._id === id);

        try {
            await axios.patch(`${backendURL}/update-user-status/${id}`, {
                status: guarda.status === true ? false : true
            })
                .then((response) => {
                    toast({
                        title: "Status atualizado com sucesso!",
                        description: "A página será recarregada.",
                        position: "center",
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                    })
                    setGuardas(guardas.map(guarda =>
                        guarda._id === id ? { ...guarda, status: response.data.user.status } : guarda
                    ))
                    getGuardas();
                })
        } catch (error) {
            toast({
                title: "Erro ao conectar com o servidor.",
                description: error.message,
                position: "bottom-center",
                status: "error",
                duration: 2500,
                isClosable: true,
            })
        }
    }

    function encodeImageFileAsURL(element) {
        let file = element;
        let reader = new FileReader();
        reader.addEventListener("load", function () {
            setGuardaImage(reader.result);
        });
        reader.readAsDataURL(file);
    }

    return (
        <>
            <div className='w-full h-screen justif items-center bg-[#F2F2F2] relative'>
                <NavbarHome />
                <div className='w-full text-center pt-11 pb-8'>
                    <label className=' text-3xl font-semibold'>
                        Tabela de Guardas
                    </label>
                </div>

                <div className='w-full flex sm:flex-row flex-col-reverse gap-2 justify-between px-[40px] sm:px-[128px]'>
                    <div className='w-full md:w-[20%] items-center' >
                        <motion.button className='py-2 w-full bg-[#00151F] text-white rounded-[3px]'
                            onClick={onOpen}
                        >
                            Novo Cadastro
                        </motion.button>
                    </div>
                    <div className='w-full sm:w-[40%] flex gap-2'>
                        <InputGroup >
                            <InputLeftElement
                                pointerEvents="none"
                                children={
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.9121 14.5166L20.5 20.1045" stroke="#000" stroke-linecap="round" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 16.1045C13.8137 16.1045 16.5 13.4182 16.5 10.1045C16.5 6.79078 13.8137 4.10449 10.5 4.10449C7.18629 4.10449 4.5 6.79078 4.5 10.1045C4.5 13.4182 7.18629 16.1045 10.5 16.1045Z" stroke="#000" />
                                    </svg>
                                }
                            />
                            <Input style={{ borderRadius: '1rem', borderWidth: '2px', backgroundColor: '#f9f9f9' }} className='border-black px-6 rounded-3xl' type="text" placeholder="" onChange={(e) => setSearch(e.target.value)} />                        </InputGroup>
                        <motion.button onClick={onOpenFilter}>
                            <TbAdjustmentsHorizontal className='w-8 h-8 stroke-1 text-black' />
                        </motion.button>
                    </div>
                </div>

                <div className='px-8 md:px-32 mt-auto py-3'>
                    {
                        loading ?
                            <div className="flex justify-center items-center h-full">
                                <Spinner size="md" />
                            </div>
                            :
                            guardas.length > 0 ?
                                <GuardaTable statusChange={handleStatusChange} guardas={guardas} getGuardas={getGuardas} />
                                :
                                <div className='w-full h-3/4 flex justify-center items-center'>
                                    <label className='text-2xl font-semibold'>
                                        Nenhum guarda registrado
                                    </label>
                                </div>
                    }
                </div>

                <div>
                    <div className='absolute pb-3 bottom-0 w-full flex justify-center'>
                        <PaginationComponent curPage={curPage} setCurPage={setCurPage} cardsPerPage={guardasPerPage} numberOfOcorrencias={totalPages} />
                    </div>
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={onClose} size='lg' >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <div className="flex justify-center pt-2">
                            <label className={`flex py-3 px-6 ${guardaImage ? 'bg-white' : 'bg-[#ddd]'} text-[#aaa] rounded-md justify-center gap-2 items-center hover:bg-[#ccc] cursor-pointer`} >
                                {guardaImage ?
                                    <img src={guardaImage} alt="guarda" className='w-32 h-32' /> // Use the data URL directly
                                    :
                                    <FaUser className='w-32 h-32' />
                                }
                                <input type="file" id='image' className="hidden" placeholder="imagem" onChange={e => {
                                    encodeImageFileAsURL(e.target.files[0])
                                }} />
                            </label>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex gap-5">
                            <div className="w-1/2">
                                <label className="text-sm">
                                    Nome
                                </label>
                                <Input value={name} required className="border border-black" onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="w-1/2">
                                <label className="text-sm">
                                    Sobrenome
                                </label>
                                <Input value={surname} required className="border border-black" onChange={(e) => setSurname(e.target.value)} />
                            </div>
                        </div>
                        <div className="py-2">
                            <label className="text-sm">
                                CPF
                            </label>
                            <InputMask
                                value={cpf} required
                                mask="999.999.999-99"
                                onChange={(e) => setCpf(e.target.value)}
                            >
                                {(inputProps) => <Input  {...inputProps} className="border border-black" />}
                            </InputMask>
                        </div>
                        <div className="py-2">
                            <label className="text-sm">
                                Email
                            </label>
                            <Input value={email} type="email" required className="border border-black" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="py-2">
                            <label className="text-sm">
                                Senha
                            </label>
                            <Input value={password} required type="password" minLength={6} className="border border-black" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="flex gap-5">
                            <div className="w-1/2">
                                <label>
                                    Data de efetivação
                                </label>
                                <Input value={efetivacao} required type="date" className="border border-black" onChange={(e) => setEfetivacao(e.target.value)} />
                            </div>
                            <div className="w-1/2">
                                <label>
                                    Turno
                                </label>
                                <Select value={turno} required className="border border-black" onChange={(e) => setTurno(e.target.value)}>
                                    <option value="manha">Manhã</option>
                                    <option value="tarde">Tarde</option>
                                    <option value="noite">Noite</option>
                                </Select>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="w-full py-1 flex justify-evenly">
                            <motion.button className='px-4 py-[7px] bg-black text-white rounded-[5px]' onClick={handleRegister}>
                                Confirmar
                            </motion.button>
                            <motion.button className='px-4 py-[7px] bg-white border border-black text-black rounded-[5px]' onClick={onClose}>
                                Cancelar
                            </motion.button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}