import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Routes, Route } from 'react-router-dom'

/* Pages and Components */
import Login from './components/Login/login-component'
import SignUp from './components/Register/signup-component'
import RegOcorrencia from './pages/Home/regOcorrenciaPage'
import VerOcorrencia from './pages/Home/verOcorrenciaPage'
import { RequireAuth } from 'react-auth-kit'
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {

  const CLIENT_ID = '717615909929-gka7nu14rdaj7jaifrpj1fhmq3lin8d0.apps.googleusercontent.com'

  // let googleLogged = localStorage.getItem('googleLoggedIn');

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID} redirect="/home/reg-ocorrencia">
      <Routes>
        <Route exact path="/*" element={<Login />} />
        <Route className="App" path="/login" element={<Login />} />
        <Route className="App" path="/register" element={<SignUp />} />
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
              <VerOcorrencia />
            </ RequireAuth>
          } >
        </Route>
      </Routes >
    </GoogleOAuthProvider>
  )
}

export default App;
