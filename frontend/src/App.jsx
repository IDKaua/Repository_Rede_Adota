import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Animais from './pages/Animais'
import Animal from './pages/Animal'
import Eventos from './pages/Eventos'
import Evento from './pages/Evento'
import ONGs from './pages/ONGs'
import Ong from './pages/Ong'
import Login from './pages/Login'
import NovoEvento from './pages/NovoEvento'
import Adotar from './pages/Adotar'
import Doar from './pages/Doar'

const App = () => {
  return (
    <>
      <Routes>
        {/* Tela cheia, sem o menu do sistema */}
        <Route path='/login' element={<Login />} />
        <Route path='/cadastro' element={<Login modoInicial='Cadastro' />} />
        <Route path='/eventos/novo' element={<NovoEvento />} />
        <Route path='/animais/:petId/adotar' element={<Adotar />} />
        <Route path='/ongs/:ongId/doar' element={<Doar />} />

        {/* Telas internas, dentro do layout com menu lateral */}
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/animais' element={<Animais />} />
          <Route path='/animais/:petId' element={<Animal />} />
          <Route path='/ongs' element={<ONGs />} />
          <Route path='/ongs/:ongId' element={<Ong />} />
          <Route path='/eventos' element={<Eventos />} />
          <Route path='/eventos/:eventoId' element={<Evento />} />
        </Route>
      </Routes>

      <ToastContainer position='bottom-right' autoClose={2500} />
    </>
  )
}

export default App
