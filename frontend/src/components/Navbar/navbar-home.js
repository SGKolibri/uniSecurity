import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { BiShieldQuarter } from '@react-icons/all-files/bi/BiShieldQuarter';
import base64 from "react-native-base64";
import Image from 'react-bootstrap/Image';
import useWindowDimensions from '../Utils/getWindowDimensions'
import { ImExit } from '@react-icons/all-files/im/ImExit'
import { FaBars } from '@react-icons/all-files/fa/FaBars'
import { IconContext } from "@react-icons/all-files/lib";
import Sidebar from './sidebar'
import { AiTwotoneEdit } from '@react-icons/all-files/ai/AiTwotoneEdit'
import { AiOutlineEye } from '@react-icons/all-files/ai/AiOutlineEye'
import { AiOutlineClose } from '@react-icons/all-files/ai/AiOutlineClose'

function NavbarHome({ opacity1, opacity2 }) {

    // User Sidebard
    const [isOpen, setIsOpen] = useState(false);

    const showSideBar = () => {
        console.log("showSideBar");
        console.log(isOpen);
        setIsOpen(!isOpen)
    };


    const { width } = useWindowDimensions();

    const signOut = useSignOut();
    const navigate = useNavigate();

    const curUserName = localStorage.getItem('userName') !== null ? localStorage.getItem('userName') + " " + localStorage.getItem('userSurname') : localStorage.getItem('userGoogleName');
    const userImage = localStorage.getItem('userImage');

    const googleUserImage = localStorage.getItem('userGoogleImage');

    const logOut = () => {
        //clear local storage
        localStorage.clear();
        signOut();
        navigate('/login');
    }

    //decode image from base64 to svg
    function ConvertToImageFormat(base64ImageFormat, appTitle) {

        if (base64ImageFormat === null || base64ImageFormat === undefined)
            return <Image src={googleUserImage} alt="" roundedCircle />

        let url = base64ImageFormat;
        if (base64ImageFormat.indexOf("data:image/svg;base64,") > -1) {
            let decodedSvg = base64.decode(
                base64ImageFormat.replace("data:image/svg;base64,", "")
            );
            let blob = new Blob([decodedSvg], { type: "image/svg+xml" });
            url = URL.createObjectURL(blob);
        }
        return <Image src={url} alt={`${appTitle}`} />;
    }

    return (
        <>
            {width > 992 ? (
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
                                            opacity: opacity1
                                        }}
                                    >
                                        Registrar Ocorrência
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to={'/home/ver-ocorrencia'}
                                        style={{
                                            color: '#fff',
                                            opacity: opacity2
                                        }}
                                    >
                                        Ver Ocorrência
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* UserDetails */}
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
                                {curUserName}
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
                                {ConvertToImageFormat(userImage, "user")}

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
                <IconContext.Provider value={{ color: '#fff' }}>
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
                                    width: "50%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
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
                                    onClick={showSideBar}
                                />
                                <div>
                                    {isOpen ? (
                                        <Sidebar showSideBar={showSideBar}>
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    left: "25px",
                                                }}
                                            >
                                                <AiOutlineClose
                                                    onClick={showSideBar}
                                                    style={{
                                                        width: "26px",
                                                        height: "26px",
                                                        float: "left",
                                                        cursor: "Pointer",
                                                        alignContent: "start",
                                                        alignItems: "start"
                                                    }}
                                                />
                                            </div>
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
                                                            maxWidth: "40px",
                                                            marginRight: "5%"
                                                        }}
                                                    >
                                                        {ConvertToImageFormat(userImage, "user")}
                                                    </div>
                                                    <div
                                                        style={{
                                                            float: "right",
                                                            marginLeft: "1%",
                                                            color: "#fff"
                                                        }}
                                                    >
                                                        {curUserName}
                                                    </div>
                                                </div>
                                                <hr
                                                    style={{
                                                        width: "100%",
                                                        color: "#fff",
                                                        opacity: "1",
                                                    }}
                                                />
                                            </ul>
                                            <ul className="navbar-nav ml-auto" >
                                                <li className="nav-item">
                                                    <Link className="nav-link" to={'/home/reg-ocorrencia'}
                                                        style={{
                                                            color: '#fff',
                                                            opacity: opacity1,
                                                            display: 'flex',
                                                        }}
                                                    >
                                                        <AiTwotoneEdit style={{ width: "26px", height: "26px" }} />
                                                        Registrar Ocorrência
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link className="nav-link" to={'/home/ver-ocorrencia'}
                                                        style={{
                                                            color: '#fff',
                                                            opacity: opacity2,
                                                            display: 'flex',
                                                        }}
                                                    >
                                                        <AiOutlineEye style={{ width: "26px", height: "26px" }} />
                                                        Ver Ocorrência
                                                    </Link>
                                                </li>
                                            </ul>
                                        </Sidebar>
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </nav >
                </IconContext.Provider>
            )
            }

        </>
    )
}

export default NavbarHome