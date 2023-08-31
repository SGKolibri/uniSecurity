import React from 'react'
import NavbarHome from '../../components/Navbar/navbar-home.component'
import searchIcon from '../../images/search-icon.png'
import { motion } from 'framer-motion'

function VerOcorrenciaPage() {
    return (
        <>
            <NavbarHome opacity1={0.75} opacity2={1} />
            <div className="auth-wrapper">
                <div style={{
                    width: "98%",
                    height: "86%",
                    marginTop: "4.5%",
                }}
                    className="auth-inner">

                    <div style={{
                        marginTop: "-1.5%",
                        marginBottom: "1.5%",
                        marginLeft: "-1%",
                        fontSize: 30
                    }}>
                        Histórico de Ocorrência
                    </div>

                    {/* Botão Registrar Ocorrência */}
                    <div style={{
                        float: "left",
                        marginBottom: "1.5%",
                    }}>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="submit"
                            className="btn btn-primary"
                            background-color="#00abff"
                            onClick={() => window.location.href = "/home/reg-ocorrencia"}
                        >
                            Registrar Ocorrência
                        </motion.button>
                    </div>

                    {/* Search Bar */}
                    <div style={{
                        float: "right",
                        width: "30%",
                        marginBottom: "1.5%",
                        position: "relative",
                        display: "inline-block"
                    }}>
                        {/* Search Icon */}
                        <img style={{
                            position: "absolute",
                            width: "30px",
                            right: "2%",
                            top: "10%",
                            pointerEvents: "none",
                        }}
                            src={searchIcon}
                            alt="search-icon"
                        />

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Pesquisar Ocorrência"
                            required
                        />

                    </div>

                </div >
            </div >
        </>
    )
}

export default VerOcorrenciaPage