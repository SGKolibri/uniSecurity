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

                </div>
            </div>
        </>
    )

}