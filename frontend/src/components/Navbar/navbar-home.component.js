import { React } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import shieldLogo from '../../images/shield-logo.png'
import avatarIcon from '../../images/avatar-icon.png'
import ImageDisplay from "../ImageDisplay";

function NavbarHome({ opacity1, opacity2, userProfile }) {

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
                        <img src={shieldLogo} alt="logo" width="40px" height="40px"
                            style={{
                                marginRight: "15px"
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
                        < ImageDisplay />

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
                </div>
                <div style={{
                    width: 120,
                    height: 40,
                    marginLeft: -120
                }}>
                    <img src={userProfile} alt="user-icon" onClick={logOut} />
                </div>
            </nav >
        </>
    )
}

export default NavbarHome