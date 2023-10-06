import React from 'react'
import { Link } from 'react-router-dom'
import { BiShieldQuarter } from '@react-icons/all-files/bi/BiShieldQuarter';
import useWindowDimensions from '../Utils/getWindowDimensions';

function Navbar({ opacity1, opacity2 }) {

    const { width } = useWindowDimensions();

    return (
        <>
            {width > 992 ?
                (
                    <nav className="navbar navbar-expand-lg navbar-light fixed-top"
                        style={{ backgroundColor: '#0850BC' }}
                    >
                        <div className="container">
                            <Link to={'/login'} style={{ color: '#fff' }}>
                                <BiShieldQuarter
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                    }}
                                />
                            </Link>
                            <Link className="navbar-brand" to={'/login'} style={{ color: '#fff' }}>
                                Uni
                                <b>Security</b>
                            </Link>
                            <div className="collapse navbar-collapse" id="navbarTogglerDemo02"
                            >
                                <ul className="navbar-nav ml-auto" style={{
                                    position: 'absolute'
                                }}>
                                    <li className="nav-item">
                                        <Link className="nav-link" to={'/login'} style={{ color: '#fff', opacity: opacity1 }}>
                                            Login
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to={'/register'} style={{ color: '#fff', opacity: opacity2 }}>
                                            Registrar
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                ) : (
                    <nav className="navbar navbar-expand-lg navbar-light fixed-top"
                        style={{ backgroundColor: '#0850BC' }}
                    >
                        <div className="container"
                            style={{
                                placeItems: 'center',
                            }}
                        >
                            <div
                                className="uniSecuritySlogan"
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Link to={'/login'} style={{ color: '#fff' }}>
                                    <BiShieldQuarter
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                        }}
                                    />
                                </Link>
                                <Link className="navbar-brand" to={'/login'}
                                    style={{
                                        color: "#fff"
                                    }}
                                >
                                    Uni
                                    <b>Security</b>
                                </Link>

                            </div>

                        </div>
                    </nav>
                )}

        </>
    )
}

export default Navbar;