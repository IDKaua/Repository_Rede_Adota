import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Animais from './pages/Animais'
import Eventos from './pages/Eventos'
import ONGs from './pages/ONGs'

const App = () => {
  return (
    <div className='min-h-screen bg-sidebar'>
      <Sidebar />
      <div className='lg:ml-64 min-h-screen flex flex-col bg-surface'>
        <Topbar />
        <main className='flex-1'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/animais' element={<Animais />} />
            <Route path='/ongs' element={<ONGs />} />
            <Route path='/eventos' element={<Eventos />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer position='bottom-right' autoClose={2500} />
    </div>
  )
}

export default App
