import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { BiShieldQuarter } from '@react-icons/all-files/bi/BiShieldQuarter';
import base64 from "react-native-base64";
import Image from 'react-bootstrap/Image';
import useWindowDimensions from '../Utils/getWindowDimensions'
import { ImExit } from '@react-icons/all-files/im/ImExit'
import { FaBars } from '@react-icons/all-files/fa/FaBars'
import { IconContext } from "@react-icons/all-files/lib";
import { AiTwotoneEdit } from '@react-icons/all-files/ai/AiTwotoneEdit'
import { AiOutlineEye } from '@react-icons/all-files/ai/AiOutlineEye'
import { Modal, useDisclosure } from "@chakra-ui/react";
import { AiOutlineUser } from '@react-icons/all-files/ai/AiOutlineUser'
import { useLocation } from "react-router-dom";
import { FaShield } from "react-icons/fa6";
import DrawerSidebar from "./drawer-sidebar";
import axios from "axios";
import { useAuthUser } from 'react-auth-kit';

function NavbarHome() {

    const authUser = useAuthUser();

    const { width } = useWindowDimensions();
    const location = useLocation();
    const signOut = useSignOut();
    const navigate = useNavigate();

    const [userImage, setUserImage] = useState("");

    const userName = authUser().userDetail.name;

    useEffect(() => {
        async function getUserImage() {
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-user-image/${authUser().userDetail.email}`).then((response) => {
                setUserImage(ConvertToImageFormat(response.data.userImage, "user"));
            });
        }
        getUserImage();
    }, [authUser]);

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
        return <Image src={url} alt={`${appTitle}`} className="w-10 h-10" />;
    };

    const NavLink = ({ to, children, onClick }) => (
        <li className="nav-item whitespace-nowrap" style={{ opacity: location.pathname === to ? 1 : 0.5 }}>
            <Link className="nav-link text-white" to={to} onClick={onClick}>
                {children}
            </Link>
        </li>
    );

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top" style={{ backgroundColor: '#0850BC' }}>
                <div className="flex w-full flex-row items-center justify-start pl-6 sm:pl-24">
                    <Link className="text-white" to={'/home/ver-ocorrencia'}>
                        <BiShieldQuarter className="w-10 h-10 [sm: w-10 h-10]" />
                    </Link>
                    <Link className="navbar-brand text-white " to={'/home/ver-ocorrencia'}>
                        Uni
                        <b>Security</b>
                    </Link>
                    {width > 992 ?
                        <>
                            <div className=" text-white ml-12">
                                <ul className="navbar-nav ml-auto text-white grid-flow-row flex">
                                    <div className=" text-white ml-8">
                                        <ul className="navbar-nav gap-4 ml-autotext-white grid-flow-row flex">
                                            <li className="nav-item whitespace-nowrap" style={{ opacity: location.pathname === '/home/reg-ocorrencia' ? 1 : 0.5 }}>
                                                <Link to='/home/reg-ocorrencia' > Registrar Ocorrência </Link>
                                            </li>
                                            <li className="nav-item whitespace-nowrap" style={{ opacity: location.pathname === '/home/ver-ocorrencia' ? 1 : 0.5 }}>
                                                <Link to='/home/ver-ocorrencia'> Ver Ocorrência </Link>
                                            </li>
                                            {authUser().userDetail.role === "root" && <li className="nav-item whitespace-nowrap" style={{ opacity: location.pathname === '/home/guarda' ? 1 : 0.5 }}>
                                                <Link to='/home/guarda'> Guardas </Link>
                                            </li>}
                                            {/* <NavLink to='/home/reg-ocorrencia' > Registrar Ocorrência </NavLink>
                                            <NavLink to='/home/ver-ocorrencia'> Ver Ocorrência </NavLink>
                                            {authUser().userDetail.role === "root" && <NavLink to='/home/guarda'> Guardas </NavLink>} */}
                                        </ul>
                                    </div>
                                </ul>
                            </div>
                            <div className="w-full flex  flex-row justify-end mr-5">
                                <div className="flex  text-white text-xl items-center content-center">
                                    {userImage && userImage === "" ? <AiOutlineUser style={{
                                        width: "38px",
                                        height: "38px"
                                    }} /> : userImage
                                    }
                                    {userName}
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-end pr-24">
                                <ImExit className="mr-4 cursor-pointer text-white  w-6 h-6 [lg:w-12 h-12]" onClick={logOut} />
                            </div>
                        </> : <>
                            {/* Hamburger Button and Drawer Sidebar */}
                            <div className="flex w-full flex-row items-center justify-end pr-6">
                                <FaBars className="mr-4 cursor-pointer text-white  w-6 h-6 [lg:w-12 h-12]" onClick={onOpen} />
                                <DrawerSidebar isOpen={isOpen} onClose={onClose} btnRef={btnRef} >
                                    <ul className="navbar-nav ml-auto">
                                        <div className="flex w-full flex-row items-center justify-start pr-6">
                                            <div className="max-w-[60px] mt-[5%] mr-[5%]">
                                                {userImage && userImage === "" ? <AiOutlineUser style={{
                                                    width: "38px",
                                                    height: "38px"
                                                }} /> : userImage
                                                }
                                            </div>
                                            <div className="text-white float-right ml-1 mt-3 text-2xl">
                                                {userName}
                                            </div>
                                        </div>
                                    </ul>
                                    <ul className="h-[88%] navbar-nav mt-10 text-2xl gap-6">
                                        <a href='/home/reg-ocorrencia' className="flex" onClick={onClose} style={{ opacity: location.pathname === '/home/reg-ocorrencia' ? 1 : 0.5 }}>
                                            <AiTwotoneEdit className="mr-2 w-8 h-8" />
                                            Registrar Ocorrência
                                        </a>
                                        <a href='/home/ver-ocorrencia' className="flex" onClick={onClose} style={{ opacity: location.pathname === '/home/ver-ocorrencia' ? 1 : 0.5 }}>
                                            <AiOutlineEye className="mr-2 w-8 h-8" />
                                            Ver Ocorrência
                                        </a>
                                        <li className="flex mt-auto nav-item">
                                            <div className="text-white flex" onClick={logOut} >
                                                <ImExit className="mr-2 w-8 h-8" onClick={logOut} />
                                                Sair
                                            </div>
                                        </li>
                                    </ul>
                                </DrawerSidebar>
                            </div>
                        </>}
                </div>
            </nav>



            {/* {width > 992 ? (
                <nav className="navbar navbar-expand-lg navbar-light fixed-top"
                    style={{
                        display: 'flex',
                        backgroundColor: '#0850BC'
                    }}
                >
                    <div className="container">
                        <div
                            className="uniSecuritySlogan"
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "start",
                            }}
                        >
                            <Link to={'/home/ver-ocorrencia'} style={{ color: '#fff' }}>
                                <BiShieldQuarter
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                    }}
                                />
                            </Link>
                            <Link className="navbar-brand" to={'/home/ver-ocorrencia'}
                                style={{
                                    color: "#fff"
                                }}
                            >
                                Uni
                                <b>Security</b>
                            </Link>
                        </div>

                        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">

                            <ul className="navbar-nav ml-auto" >
                                <li className="nav-item">
                                    <Link className="nav-link" to={'/home/reg-ocorrencia'}
                                        style={{
                                            color: '#fff',
                                            opacity: location.pathname === '/home/reg-ocorrencia' ? 1 : 0.5
                                        }}
                                    >
                                        Registrar Ocorrência
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to={'/home/ver-ocorrencia'}
                                        style={{
                                            color: '#fff',
                                            opacity: location.pathname === '/home/ver-ocorrencia' ? 1 : 0.5
                                        }}
                                    >
                                        Ver Ocorrência
                                    </Link>
                                </li>
                                {userIsRoot &&
                                    <li className="nav-item">
                                        <Link className="nav-link" to={'/home/guarda'}
                                            style={{
                                                color: '#fff',
                                                opacity: location.pathname === '/home/guarda' ? 1 : 0.5
                                            }}
                                        >
                                            Guardas
                                        </Link>
                                    </li>
                                }

                            </ul>
                        </div>

                        <div
                            className="userDetails"
                            style={{
                                width: "50%",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "end",
                                color: "#fff",
                            }}
                        >
                            <div
                                style={{
                                    float: "right",
                                    marginLeft: "1%",
                                    color: "#fff"
                                }}
                            >
                                {userName}
                            </div>

                            <div style={{
                                float: "right",
                                height: "40px",
                                width: "40px",
                                maxHeight: "40px",
                                maxWidth: "40px",
                                marginLeft: "2%"
                            }}
                                className="userWrapper"
                            >
                                {userImage === "" ? <AiOutlineUser style={{
                                    width: "38px",
                                    height: "38px"
                                }} /> : ConvertToImageFormat(userImage, "user")}

                            </div>
                            <div
                                style={{
                                    marginLeft: "30px",
                                }}
                            >
                                <ImExit
                                    style={{
                                        width: "25px",
                                        height: "25px",
                                        cursor: "Pointer",
                                        alignContent: "end",
                                        alignItems: "end"
                                    }}

                                    onClick={logOut}
                                />
                            </div>
                        </div>
                    </div>
                </nav >
            ) : (
                <>
                    <IconContext.Provider value={{ color: '#fff' }}>
                        <nav className="navbar navbar-expand-lg navbar-light fixed-top"
                            style={{
                                backgroundColor: '#0850BC'
                            }}
                        >
                            <div className="container">
                                <div
                                    className="uniSecuritySlogan"
                                    style={{
                                        display: "flex"
                                    }}
                                >
                                    <Link to={'/home/ver-ocorrencia'} style={{ color: '#fff' }}>
                                        <BiShieldQuarter
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                            }}
                                        />
                                    </Link>
                                    <Link className="navbar-brand" to={'/home/ver-ocorrencia'}
                                        style={{
                                            color: "#fff"
                                        }}
                                    >
                                        Uni
                                        <b>Security</b>
                                    </Link>

                                </div>
                                <div
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "end",
                                    }}
                                >
                                    <FaBars
                                        style={{
                                            width: "40px",
                                            height: "25px",
                                        }}
                                        onClick={onOpen}
                                    />
                                    <DrawerSidebar isOpen={isOpen} onClose={onClose} btnRef={btnRef} >
                                        <ul className="navbar-nav ml-auto">
                                            <div style={{
                                                display: "flex",
                                                marginTop: "25px",
                                                marginBottom: "10px",
                                            }}
                                                className="userWrapper"
                                                color="#fff"
                                            >
                                                <div
                                                    style={{
                                                        maxWidth: "60px",
                                                        marginRight: "5%"
                                                    }}
                                                >
                                                    {userImage === "" ? <AiOutlineUser style={{
                                                        width: "38px",
                                                        height: "38px"
                                                    }} /> : ConvertToImageFormat(userImage, "user")}
                                                </div>
                                                <div
                                                    style={{
                                                        float: "right",
                                                        marginLeft: "1%",
                                                        marginTop: "3%",
                                                        color: "#fff",
                                                        fontSize: "24px",
                                                    }}
                                                >
                                                    {userName}
                                                </div>
                                            </div>
                                        </ul>
                                        <ul className="navbar-nav ml-auto"
                                            style={{ fontSize: "18px", marginTop: "10%" }}
                                        >

                                            <li className="nav-item">
                                                <Link className="nav-link" to={'/home/reg-ocorrencia'}
                                                    style={{
                                                        color: '#fff',
                                                        opacity: location.pathname === '/home/reg-ocorrencia' ? 1 : 0.5,
                                                        display: 'flex',
                                                    }}
                                                    onClick={() => { onClose() }}
                                                >
                                                    <AiTwotoneEdit style={{ width: "32px", height: "32px" }} />
                                                    Registrar Ocorrência
                                                </Link>
                                            </li>
                                            <li className="nav-item" style={{ marginTop: "5%", marginBottom: "5%" }}>
                                                <Link className="nav-link" to={'/home/ver-ocorrencia'}
                                                    style={{
                                                        color: '#fff',
                                                        opacity: location.pathname === '/home/ver-ocorrencia' ? 1 : 0.5,
                                                        display: 'flex',
                                                    }}
                                                    onClick={() => { onClose() }}
                                                >
                                                    <AiOutlineEye style={{ width: "32px", height: "32px" }} />
                                                    Ver Ocorrência
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <div
                                                    style={{
                                                        color: "#fff",
                                                        alignItems: "end",
                                                        marginTop: "3%",
                                                        marginLeft: "3%",
                                                        display: "flex",
                                                        bottom: "0",

                                                    }}
                                                    onClick={logOut}
                                                >
                                                    <ImExit
                                                        style={{
                                                            width: "32px",
                                                            height: "32px",
                                                            cursor: "Pointer",
                                                        }}

                                                        onClick={logOut}
                                                    />
                                                    <h
                                                        onClick={logOut}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        Sair
                                                    </h>
                                                </div>
                                            </li>
                                        </ul>
                                    </DrawerSidebar>
                                </div>
                            </div>
                        </nav >
                    </IconContext.Provider >
                </>
            )} */}
        </>
    )
}

export default NavbarHome