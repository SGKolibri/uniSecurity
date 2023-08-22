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
import useToken from './components/Login/useToken'

function App() {
  // const [ token, setToken ] = useToken();

  // if(!token) {
  //   return <Login setToken={setToken} />
  // }


  return (
    <BrowserRouter>
      <div className="App"> 
        <Routes>
          <Route path={'/login'} element={<Login />} />
          <Route path={'/home'} element={
            <RequireAuth loginPath={'/login'}>
              <RegOcorrencia />
            </RequireAuth>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
