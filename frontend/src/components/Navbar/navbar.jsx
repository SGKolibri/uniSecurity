import React from 'react'
import { Link } from 'react-router-dom'
import { BiShieldQuarter } from '@react-icons/all-files/bi/BiShieldQuarter';

function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-blue-950">
                <div
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
                    <Link className="navbar-brand" to={'/login'} style={{ color: '#fff' }}>
                        Uni
                        <b>Security</b>
                    </Link>
                </div>
            </nav >
        </>
    )
}

export default Navbar;