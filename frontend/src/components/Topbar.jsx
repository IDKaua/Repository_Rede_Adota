import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBars } from 'react-icons/fa6'
import { AdocaoContext } from '../context/AdocaoContext'

// Nome da pagina atual usado na trilha de navegacao
const titulos = {
  '/animais': 'Animais',
  '/ongs': 'ONGs & Protetores',
  '/eventos': 'Eventos',
}

const Topbar = () => {

  const { setMenuAberto } = useContext(AdocaoContext);
  const { pathname } = useLocation();

  const paginaAtual = titulos[pathname];

  return (
    <header className='sticky top-0 z-20 bg-header border-b border-line'>
      <div className='flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3'>

        <div className='flex items-center gap-3 min-w-0'>
          <button onClick={() => setMenuAberto(true)} className='lg:hidden text-muted hover:text-ink cursor-pointer'>
            <FaBars />
          </button>

          {/* Trilha: "Página Inicial" na home e "Página Inicial • Animais" nas demais */}
          <p className='text-xs truncate'>
            {paginaAtual ? (
              <>
                <Link to='/' className='text-muted hover:text-ink'>Página Inicial</Link>
                <span className='text-brand-500 mx-1.5'>•</span>
                <span className='text-forest-800 font-medium'>{paginaAtual}</span>
              </>
            ) : (
              <span className='text-forest-800 font-medium'>Página Inicial</span>
            )}
          </p>
        </div>

        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <p className='hidden sm:block text-sm text-ink'>Nome da ONG</p>
            <div className='w-8 h-8 rounded-full bg-forest-700 text-white text-xs font-medium flex items-center justify-center'>AC</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
