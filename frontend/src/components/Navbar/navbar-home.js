import { React } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import UserDisplay from "../UserDisplay/user-display";
import { FaRegUserCircle } from '@react-icons/all-files/fa/FaRegUserCircle';
import { BiShieldQuarter } from '@react-icons/all-files/bi/BiShieldQuarter';

function NavbarHome({ opacity1, opacity2 }) {

    const signOut = useSignOut();
    const navigate = useNavigate();

    const logOut = () => {
        signOut();
        navigate('/login');
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
                    <UserDisplay />
                    <div style={{
                        float: "right",
                        height: "40px",
                        marginLeft: "1%"
                    }}>
                        <FaRegUserCircle style={{
                            width: "100%",
                            height: "100%"
                        }}
                        />
                    </div>
                </div>
            </nav >
        </>
    )
}

export default NavbarHome