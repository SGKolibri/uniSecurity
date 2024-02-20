import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Select, Button, Input, useDisclosure, useToast } from '@chakra-ui/react';
import { TbAdjustmentsHorizontal } from 'react-icons/tb';
import { AiOutlineEdit } from "react-icons/ai";
import { TbSelect } from "react-icons/tb";
import { categorias } from '../../components/Ocorrencia/categorias';
import { locais } from '../../components/Ocorrencia/locais';
import { FilterContext } from '../../components/Context/filter-context';
import Cards from '../../components/Ocorrencia/cards';
import useWindowDimensions from '../../components/Utils/getWindowDimensions';
import axios from 'axios';
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";

const PaginationComponent = ({ curPage, setCurPage, cardsPerPage, numberOfOcorrencias }) => {
    const [pageNumbers, setPageNumbers] = useState([]);

    useEffect(() => {
        const getPageNumbers = async () => {
            const pageNumbers = [];
            for (let i = 1; i <= Math.ceil(numberOfOcorrencias / cardsPerPage); i++) {
                pageNumbers.push(i);
            }
            setPageNumbers(pageNumbers);
        }
        getPageNumbers()
    }, [numberOfOcorrencias, cardsPerPage]);

    return (
        <>
            <motion.button className='pl-4' onClick={() => { if (curPage > 1) { setCurPage(curPage - 1) } console.log(curPage) }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} disabled={curPage === 1}
            >
                <FaAngleLeft className='w-6 h-6 text-gray-600' />
            </motion.button>
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    className={`${curPage === number
                        ? 'bg-blue-400 text-white hover:bg-blue-800'
                        : 'bg-white text-blue-400 hover:bg-blue-800'
                        } font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                    onClick={() => setCurPage(number)}
                >
                    {number}
                </button>
            ))}
            <motion.button className='pr-4' onClick={() => { if (curPage < pageNumbers.length) { setCurPage(curPage + 1) } console.log(curPage) }}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={curPage === pageNumbers.length}
            >
                <FaAngleRight className='w-6 h-6 text-gray-600' />
            </motion.button>
        </>
    );
}



function VerOcorrencia() {

    const backendURL = process.env.REACT_APP_BACKEND_URL;

    const { width } = useWindowDimensions();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();
    const toast = useToast();

    const [curPage, setCurPage] = useState(1)
    const [search, setSearch] = useState('');
    const [data, setData] = useState(1); // -1 = mais antiga, 1 = mais recente
    const [categoria, setCategoria] = useState('');
    const [local, setLocal] = useState('');
    const [registeredBy, setRegisteredBy] = useState('');
    const [hasFilters, setHasFilters] = useState(false);
    const [outraCategoria, setOutraCategoria] = useState(false);
    const [outraLocalizacao, setOutraLocalizacao] = useState(false);
    const [numberOfOcorrencias, setNumberOfOcorrencias] = useState(0);
    const [cardsPerPage, setCardsPerPage] = useState(8);

    const changeCategorias = () => {
        setOutraCategoria(!outraCategoria);
        setCategoria('');
    }
    const changeLocalizacao = () => {
        setOutraLocalizacao(!outraLocalizacao);
        setLocal('');
    }

    const clearFilters = () => {
        setHasFilters(false);
        ['Select', 'Input'].forEach((type) => document.querySelectorAll(type).forEach((input) => (input.value = '')));
        setSearch('');
        setCategoria('');
        setLocal('');
        setRegisteredBy('');
        setData(1);

        const filterPromise = new Promise((resolve, reject) => {
            setTimeout(() => resolve(200), 1500)
        })

        toast.promise(filterPromise, {
            loading: { title: 'Removendo filtros...' },
            success: { title: 'Filtros removidos!' },
            error: { title: 'Erro ao remover filtros' },
        });
        setHasFilters(false);
    };

    useEffect(() => {
        const getTotalOfOcorrencias = async () => {
            const response = await axios.get(`${backendURL}/get-total-ocorrencias`)
            setNumberOfOcorrencias(response.data.length)
        }
        if (width < 1400 && width > 1101) setCardsPerPage(6);
        if (width < 1100 && width > 768) setCardsPerPage(4);
        if (width < 768 || width > 1401) setCardsPerPage(8);

        getTotalOfOcorrencias()
    }, [backendURL, width])






    return (
        <>
            <div className='flex place-content-center justify-center w-full h-screen bg-slate-100'>
                <div className="w-11/12 mt-16 sm:mt-[4.5%] rounded-xl shadow-lg bg-white px-8">
                    <h1 className="mt-4 sm:mb-8  md:text-gray-800 md:text-3xl sm:text-right text-center">
                        Histórico de Ocorrência
                    </h1>

                    <div className='w-full mt-3 sm:mt-5 flex flex-col-reverse sm:flex-row justify-around items-center '>
                        <div className='w-full mt-2 sm:mt-0 sm:w-1/6 sm:mr-auto rounded-lg shadow '>
                            <Button leftIcon={<TbAdjustmentsHorizontal className='w-5 h-5' />} className='w-full h-full sm:3/6' ref={btnRef} colorScheme="blue" onClick={onOpen}>
                                Filtrar ocorrências
                            </Button>
                        </div>
                        <div className='w-full  sm:w-[25%] mt-auto sm:ml-auto rounded-lg shadow'>
                            <Input type="text" className='h-full' placeholder="Pesquisar ocorrência" onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>

                    {/* Rectangle with inner shadow and margin and padding from all sides */}
                    <div className='w-full place-content-evenly h-4/6 bg-gray-100 pt-2 pl-8 mt-4 sm:mt-2 rounded-lg grid grid-cols-1 sm:grid-cols-2 custom11:grid-cols-2 lg:grid-cols-3 custom14:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 grid-rows-2' style={{ boxShadow: "inset 0px 0px 5px 0px rgba(0,0,0,0.5)", }}>
                        <FilterContext.Provider value={{ data, categoria, local, registeredBy, hasFilters, numberOfOcorrencias }}>
                            <Cards search={search} curPage={curPage} setCurPage={setCurPage} cardsPerPage={cardsPerPage} />
                        </FilterContext.Provider>
                    </div>
                    <div
                        className='flex place-content-center justify-center w-full'
                    >
                        {PaginationComponent({ curPage, setCurPage, cardsPerPage, numberOfOcorrencias })}
                    </div>
                </div >
            </div >
            <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Filtrar por:</DrawerHeader>
                    <DrawerBody>
                        <Button colorScheme={data === 0 ? 'blue' : 'gray'} onClick={() => setData(0)} style={{ marginLeft: '1%', marginRight: '1%' }}>
                            Mais antiga
                        </Button>
                        <Button colorScheme={data === 1 ? 'blue' : 'gray'} onClick={() => setData(1)}>
                            Mais recente
                        </Button>
                        <hr />
                        Nome da Ocorrência:
                        <Input type="text" placeholder="Filtrar por nome" aria-label="Filtrar por nome" onChange={(e) => setSearch(e.target.value)} />

                        Categoria:
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
                                marginTop: "-1.5%",
                                right: "8%",
                            }}
                            onClick={() => changeCategorias()}
                        >
                            {outraCategoria ?
                                <TbSelect style={{
                                    width:
                                        '29px', height: '29px'
                                }} />
                                :
                                <AiOutlineEdit style={{ width: '30px', height: '30px' }} />
                            }
                        </motion.button>
                        {outraCategoria ? (
                            <Input type="text" placeholder="Filtrar por categoria" aria-label="Filtrar por categoria" onChange={(e) => setCategoria(e.target.value)} />
                        ) : (
                            <Select type="text" placeholder="Filtrar por categoria" aria-label="Filtrar por categoria" onChange={(e) => setCategoria(e.target.value)}>
                                {categorias.map((categoria) => (
                                    <option value={categoria} key={categoria}>
                                        {categoria}
                                    </option>
                                ))}
                            </Select>
                        )}
                        <div className="local-space-between">
                            Local:
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
                                    marginTop: "-1.5%",
                                    right: "8%",

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
                                    <Input type="text" placeholder="Filtrar por local" aria-label="Filtrar por local" maxLength={40} onChange={(e) => setLocal(e.target.value)} />
                                    :
                                    <Select type="text" placeholder="Filtrar por local" aria-label="Filtrar por local" onChange={(e) => setLocal(e.target.value)}>
                                        {locais.map((local) => {
                                            return (
                                                <option value={local}>{local}</option>
                                            )
                                        })}
                                    </Select>
                            }

                        </div>
                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={() => clearFilters()}>
                            Limpar filtros
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default VerOcorrencia;
