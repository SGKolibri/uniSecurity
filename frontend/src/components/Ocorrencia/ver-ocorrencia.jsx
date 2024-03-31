import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, useDisclosure, useToast, InputGroup, InputLeftElement, Spinner } from '@chakra-ui/react';
import { TbAdjustmentsHorizontal } from 'react-icons/tb';
import { categorias } from '../Utils/categorias';
import { locais } from '../Utils/locais';
import { FilterContext } from '../../components/Context/filter-context';
import Cards from '../../components/Ocorrencia/cards';
import NavbarHome from '../Navbar/navbar-home';
import { CiViewList } from "react-icons/ci";
import { CiGrid41 } from "react-icons/ci";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import PaginationComponent from '../Pagination/pagination';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuthUser } from 'react-auth-kit';

function VerOcorrencia({ children }) {

    const backendURL = process.env.REACT_APP_BACKEND_URL;

    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();
    const toast = useToast();

    const [curPage, setCurPage] = useState(1)
    const [search, setSearch] = useState('');
    const [data, setData] = useState(-1); // -1 = mais recente, 1 = mais antiga
    const [tempData, setTempData] = useState(-1);
    const [categoria, setCategoria] = useState('');
    const [tempCategoria, setTempCategoria] = useState('');
    const [local, setLocal] = useState('');
    const [tempLocal, setTempLocal] = useState('');
    const [tempRegisteredBy, setTempRegisteredBy] = useState('');
    const [registeredByFilter, setRegisteredByFilter] = useState('');

    const [hasFilters, setHasFilters] = useState(false);

    const [numberOfOcorrencias, setNumberOfOcorrencias] = useState(0);
    const [cardsPerPage, setCardsPerPage] = useState(8);
    const [loading, setLoading] = useState(true);
    const [gridView, setGridView] = useState(false);
    const [ocorrencias, setOcorrencias] = useState();

    const authUser = useAuthUser();
    const username = authUser().userDetail.name;
    const userRole = authUser().userDetail.role;

    const clearFilters = () => {
        if (tempData === -1 && tempCategoria === '' && tempLocal === '' && tempRegisteredBy === '') {
            toast({
                title: "Nenhum filtro para remover.",
                position: "bottom",
                status: "info",
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        setHasFilters(false);
        ['Select', 'Input'].forEach((type) => document.querySelectorAll(type).forEach((input) => (input.value = '')));
        setSearch('');
        setTempData(-1);
        setTempLocal('');
        setTempCategoria('');
        setCategoria('');
        setLocal('');
        setRegisteredByFilter('');
        setData(-1);
        const filterPromise = new Promise((resolve, reject) => {
            setTimeout(() => resolve(200), 750)
        })
        toast.promise(filterPromise, {
            loading: { title: 'Removendo filtros...' },
            success: { title: 'Filtros removidos!' },
            error: { title: 'Erro ao remover filtros' },
        });
        setHasFilters(false);
    };

    useEffect(() => {
        getOcorrencias()
    }, [categoria, local, registeredByFilter, data, hasFilters, curPage, search, backendURL, numberOfOcorrencias, setCurPage, cardsPerPage,]);

    const getOcorrencias = async () => {
        setLoading(true);

        let currentPage = search === "" ? curPage : 1;
        setCurPage(currentPage);

        let query = `?page=${currentPage - 1}&limit=${cardsPerPage}`;
        query += search === "" ? "" : `&search=${search}`;
        query += categoria === "" ? "" : `&categoria=${categoria}`;
        query += local === "" ? "" : `&localizacao=${local}`;
        query += data === "" ? "" : `&sortOrder=${data}`;
        userRole === 'user' ? query += `&registeredBy=${username}` : query += `&registeredBy=${registeredByFilter}`;


        await axios.get(`${backendURL}/get-ocorrencia${query}`)
            .then((response) => {
                setOcorrencias(response.data.ocorrencia);
                setNumberOfOcorrencias(response.data.numberOfOcorrencias);
                setLoading(false)

            })
    }

    const setFilters = (toSetOrdem, toSetCategoria, toSetLocal, toSetRegisteredBy) => {
        if (data === tempData && categoria === tempCategoria && local === tempLocal && registeredByFilter === tempRegisteredBy) {
            toast({
                title: "Nenhum filtro para aplicar.",
                position: "bottom",
                status: "info",
                duration: 2000,
                isClosable: true,
            })
            return;
        }

        const filterPromise = new Promise((resolve, reject) => {
            setTimeout(() => resolve(200), 750)
        })

        setData(toSetOrdem);
        setCategoria(toSetCategoria);
        setLocal(toSetLocal);
        setHasFilters(true);
        setRegisteredByFilter(toSetRegisteredBy);

        toast.promise(filterPromise, {
            loading: { title: 'Aplicando filtros...' },
            success: { title: 'Filtros aplicados!' },
            error: { title: 'Erro ao aplicar filtros' },
        });


    }

    const DeleteOcorrencia = (id) => {
        Swal.fire({
            title: 'Você tem certeza?',
            text: "Essa ação não pode ser revertida!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: 'black',
            confirmButtonText: 'Deletar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Deletado!',
                    text: 'Ocorrência deletada com sucesso.',
                    icon: 'success',
                    confirmButtonColor: 'green'
                }
                )
                axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-ocorrencia/${id}`)
                    .then(res => {
                        getOcorrencias()
                    })
            }
        })
    }


    return (
        <>
            <div className='h-screen items-center bg-[#F2F2F2] relative'>
                <NavbarHome />
                <div className='w-full text-center pt-11 pb-8'>
                    <label className='text-3xl font-semibold'>
                        Histórico de Ocorrência
                    </label>
                </div>

                <div className='w-full flex sm:flex-row flex-col-reverse gap-2 justify-between px-[32px] sm:px-[128px]'>
                    <div className='w-full md:w-[20%] items-center' >
                        <motion.button className='py-2 w-full bg-[#00151F] text-white rounded-[3px]' >
                            <Link to='/home/reg-ocorrencia'>
                                Registrar ocorrência
                            </Link>
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
                        <motion.button onClick={onOpen}>
                            <TbAdjustmentsHorizontal className='w-8 h-8 stroke-1 text-black' />
                        </motion.button>
                        {/* <motion.button title={gridView ? 'Ver em Lista' : 'Ver em Grade'} onClick={() => setGridView(!gridView)} >
                            {gridView ?
                                <CiViewList className='w-8 h-8 text-black' />
                                :
                                <CiGrid41 className='w-8 h-8 text-black' />
                            }
                        </motion.button> */}
                    </div>
                </div>
                <div className='px-8 md:px-32 mt-auto overflow-clip'>
                    {
                        loading ?
                            <div className="flex justify-center items-center h-full">
                                <Spinner size="md" />
                            </div>
                            :
                            <FilterContext.Provider value={{ data, categoria, local, registeredByFilter, hasFilters, numberOfOcorrencias, curPage, loading, setLoading }}>
                                <Cards ocorrencias={ocorrencias} gridView={gridView} getOcorrencias={getOcorrencias} DeleteOcorrencia={DeleteOcorrencia} />
                            </FilterContext.Provider>
                    }
                </div>
                <div>
                    <div className='absolute py-3 bottom-0 w-full flex justify-center'>
                        <PaginationComponent curPage={curPage} setCurPage={setCurPage} cardsPerPage={cardsPerPage} numberOfOcorrencias={numberOfOcorrencias} />
                    </div>
                </div>
            </div >

            <Modal isCentered={true} isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Filtrar
                        <div className='border mt-2 w-full' />
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className='flex py-2 px-2 gap-2'>
                            <motion.button className={tempData === -1 ? 'bg-black text-white px-3 py-2 rounded-md' : 'px-3 py-2 font-semibold'} onClick={() => setTempData(-1)}>
                                Mais recente
                            </motion.button>
                            <motion.button className={tempData === 1 ? 'bg-black text-white px-3 py-2 rounded-md' : 'px-3 py-2 font-semibold'} onClick={() => setTempData(1)}>
                                Mais antiga
                            </motion.button>
                        </div>

                        <div className='flex flex-col'>
                            <div className='py-1'>
                                <div className='flex font-semibold flex-row justify-between'>
                                    Categoria:
                                </div>
                                <div>
                                    <InputGroup>
                                        <Input type="text" list='categoria' value={tempCategoria === '' ? '' : tempCategoria} placeholder="Filtrar por categoria" aria-label="Filtrar por categoria" onChange={(e) => setTempCategoria(e.target.value)} />
                                    </InputGroup>
                                    <datalist id='categoria'>
                                        {categorias.map((categoria) => <option value={categoria}>{categoria}</option>)}
                                    </datalist>
                                </div>
                            </div>
                            <div className='py-1'>
                                <div className='flex font-semibold flex-row justify-between'>
                                    Local:
                                </div>
                                <div className='py-1'>
                                    <InputGroup>
                                        <Input type="text" list='local' value={tempLocal === "" ? '' : tempLocal} placeholder="Filtrar por local" aria-label="Filtrar por local" maxLength={40} onChange={(e) => setTempLocal(e.target.value)} />
                                        <datalist id='local'>
                                            {locais.map((local) => <option value={local}>{local}</option>)}
                                        </datalist>
                                    </InputGroup>
                                </div>
                            </div>

                            <div className='py-1'>
                                <div className='flex font-semibold flex-row justify-between'>
                                    Registrado por:
                                </div>
                                <div className='py-1'>
                                    <InputGroup>
                                        <Input type="text" value={tempRegisteredBy === "" ? '' : tempRegisteredBy} placeholder="Filtrar por quem registrou" aria-label="Filtrar por quem registrou" onChange={(e) => setTempRegisteredBy(e.target.value)} />
                                    </InputGroup>
                                </div>
                            </div>
                        </div>


                    </ModalBody>

                    <ModalFooter>
                        <div className='flex w-full justify-between items-center'>
                            <motion.button className='bg-black px-10 py-2 text-white rounded-md' onClick={() => setFilters(tempData, tempCategoria, tempLocal, tempRegisteredBy)}>
                                Filtrar
                            </motion.button>
                            <motion.button className='font-semibold' onClick={() => clearFilters()} >
                                Limpar filtros
                            </motion.button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </>
    );
}

export default VerOcorrencia;
