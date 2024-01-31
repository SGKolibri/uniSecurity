import React, { useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { Spinner, Input, Button } from '@chakra-ui/react'
import SignUp from "../../components/Guarda/guarda-register"
import GuardaTable from "../../components/Guarda/guarda-table"
import useWindowDimensions from "../../components/Utils/getWindowDimensions"
import { motion } from "framer-motion"
import axios from "axios"

export default function GuardaPage() {

    let backendURL = process.env.REACT_APP_BACKEND_URL;

    const { width } = useWindowDimensions();
    const mobile = width < 992;
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [inputTimeout, setInputTimeout] = useState(null);

    const [search, setSearch] = useState('');
    const [guardas, setGuardas] = useState([]);
    const [curPage, setCurPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const guardaPerPage = 7;

    useEffect(() => {
        axios.get(`${backendURL}/get-users?page=${curPage - 1}&limit=${guardaPerPage}&search=${search}`).then((response) => {
            setTotalPages(Math.ceil(response.data.usersLength / guardaPerPage))
            setGuardas(response.data.users)
        }).then(() => {
            setLoading(false);
        })
    }, [backendURL, curPage, guardaPerPage, search])

    const PaginationComponent = () => {
        return (
            <>
                <motion.button
                    whileHover={{
                        backgroundColor: "#E8E8E8",
                        borderRadius: "25%",
                    }}
                    whileTap={{
                        backgroundColor: "#E8E8E8",
                        borderRadius: "50%",
                    }}
                    style={{
                        height: mobile ? '35%' : '50%',
                        marginRight: mobile ? '3%' : '2%'
                    }}
                    onClick={() => {
                        if (inputTimeout) clearTimeout(inputTimeout);
                        setInputTimeout(setTimeout(() => {
                            curPage - 1 < 1 ? setCurPage(1) : setCurPage(curPage - 1)
                        }, 250));
                    }}
                >
                    <svg width={mobile ? "40px" : "20px"} height={mobile ? "40px" : "20px"} viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" fill="#000000" /></svg>
                </motion.button>
                <Input
                    type="number"
                    className="form-control"
                    placeholder={curPage}
                    style={{
                        position: 'relative',
                        width: mobile ? '15%' : '4%',
                        height: '40%',
                        top: mobile ? '-2%' : '1%',
                        borderRadius: '5px',
                        marginLeft: '0.5%',
                        marginRight: '0.5%',
                        boxShadow: '2px 2px 5px 0px rgba(0,0,0,0.3)',
                        fontSize: mobile ? '1.5rem' : '1.2rem',
                    }}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (inputTimeout) clearTimeout(inputTimeout);
                        setInputTimeout(setTimeout(() => {
                            if (value > totalPages) {
                                setCurPage(totalPages)
                            } else if (value < 1) {
                                setCurPage(1)
                            } else {
                                setCurPage(value)
                            }
                        }, 500)); // 500ms delay
                    }}
                />
                <h
                    style={{ fontSize: mobile ? '1.5rem' : '1rem', marginTop: mobile ? '-1.5%' : '0', marginLeft: mobile ? '2%' : '0%' }}
                >
                    / {totalPages}
                </h>
                <motion.button
                    whileHover={{
                        backgroundColor: "#E8E8E8",
                        borderRadius: "25%",
                    }}
                    whileTap={{
                        backgroundColor: "#E8E8E8",
                        borderRadius: "50%",
                    }}
                    style={{
                        height: mobile ? '35%' : '50%',
                        marginLeft: mobile ? '3%' : '2%'
                    }}
                    onClick={() => {
                        if (inputTimeout) clearTimeout(inputTimeout);
                        setInputTimeout(setTimeout(() => {
                            curPage + 1 > totalPages ? setCurPage(totalPages) : setCurPage(curPage + 1)
                        }, 250));
                    }}
                >
                    <svg width={mobile ? "40px" : "20px"} height={mobile ? "40px" : "20px"} viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z" fill="#000000" /></svg>
                </motion.button>
            </>
        )
    }

    return (
        <>
            <div className='flex place-content-center justify-center w-full h-screen bg-slate-100'>
                <div className="w-11/12 mt-16 sm:mt-[4.5%] rounded-xl shadow-lg bg-white px-8">
                    {/* Page Title */}
                    <h1 className="mt-4 sm:mb-8  md:text-gray-800 md:text-3xl sm:text-right text-center">
                        Tabela de Guardas
                    </h1>

                    {/* Register Guard Button */}
                    <div className='w-full mt-3 sm:mt-5 flex flex-col-reverse sm:flex-row justify-around items-center '>
                        <div className='w-full mt-2 sm:mt-0 sm:w-1/6 sm:mr-auto rounded-lg shadow '>
                            <Button className='w-full h-full sm:3/6' colorScheme="blue" onClick={handleShow}>
                                Filtrar ocorrências
                            </Button>
                        </div>
                        <div className='w-full  sm:w-[25%] mt-auto sm:ml-auto rounded-lg shadow'>
                            <Input type="text" className='h-full' placeholder="Pesquisar ocorrência" onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Registrar guarda</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <SignUp />
                        </Modal.Body>
                    </Modal>

                    {/* Guard Table */}
                    <div className='w-full place-content-evenly h-4/6 bg-gray-100 md:pt-2 md:pl-8 mt-4 sm:mt-2 rounded-lg grid grid-cols-1 grid-rows-1' style={{ boxShadow: "inset 0px 0px 5px 0px rgba(0,0,0,0.5)", }}>
                        {loading ?
                            <div className="flex justify-center items-center h-full">
                                <Spinner size="md" />
                            </div>
                            : <GuardaTable guardas={guardas} />}
                    </div>

                    {/* Page Input */}
                    <div className={`${mobile ? 'w-full h-10 mt-12 flex justify-center' : 'w-full h-10 mt-2 flex justify-center'}`}>
                        <PaginationComponent />
                    </div>
                </div>
            </div>
        </>
    )

}