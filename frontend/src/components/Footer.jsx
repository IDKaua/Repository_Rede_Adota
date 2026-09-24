import React from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6'

const Footer = () => {
  return (
    <footer className='bg-sidebar text-white/65 text-xs'>
      <div className='px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3'>

        <div className='flex items-center gap-2'>
          <a href='#' className='hover:text-white'>Termos de Uso</a>
          <span className='text-white/30'>|</span>
          <a href='#' className='hover:text-white'>Política de Privacidade</a>
        </div>

        <p className='text-center'>© 2024 REDE ADOTA - Todos os direitos reservados</p>

        <div className='flex items-center gap-4 text-base'>
          <a href='#' className='hover:text-white'><FaFacebookF /></a>
          <a href='#' className='hover:text-white'><FaInstagram /></a>
          <a href='#' className='hover:text-white'><FaLinkedinIn /></a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
