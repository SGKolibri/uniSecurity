import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
/* Pages and Components */
import LoginPage from './pages/Home/loginPage'
import RegOcorrencia from './pages/Home/regOcorrenciaPage'
import VerOcorrencia from './pages/Home/verOcorrenciaPage'
import GuardaPage from './pages/Home/guardaPage'
import { RequireAuth } from 'react-auth-kit'
import { useAuthUser } from 'react-auth-kit';


function App() {

  const authUser = useAuthUser()
  let isRoot = authUser() && authUser().userDetail.role === "root" ? true : false

  return (
    // <ThemeProvider theme={theme}>

    <Routes>
      <Route exact path="/*" element={<LoginPage />} />
      <Route className="App" path="/login" element={<LoginPage />} />
      <Route path="/home/reg-ocorrencia"
        element={
          <RequireAuth loginPath='/login'>
            <RegOcorrencia />
          </ RequireAuth>
        } >
      </Route>
      <Route path="/home/ver-ocorrencia"
        element={
          <RequireAuth loginPath='/login'>
            {/* <NavbarHome /> */}
            <VerOcorrencia />
          </ RequireAuth>
        } >
      </Route>
      <Route path="/home/guarda"
        element={
          <RequireAuth loginPath='/login'>
            {isRoot ? <GuardaPage /> : <Navigate to="/home/ver-ocorrencia" />}
          </ RequireAuth>
        } >
      </Route>
    </Routes >
    // </ThemeProvider>

  )
}

export default App;
