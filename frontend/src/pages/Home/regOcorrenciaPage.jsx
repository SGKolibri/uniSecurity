import React from 'react'
import 'react-toastify/dist/ReactToastify.css';
import CriarOcorrencia from '../../components/Ocorrencia/criar-ocorrencia';

/* Components */
import NavbarHome from '../../components/Navbar/navbar-home'

function RegOcorrenciaPage() {

    return (
        <>
            <NavbarHome opacity1={1} opacity2={0.75} />

            <div className="auth-wrapper">
                <div style={{
                    width: "98%",
                    height: "89%",
                    maxHeight: "89%",
                    marginTop: "4.5%",
                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)"
                }}
                    className="auth-inner"
                >
                    <div style={{
                        marginTop: "-1.5%",
                        marginBottom: "2%",
                        marginLeft: "-1%",
                        fontSize: 30
                    }}>
                        Registrar Ocorrência
                    </div>
                    <CriarOcorrencia />
                </div >
            </div >
        </>
    )
}

export default RegOcorrenciaPage