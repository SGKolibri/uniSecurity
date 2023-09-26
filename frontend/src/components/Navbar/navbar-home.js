import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { BiShieldQuarter } from '@react-icons/all-files/bi/BiShieldQuarter';
import base64 from "react-native-base64";
import Image from 'react-bootstrap/Image';

function NavbarHome({ opacity1, opacity2 }) {

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
            return <Image src={googleUserImage} alt="" onClick={logOut} roundedCircle />

        let url = base64ImageFormat;
        if (base64ImageFormat.indexOf("data:image/svg;base64,") > -1) {
            let decodedSvg = base64.decode(
                base64ImageFormat.replace("data:image/svg;base64,", "")
            );
            let blob = new Blob([decodedSvg], { type: "image/svg+xml" });
            url = URL.createObjectURL(blob);
        }
        return <Image src={url} alt={`${appTitle}`} onClick={logOut} />;
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top"
                style={{
                    display: 'flex',
                    backgroundColor: '#0850BC'
                }}
            >
                <div className="container">
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

                    {/* UserName */}
                    <div
                        style={{
                            float: "right",
                            marginLeft: "1%",
                            color: "#fff",
                            opacity: "1"
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
                        marginLeft: "1%"

                    }}
                        className="userWrapper"
                    >
                        {ConvertToImageFormat(userImage, "user")}
                    </div>
                </div>
            </nav >
        </>
    )
}

export default NavbarHome