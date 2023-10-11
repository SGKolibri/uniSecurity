import React from 'react'
import CriarOcorrencia from '../../components/Ocorrencia/criar-ocorrencia';

/* Components */
import NavbarHome from '../../components/Navbar/navbar-home'

function RegOcorrenciaPage() {

    return (
        <>
            <NavbarHome opacity1={1} opacity2={0.75} />
            <div
                style={{
                    zIndex: -1
                }}
                className='bg'
            >

            </div>
            <CriarOcorrencia />
        </>
    )
}

export default RegOcorrenciaPage