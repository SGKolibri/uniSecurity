import React from 'react'
import { Link } from 'react-router-dom'
import shieldLogo from '../../images/shield-logo.png'

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light fixed-top"
            style={{ backgroundColor: '#0850BC' }}
        >
            <div className="container">
                <Link to={'/login'} style={{ color: '#fff' }}>
                    <img src={shieldLogo} alt="logo" width="40px" height="40px"
                        style={{
                            marginRight: 15
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
                            <Link className="nav-link" to={'/login'} style={{ color: '#fff' }}>
                                Login
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={'/register'} style={{ color: '#fff' }}>
                                Registrar
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;