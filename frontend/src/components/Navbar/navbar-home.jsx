import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { BiShieldQuarter } from '@react-icons/all-files/bi/BiShieldQuarter';
import base64 from "react-native-base64";
import Image from 'react-bootstrap/Image';
import { FaBars } from '@react-icons/all-files/fa/FaBars'
import { AiOutlineUser } from '@react-icons/all-files/ai/AiOutlineUser'
import { useLocation } from "react-router-dom";
import DrawerSidebar from "./drawer-sidebar";
import axios from "axios";
import { useAuthUser } from 'react-auth-kit';
import SairIcon from '../../images/sair.png';
import GuardIcon from '../../images/chapeu-policial.png';
import OcorrenciasIcon from '../../images/ocorrencias.png';
import LapisIcon from '../../images/ferramenta-lapis.png';
import { motion } from 'framer-motion';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react';

function NavbarHome() {

    const authUser = useAuthUser();

    const location = useLocation();
    const signOut = useSignOut();
    const navigate = useNavigate();

    const [userImage, setUserImage] = useState("");

    const userName = authUser().userDetail.name;
    const userRole = authUser().userDetail.role;

    useEffect(() => {
        async function getUserImage() {
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-user-image/${authUser().userDetail.email}`).then((response) => {
                setUserImage(ConvertToImageFormat(response.data.userImage, "user"));
            });
        }
        getUserImage();
    }, []);

    const logOut = () => {
        localStorage.clear();
        signOut();
        navigate('/login');
    };

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenLogOut, onOpen: onOpenLogOut, onClose: onCloseLogOut } = useDisclosure();
    const btnRef = React.useRef();

    const btnLogOutRef = React.useRef()

    function ConvertToImageFormat(base64ImageFormat, appTitle) {
        let url = base64ImageFormat;
        if (base64ImageFormat.indexOf("data:image/svg;base64,") > -1) {
            let decodedSvg = base64.decode(
                base64ImageFormat.replace("data:image/svg;base64,", "")
            );
            let blob = new Blob([decodedSvg], { type: "image/svg+xml" });
            url = URL.createObjectURL(blob);
        }
        return <Image src={url} alt={`${appTitle}`} className="w-10 h-10 rounded-full" />;
    };

    return (
        <>
            <nav className="flex w-full py-2.5 items-center bg-[#00252f] md:bg-[#00151F]" >
                <div className="flex md:hidden w-full items-center px-6 justify-between">
                    <FaBars className="mr-4 cursor-pointer text-white w-7 h-7 lg:w-12 lg:h-12" onClick={onOpen} />
                    <div className="text-white text-2xl">
                        Uni
                        <b>Security</b>
                    </div>
                    {userImage && userImage === "" ?
                        <AiOutlineUser className="w-8 h-8" /> : userImage
                    }
                </div>
                <div className="flex">
                    <div className="flex items-center gap-1 text-lg justify-end md:justify-start pl-0 md:pl-24 w-full">
                        <Link className="text-white hidden md:block" to={'/home/ver-ocorrencia'}>
                            <BiShieldQuarter className="w-10 h-10" />
                        </Link>
                        <Link className="navbar-brand text-white hidden md:block" to={'/home/ver-ocorrencia'}>
                            Uni
                            <b>Security</b>
                        </Link>
                    </div>
                </div>

                <div className="w-full pl-6 lg:pl-20 items-center text-white hidden md:flex text-md md:text-md">
                    <ul className="navbar-nav flex flex-row gap-5">
                        <li className={`${location.pathname === '/home/reg-ocorrencia' ? 'opacity-100' : 'opacity-50'}`}>
                            <Link to='/home/reg-ocorrencia'> Registrar Ocorrência </Link>
                        </li>
                        <li className={`${location.pathname === '/home/ver-ocorrencia' ? 'opacity-100' : 'opacity-50'}`}>
                            <Link to='/home/ver-ocorrencia'> Ver Ocorrência </Link>
                        </li>
                        {userRole === "root" &&
                            <li className={`${location.pathname === '/home/guarda' ? 'opacity-100' : 'opacity-50'}`}>
                                <Link to='/home/guarda'> Guardas </Link>
                            </li>
                        }
                    </ul>
                </div>

                <div className="w-full pr-10 lg:pr-20 hidden md:flex md:flex-row items-center justify-end text-white ">
                    <div className="flex gap-2">
                        {userImage && userImage === "" ?
                            <AiOutlineUser className="w-8 h-8" /> : userImage
                        }
                        <div className="flex flex-col pr-5">
                            <label className="text-lg">
                                {userName}
                            </label>
                            <label className="text-xs pl-1">
                                {userRole === "root" ? "Guarda Chefe" : "Guarda"}
                            </label>
                        </div>
                    </div>
                    <div className="px-4">
                        <img src={SairIcon} alt="Sair Icon" className="w-6 h-6 cursor-pointer" onClick={onOpenLogOut} />
                    </div>
                </div>

                <div className="flex items-center justify-between sm:hidden">
                    <DrawerSidebar isOpen={isOpen} onClose={onClose} btnRef={btnRef}>
                        <div className="flex items-center pr-6 text-3xl mt-2 justify-center">
                            Uni<b>Security</b>
                        </div>
                        <hr className="border-1" />
                        <ul className="h-[88%] navbar-nav mt-10 text-lg gap-8">
                            <a href='/home/reg-ocorrencia' className="flex" onClick={onClose} style={{ opacity: location.pathname === '/home/reg-ocorrencia' ? 1 : 0.5 }}>
                                <img src={LapisIcon} alt="Lapis Icon" className="ml-1 mr-3 w-6 h-6" />
                                Registrar ocorrência
                            </a>
                            <a href='/home/ver-ocorrencia' className="flex" onClick={onClose} style={{ opacity: location.pathname === '/home/ver-ocorrencia' ? 1 : 0.5 }}>
                                <img src={OcorrenciasIcon} alt="Ocorrências Icon" className="mr-3 w-7 h-7" />
                                Todas as ocorrências
                            </a>
                            <a href='/home/guarda' className="flex" onClick={onClose} style={{ opacity: location.pathname === '/home/guarda' ? 1 : 0.5 }}>
                                <img src={GuardIcon} alt="Guard Icon" className="mr-3 w-7 h-7" />
                                Tabela de guardas
                            </a>
                            <li className="flex mt-auto nav-item w-full justify-end">
                                <div className="text-white flex" >
                                    <img src={SairIcon} alt="Sair Icon" className="w-7 h-7 mb-2 cursor-pointer" onClick={
                                        onOpenLogOut
                                    } />
                                </div>
                            </li>
                        </ul>
                    </DrawerSidebar>
                </div>
                <Modal isCentered={true} isOpen={isOpenLogOut} onClose={onCloseLogOut} >
                    <ModalOverlay />
                    <ModalContent style={{
                        backgroundColor: '#00252f',
                        color: '#fff'
                    }}>
                        <ModalCloseButton />
                        <ModalHeader>
                            <label className="text-[#D8D8D8] font-normal">
                                Tem certeza que deseja sair?
                            </label>
                        </ModalHeader>

                        <ModalFooter>
                            <div className="w-full flex justify-around font-light">
                                <motion.button ref={btnLogOutRef} onClick={onCloseLogOut}>
                                    <label className="no-underline hover:underline cursor-pointer">
                                        Não
                                    </label>
                                </motion.button>
                                <motion.button colorScheme="blue" mr={3} onClick={logOut}>
                                    <label className="no-underline hover:underline cursor-pointer">
                                        Sair
                                    </label>
                                </motion.button>
                            </div>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </nav >

        </>
    )
}

export default NavbarHome