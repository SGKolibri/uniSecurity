import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, useDisclosure, useToast, InputGroup, InputLeftElement, Spinner } from '@chakra-ui/react';
import { TbAdjustmentsHorizontal } from 'react-icons/tb';
import { categorias } from '../Utils/categorias';
import { locais } from '../Utils/locais';
import { FilterContext } from '../../components/Context/filter-context';
import Cards from '../../components/Ocorrencia/cards';
import axios from 'axios';
import { MdKeyboardArrowRight } from "react-icons/md";
import NavbarHome from '../Navbar/navbar-home';
import { CiViewList } from "react-icons/ci";
import { CiGrid41 } from "react-icons/ci";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link } from 'react-router-dom';

const PaginationComponent = ({ curPage, setCurPage, cardsPerPage, numberOfOcorrencias, loading }) => {

    const active = 'bg-[#666] text-white py-2 px-4 h-full'
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
            <div className='bg-white w-2/5 flex px-2 gap-2 rounded-lg text-[#505050] border-[#666] border-1 justify-center items-center' style={{ boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.25)' }}>
                {loading ?
                    <div>
                        <Spinner />
                    </ div>
                    :
                    <>
                        <div className='flex mr-auto'>
                            <motion.button onClick={() => { if (curPage > 1) { setCurPage(curPage - 1) } console.log(curPage) }} disabled={curPage === 1}>
                                <div className='flex py-2 items-center justify-center cursor-pointer'>
                                    <MdKeyboardArrowLeft className='w-6 h-6 ' />
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
                                <div className='flex py-2 items-center justify-center cursor-pointer'>
                                    <label>
                                        Próximo
                                    </label>
                                    <MdKeyboardArrowRight className='w-6 h-6' />
                                </div>
                            </motion.button>
                        </div>
                    </>
                }
            </div>


        </>
    );
}

function VerOcorrencia({ children }) {

    const backendURL = process.env.REACT_APP_BACKEND_URL;

    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();
    const toast = useToast();

    const [curPage, setCurPage] = useState(1)
    const [search, setSearch] = useState('');
    const [data, setData] = useState(-1); // -1 = mais recente, 1 = mais antiga
    const [tempData, setTempData] = useState(-1); // -1 = mais recente, 1 = mais antiga
    const [categoria, setCategoria] = useState('');
    const [tempCategoria, setTempCategoria] = useState('');
    const [local, setLocal] = useState('');
    const [tempLocal, setTempLocal] = useState('');

    const [registeredBy, setRegisteredBy] = useState('');

    const [hasFilters, setHasFilters] = useState(false);

    const [numberOfOcorrencias, setNumberOfOcorrencias] = useState(0);
    const [cardsPerPage, setCardsPerPage] = useState(8);
    const [loading, setLoading] = useState(true);
    const [gridView, setGridView] = useState(true); // true = grid, false = list
    const [ocorrencias, setOcorrencias] = useState();

    const clearFilters = () => {

        if (tempData === -1 && tempCategoria === '' && tempLocal === '') {
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
        setRegisteredBy('');
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

        if (gridView) {
            setCardsPerPage(8)
        } else {
            setCardsPerPage(10)
        }

        getOcorrencias()
    }, [gridView, categoria, local, registeredBy, data, hasFilters, curPage, search, backendURL, numberOfOcorrencias, setCurPage, cardsPerPage,]);

    const getOcorrencias = async () => {
        setLoading(true);

        let currentPage = search === "" ? curPage : 1;
        setCurPage(currentPage);

        let query = `?page=${currentPage - 1}&limit=${cardsPerPage}`;
        query += search === "" ? "" : `&search=${search}`;
        query += categoria === "" ? "" : `&categoria=${categoria}`;
        query += local === "" ? "" : `&localizacao=${local}`;
        query += registeredBy === "" ? "" : `&registeredBy=${registeredBy}`;
        query += data === "" ? "" : `&sortOrder=${data}`;


        await axios.get(`${backendURL}/get-ocorrencia${query}`)
            .then((response) => {
                setOcorrencias(response.data.ocorrencia);
                setNumberOfOcorrencias(response.data.numberOfOcorrencias);
                setLoading(false)

            })
            .catch((error) => {
                console.log(error)
            })
    }

    const setFilters = (toSetOrdem, toSetCategoria, toSetLocal) => {


        if (data === tempData && categoria === tempCategoria && local === tempLocal) {
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

        toast.promise(filterPromise, {
            loading: { title: 'Aplicando filtros...' },
            success: { title: 'Filtros aplicados!' },
            error: { title: 'Erro ao aplicar filtros' },
        });


    }

    return (
        <>
            <div className='w-full h-screen items-center bg-[#F2F2F2] relative'>
                <NavbarHome />
                <div className='w-full text-center pt-11 pb-8'>
                    <label className='text-3xl font-semibold'>
                        Histórico de Ocorrência
                    </label>
                </div>

                <div className='w-full flex flex-col-reverse gap-2 sm:flex-row justify-between sm:px-36 px-5'>
                    <div className='w-full md:w-[20%] items-center' >
                        <motion.button className='py-2 w-full bg-[#00151F] text-white rounded-md' >
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
                            <Input style={{ borderRadius: '0.75rem', borderWidth: '2px' }} className='border-black px-6 rounded-3xl' type="text" placeholder="Procurar ocorrência" onChange={(e) => setSearch(e.target.value)} />                        </InputGroup>
                        <motion.button onClick={onOpen}>
                            <TbAdjustmentsHorizontal className='w-8 h-8 stroke-1 text-black' />
                        </motion.button>
                        <motion.button title={gridView ? 'Ver em Lista' : 'Ver em Grade'} onClick={() => setGridView(!gridView)} >
                            {gridView ?
                                <CiViewList className='w-8 h-8 text-black' />
                                :
                                <CiGrid41 className='w-8 h-8 text-black' />
                            }
                        </motion.button>
                    </div>
                </div>

                <div className='px-8 lg:px-32 mt-auto '>
                    {
                        loading ?
                            <div className="flex justify-center items-center h-full">
                                <Spinner size="md" />
                            </div>
                            :
                            <FilterContext.Provider value={{ data, categoria, local, registeredBy, hasFilters, numberOfOcorrencias, curPage, loading, setLoading }}>
                                <Cards ocorrencias={ocorrencias} getOcorrencias={getOcorrencias} search={search} curPage={curPage} setCurPage={setCurPage} cardsPerPage={cardsPerPage} gridView={gridView} />
                            </FilterContext.Provider>
                    }
                </div>
                <div>
                    <div className='absolute py-3 bottom-0 w-full flex justify-center'>
                        <PaginationComponent curPage={curPage} setCurPage={setCurPage} cardsPerPage={cardsPerPage} numberOfOcorrencias={numberOfOcorrencias} />
                    </div>
                </div>
            </div >

            <Modal isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef}>
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

                        <div className='py-2 px-2'>
                            <div className='flex font-semibold flex-row justify-between'>
                                Categoria:

                            </div>
                            <div className='py-1'>
                                <InputGroup>
                                    <Input type="text" list='categoria' value={tempCategoria === '' ? '' : tempCategoria} placeholder="Filtrar por categoria" aria-label="Filtrar por categoria" onChange={(e) => setTempCategoria(e.target.value)} />
                                </InputGroup>
                                <datalist id='categoria'>
                                    {categorias.map((categoria) => <option value={categoria}>{categoria}</option>)}
                                </datalist>
                            </div>
                        </div>

                        <div className='px-2'>
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

                    </ModalBody>

                    <ModalFooter>
                        <div className='flex w-full justify-between items-center'>
                            <motion.button className='bg-black px-10 py-2 text-white rounded-md' onClick={() => setFilters(tempData, tempCategoria, tempLocal)}>
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
