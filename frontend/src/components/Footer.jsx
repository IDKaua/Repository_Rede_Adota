import React from 'react'
import { Link } from 'react-router-dom'
import { FaPaw } from 'react-icons/fa6'

// Só entram links de páginas que já existem no sistema
const explorar = [
  { to: '/', label: 'Início' },
  { to: '/animais', label: 'Animais para Adoção' },
  { to: '/ongs', label: 'ONGs & Protetores' },
  { to: '/eventos', label: 'Eventos' },
]

const Footer = () => {
  return (
    <footer className='bg-sidebar text-white/70'>

      <div className='px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>

        {/* Marca */}
        <div>
          <div className='flex items-center gap-2'>
            <FaPaw className='text-brand-500 text-lg' />
            <p className='font-display text-lg font-semibold text-white'>Rede ADota</p>
          </div>
          <p className='text-sm leading-relaxed mt-3 max-w-xs'>
            Conectando laços entre pessoas, protetores e animais para transformar vidas através da
            adoção responsável e consciente.
          </p>
        </div>

        {/* Navegação */}
        <div>
          <p className='text-sm font-semibold text-white mb-3'>Explorar</p>
          <ul className='flex flex-col gap-2'>
            {explorar.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className='text-sm hover:text-white transition-colors'>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Área das organizações */}
        <div>
          <p className='text-sm font-semibold text-white mb-3'>Para ONGs</p>
          <ul className='flex flex-col gap-2'>
            <li>
              <Link to='/login' className='text-sm hover:text-white transition-colors'>
                Entrar como ONG
              </Link>
            </li>
            <li>
              <Link to='/cadastro' className='text-sm hover:text-white transition-colors'>
                Cadastrar minha ONG
              </Link>
            </li>
          </ul>
          <p className='text-sm leading-relaxed mt-3 max-w-xs'>
            Apenas organizações cadastradas podem anunciar e gerenciar animais na plataforma.
          </p>
        </div>
      </div>

      <div className='border-t border-white/10 px-4 sm:px-6 lg:px-8 py-4'>
        <p className='text-xs text-center'>© 2026 Rede ADota. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
