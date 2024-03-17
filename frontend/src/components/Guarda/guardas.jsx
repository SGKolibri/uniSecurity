import React, { useEffect, useState } from "react"
import { Spinner, Input, InputGroup, InputLeftElement, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, useDisclosure, Select } from '@chakra-ui/react'
import GuardaTable from "../../components/Guarda/guarda-table"
import { motion } from "framer-motion"
import axios from "axios"
import NavbarHome from "../Navbar/navbar-home";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import InputMask from 'react-input-mask';
import { useToast } from '@chakra-ui/react'


const PaginationComponent = ({ curPage, setCurPage, cardsPerPage, numberOfOcorrencias, loading }) => {

    const active = 'bg-[#B9B9B9] text-white py-2 px-4 h-full'
    const inactive = 'bg-white text-[#505050] py-2 px-4 h-full'

    const totalPages = Math.ceil(numberOfOcorrencias / cardsPerPage);

    let startPage, endPage;
    if (totalPages <= 5) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (curPage === Math.ceil(totalPages / 2)) {
            startPage = curPage - 1;
            endPage = curPage + 1;
        } else if (curPage <= 2) {
            startPage = 1;
            endPage = 5;
        } else if (curPage + 2 >= totalPages) {
            startPage = totalPages - 4;
            endPage = totalPages;
        } else {
            startPage = curPage - 2;
            endPage = curPage + 2;
        }
    }
    const pageNumbers = Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);

    return (
        <>

            <div className='bg-white w-2/5 flex px-2 gap-2 rounded-lg text-[#505050] border-[#B9B9B9] border-2 justify-center items-center' style={{ boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.25)' }}>
                {loading ?
                    <div>
                        <Spinner />
                    </ div>
                    :
                    <>
                        <div className='flex mr-auto'>
                            <motion.button onClick={() => { if (curPage > 1) { setCurPage(curPage - 1) } console.log(curPage) }} disabled={curPage === 1}>
                                <div className='flex py-2 items-center justify-center'>
                                    <FaAngleLeft className='w-6 h-6' />
                                    <label className=' cursor-pointer'>
                                        Anterior
                                    </label>
                                </div>
                            </motion.button>
                            <div className='border ml-2 my-2' />
                        </div>
                        <div>
                            {totalPages > 4 && totalPages !== 5 && curPage > 3 &&
                                <>
                                    <motion.button className={curPage === 1 ? active : inactive} onClick={() => setCurPage(1)}>
                                        {1}
                                    </motion.button>
                                    <span>...</span>
                                </>
                            }

                            {pageNumbers.map((number) => (
                                <motion.button className={curPage === number ? active : inactive} key={number} onClick={() => setCurPage(number)}  >
                                    {number}
                                </motion.button>
                            ))}

                            {totalPages > 4 && totalPages !== 5 && curPage < totalPages - 2 &&
                                <>
                                    <span>...</span>
                                    <motion.button className={curPage === totalPages ? active : inactive} onClick={() => setCurPage(totalPages)}>
                                        {totalPages}
                                    </motion.button>
                                </>
                            }
                        </div>
                        <div className='flex ml-auto'>
                            <div className='border mr-2 my-2' />
                            <motion.button onClick={() => { if (curPage < Math.ceil(numberOfOcorrencias / cardsPerPage)) { setCurPage(curPage + 1) } console.log(curPage) }} disabled={curPage === Math.ceil(numberOfOcorrencias / cardsPerPage)}>
                                <div className='flex py-2 items-center justify-center'>
                                    <label className=' cursor-pointer'>
                                        Próximo
                                    </label>
                                    <FaAngleRight className='w-6 h-6' />
                                </div>
                            </motion.button>
                        </div>
                    </>
                }
            </div>


        </>
    );
}

export default function Guardas() {

    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [search, setSearch] = useState('');
    const [guardas, setGuardas] = useState([]);
    const [curPage, setCurPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [guardaImage, setGuardaImage] = useState(null);
    const [efetivacao, setEfetivacao] = useState(null);
    const [turno, setTurno] = useState(null);
    const [cpf, setCpf] = useState(null);

    const guardasPerPage = 7;

    useEffect(() => {
        getGuardas();
    }, [curPage, search]);

    const getGuardas = async () => {
        setLoading(false)
        try {
            const response = await axios.get(`${backendURL}/get-users?page=${curPage - 1}&limit=${guardasPerPage}&search=${search}`);
            setTotalPages(Math.ceil(response.data.usersLength / guardasPerPage))
            setGuardas(response.data.users)
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

        console.log(name, surname, email, password, guardaImage, efetivacao, turno, cpf)
        try {
            await axios.post(`${backendURL}/register-user`, {
                nome: name,
                sobrenome: surname,
                email: email,
                password: password,
                image: guardaImage,
                efetivacao: efetivacao,
                turno: turno,
                cpf: cpf
            })
                .then((response) => {
                    toast({
                        title: "Guarda cadastrado com sucesso",
                        position: "bottom-center",
                        status: "success",
                        duration: 2500,
                        isClosable: true,
                    })
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


    function encodeImageFileAsURL(element) {
        let file = element;
        let reader = new FileReader();
        reader.onloadend = function () {
            setGuardaImage(file);
        }
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
                <div className='w-screen flex justify-between bottom-0 px-36'>
                    <div className='w-full' >
                        <motion.button className='py-2 px-12 bg-[#00151F] text-white rounded-md'
                            onClick={onOpen}
                        >
                            Novo cadastro
                        </motion.button>

                    </div>
                    <div className='w-1/2 flex gap-2'>
                        <InputGroup >
                            <InputLeftElement
                                pointerEvents="none"
                                children={
                                    <>
                                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.9121 14.5166L20.5 20.1045" stroke="#000" stroke-linecap="round" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 16.1045C13.8137 16.1045 16.5 13.4182 16.5 10.1045C16.5 6.79078 13.8137 4.10449 10.5 4.10449C7.18629 4.10449 4.5 6.79078 4.5 10.1045C4.5 13.4182 7.18629 16.1045 10.5 16.1045Z" stroke="#000" />
                                        </svg>
                                    </>
                                }
                            />
                            <Input style={{ borderRadius: '0.75rem', borderWidth: '2px' }} className='border-black px-6 rounded-3xl' type="text" placeholder="Procurar guarda" onChange={(e) => setSearch(e.target.value)} />                        </InputGroup>
                    </div>
                </div>
                <div className='px-32 mt-auto py-3'>
                    {
                        loading ?
                            <div className="flex justify-center items-center h-full">
                                <Spinner size="md" />
                            </div>
                            :
                            guardas.length > 0 ?
                                <GuardaTable guardas={guardas} />
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
                        {/* Image placeholder */}
                        <div className="flex justify-center pt-2">
                            <label className={`flex py-3 px-6 ${guardaImage ? 'bg-white' : 'bg-[#ddd]'} text-[#aaa] rounded-md justify-center gap-2 items-center hover:bg-[#ccc] cursor-pointer`} >
                                {guardaImage ?
                                    <img src={URL.createObjectURL(guardaImage)} alt="guarda" className='w-32 h-32' />
                                    :
                                    <FaUser className='w-32 h-32' />
                                }
                                <input type="file" id='image' className="hidden" placeholder="imagem" onChange={(e) => {
                                    encodeImageFileAsURL(e.target.files[0])
                                    console.log(e.target.files[0])
                                    console.log("Image: ", guardaImage)
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
                            <Input value={email} required className="border border-black" onChange={(e) => setEmail(e.target.value)} />
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
                                <Select value={turno} required className="border border-black" onChange={(e) => {
                                    console.log(e.target.value)
                                    setTurno(e.target.value)
                                }}>
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