import React from 'react'
import NavbarHome from '../../components/Navbar/navbar-home'
import { motion } from 'framer-motion'
import Cards from '../../components/Cards/cards'
import { BsSearch } from "react-icons/bs";
import { Button } from '@chakra-ui/react';
import { Button as NextButton, ButtonGroup } from "@nextui-org/react";

function VerOcorrenciaPage() {

    return (
        <>
            <NavbarHome opacity1={0.75} opacity2={1} />
            <div className="auth-wrapper">
                <div style={{
                    width: "98%",
                    height: "86%",
                    marginTop: "4.5%",
                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)"
                }}
                    className="auth-inner">

                    <div style={{
                        marginTop: "-1.5%",
                        marginBottom: "1%",
                        marginLeft: "-1%",
                        fontSize: 30
                    }}>
                        <h style={{
                            textShadowColor: 'rgba(0, 0, 0, 0.75)',
                            textShadowOffset: { width: -1, height: 1 },
                            textShadowRadius: 10
                        }}>
                            Histórico de Ocorrência
                        </h>
                    </div>

                    {/* Botão Registrar Ocorrência */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            float: "left",
                            boxShadow: "2px 2px 5px 0 rgba(0,0,0,0.3)"
                        }}
                        type="submit"
                        className="btn btn-primary"
                        background-color="#00abff"
                        onClick={() => window.location.href = "/home/reg-ocorrencia"}
                    >
                        Registrar Ocorrência
                    </motion.button>

                    {/* Search Bar */}
                    <div style={{
                        float: "right",
                        marginTop: "0.5%",
                        marginRight: "1%",
                        width: "25%",
                        height: "7%",
                    }}>
                        <BsSearch style={{
                            position: "absolute",
                            top: "9.5%",
                            right: "6%",
                            width: "2%",
                            height: "30%",
                            color: "#00abff"
                        }} />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Pesquisar ocorrência"
                            style={{
                                position: "relative",
                                width: "100%",
                                height: "100%",
                                borderRadius: "5px",
                                boxShadow: "2px 2px 5px 0px rgba(0,0,0,0.3)"
                            }}
                        />

                    </div>
                    {/* Disply cards das ocorrencias */}
                    <Cards />

                </div >
            </div >
        </>
    )
}

export default VerOcorrenciaPage