import React, { useState } from 'react'
import NavbarHome from '../../components/Navbar/navbar-home'
import Cards from '../../components/Cards/cards'

function VerOcorrenciaPage() {

    const [search, setSearch] = useState('')

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

                    {/* Search Bar */}
                    <div style={{
                        float: "right",
                        marginBottom: "1%",
                        marginRight: "1%",
                        width: "25%",
                        height: "7%",
                    }}>
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
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>
                    {/* Disply cards das ocorrencias */}
                    <Cards search={search} />

                </div >
            </div >
        </>
    )
}

export default VerOcorrenciaPage