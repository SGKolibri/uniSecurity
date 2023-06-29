import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

/* Pages and Components */
import Login from './components/Login/login.component'
import SignUp from './components/Register/signup.component'
import RegOcorrencia from './pages/Home/regOcorrenciaPage'
import VerOcorrencia from './pages/Home/verOcorrenciaPage'

import { RequireAuth } from 'react-auth-kit'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/*" element={<Login />} />
        <Route className="App" path="/login" element={<Login />} />
        <Route className="App" path="/register" element={<SignUp />} />
        <Route path="/home" element={
          <RequireAuth loginPath='/login'>
            <VerOcorrencia />
          </ RequireAuth>
        } />
        {/* <Route path="/home/ver-ocorrencia" element={<VerOcorrencia />} />
        <Route path="/home/reg-ocorrencia" element={<RegOcorrencia />} /> */}
      </Routes >
    </BrowserRouter >
  )
}

export default App
