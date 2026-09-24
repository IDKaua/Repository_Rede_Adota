import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { FaPaw, FaHouse, FaCalendarDays, FaHandHoldingHeart, FaUsers, FaGear, FaXmark } from 'react-icons/fa6'
import { AdocaoContext } from '../context/AdocaoContext'

const links = [
  { to: '/', label: 'Início', icone: <FaHouse /> },
  { to: '/animais', label: 'Animais', icone: <FaPaw /> },
  { to: '/ongs', label: 'ONGs & Protetores', icone: <FaUsers /> },
  { to: '/eventos', label: 'Eventos', icone: <FaCalendarDays /> },
]

const Sidebar = () => {

  const { menuAberto, setMenuAberto } = useContext(AdocaoContext);

  return (
    <>
      {/* Fundo escuro que fecha o menu no mobile */}
      {menuAberto && <div onClick={() => setMenuAberto(false)} className='fixed inset-0 bg-black/40 z-30 lg:hidden'></div>}

      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-sidebar text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${menuAberto ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Logo */}
        <div className='flex items-center justify-between px-5 py-6'>
          <div className='flex items-center gap-2'>
            <FaPaw className='text-brand-500 text-xl' />
            <p className='font-display text-xl font-semibold'>Rede ADota</p>
          </div>
          <button onClick={() => setMenuAberto(false)} className='lg:hidden text-white/60 hover:text-white cursor-pointer'>
            <FaXmark />
          </button>
        </div>

        {/* Navegação */}
        <nav className='flex-1 px-3 flex flex-col gap-1'>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMenuAberto(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-white/12 text-white font-medium' : 'text-white/65 hover:bg-white/8 hover:text-white'}`}
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-brand-500' : ''}>{link.icone}</span>
                  <span className='flex-1'>{link.label}</span>
                  {isActive && <span className='w-1.5 h-1.5 rounded-full bg-brand-500'></span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Missão + configurações */}
        <div className='px-5 pb-6 flex flex-col gap-4'>
          <div className='border-t border-white/15 pt-5'>
            <div className='flex items-center gap-2 mb-2'>
              <FaHandHoldingHeart className='text-brand-500 text-xs' />
              <p className='text-[11px] font-semibold tracking-wider text-white/90'>NOSSA MISSÃO</p>
            </div>
            <p className='text-xs leading-relaxed text-white/55'>Conectando laços de amor e salvando vidas através da adoção responsável.</p>
          </div>
          <button className='flex items-center gap-3 text-sm text-white/65 hover:text-white cursor-pointer'>
            <FaGear />
            <span>Configurações</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
