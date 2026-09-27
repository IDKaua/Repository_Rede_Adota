import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Footer from './Footer'

// Estrutura das telas internas: menu lateral, cabecalho e rodape em volta do conteudo.
// O login fica fora deste layout, por isso abre em tela cheia.
const Layout = () => {
  return (
    <div className='min-h-screen bg-sidebar'>
      <Sidebar />
      <div className='lg:ml-64 min-h-screen flex flex-col bg-surface'>
        <Topbar />
        <main className='flex-1'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
