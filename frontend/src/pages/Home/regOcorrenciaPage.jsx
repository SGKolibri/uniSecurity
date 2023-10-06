import React from 'react'
import 'react-toastify/dist/ReactToastify.css';
import CriarOcorrencia from '../../components/Ocorrencia/criar-ocorrencia';

/* Components */
import NavbarHome from '../../components/Navbar/navbar-home'

function RegOcorrenciaPage() {

    return (
        <>
            <NavbarHome opacity1={1} opacity2={0.75} />
            <CriarOcorrencia />
        </>
    )
}

export default RegOcorrenciaPage