import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { BiShieldQuarter } from '@react-icons/all-files/bi/BiShieldQuarter';
import base64 from "react-native-base64";
import Image from 'react-bootstrap/Image';
import useWindowDimensions from '../Utils/getWindowDimensions'
import { ImExit } from "react-icons/im";
import { FaBars } from '@react-icons/all-files/fa/FaBars'
import { AiTwotoneEdit } from '@react-icons/all-files/ai/AiTwotoneEdit'
import { AiOutlineEye } from '@react-icons/all-files/ai/AiOutlineEye'
import { useDisclosure } from "@chakra-ui/react";
import { AiOutlineUser } from '@react-icons/all-files/ai/AiOutlineUser'
import { useLocation } from "react-router-dom";
import DrawerSidebar from "./drawer-sidebar";
import axios from "axios";
import { useAuthUser } from 'react-auth-kit';
import { user } from "@nextui-org/react";

function NavbarHome() {

    const authUser = useAuthUser();

    const { width } = useWindowDimensions();
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
    const btnRef = React.useRef();

    function ConvertToImageFormat(base64ImageFormat, appTitle) {
        let url = base64ImageFormat;
        if (base64ImageFormat.indexOf("data:image/svg;base64,") > -1) {
            let decodedSvg = base64.decode(
                base64ImageFormat.replace("data:image/svg;base64,", "")
            );
            let blob = new Blob([decodedSvg], { type: "image/svg+xml" });
            url = URL.createObjectURL(blob);
        }
        return <Image src={url} alt={`${appTitle}`} className="w-14 h-14 md:w-10 md:h-10 rounded-full" />;
    };

    return (
        <>
            <nav className="flex w-full py-2.5 justify-between items-center bg-[#00151F]" >
                <div className="flex">
                    <div className="flex md:hidden pl-6 md:pl-0 items-center gap-1 text-lg">
                        <FaBars className="mr-4 cursor-pointer text-white w-7 h-7 lg:w-12 lg:h-12" onClick={onOpen} />
                    </div>
                    <div className="flex items-center gap-1 text-lg justify-end md:justify-start pl-0 md:pl-24 w-full">
                        <Link className="text-white block" to={'/home/ver-ocorrencia'}>
                            <BiShieldQuarter className="w-12 h-12 sm:w-10 sm:h-10" />
                        </Link>
                        <Link className="navbar-brand text-white hidden md:block" to={'/home/ver-ocorrencia'}>
                            Uni
                            <b>Security</b>
                        </Link>
                    </div>
                </div>
                <div className="w-full pl-20 items-center text-white hidden md:flex">
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

                <div className="md:flex pr-36 hidden text-white items-center text-lg gap-2">
                    {userImage && userImage === "" ?
                        <AiOutlineUser className="w-10 h-10" /> : userImage
                    }
                    <div className="flex flex-col px-5">
                        <label className="text-lg">
                            {userName}
                        </label>
                        <label className="text-xs pl-1">
                            {userRole === "root" ? "Guarda Chefe" : "Guarda"}
                        </label>
                    </div>
                    <div className="px-4">
                        <ImExit className="w-7 h-7" onClick={logOut} />
                    </div>
                </div>

                <div className="flex items-center justify-between lg:hidden">
                    <DrawerSidebar isOpen={isOpen} onClose={onClose} btnRef={btnRef}>
                        <ul className="navbar-nav ml-auto">
                            <div className="flex items-center justify-start pr-6">
                                <div className="pt-3 mr-[5%] flex items-center gap-3">
                                    {userImage && userImage === "" ?
                                        <AiOutlineUser className="w-10 h-10" /> : userImage
                                    }
                                    <label className="text-[#ddd]">
                                        Luana Cano Morais
                                    </label>
                                </div>
                                <div className="text-white ml-1 mt-3 text-3xl">
                                    {userName}
                                </div>
                            </div>
                        </ul>
                        <hr className=" border-1" />
                        <ul className="h-[88%] navbar-nav mt-10 text-2xl gap-6">
                            <a href='/home/reg-ocorrencia' className="flex" onClick={onClose} style={{ opacity: location.pathname === '/home/reg-ocorrencia' ? 1 : 0.5 }}>
                                <AiTwotoneEdit className="mr-3 w-8 h-8" />
                                Registrar Ocorrência
                            </a>
                            <a href='/home/ver-ocorrencia' className="flex" onClick={onClose} style={{ opacity: location.pathname === '/home/ver-ocorrencia' ? 1 : 0.5 }}>
                                <AiOutlineEye className="mr-3 w-8 h-8" />
                                Ver Ocorrência
                            </a>
                            <li className="flex mt-auto nav-item">
                                <div className="text-white flex" onClick={logOut} >
                                    <ImExit className="mr-3 w-8 h-8 mb-10" onClick={logOut} />
                                    Sair
                                </div>
                            </li>
                        </ul>
                    </DrawerSidebar>
                </div>
            </nav >
        </>
    )
}

export default NavbarHome