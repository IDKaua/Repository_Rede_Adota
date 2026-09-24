import React from 'react'
import { Link } from 'react-router-dom'
import { FaPaw, FaArrowRight } from 'react-icons/fa6'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <section className='bg-brand-50/60 rounded-2xl px-6 sm:px-10 py-10 flex flex-col lg:flex-row items-center gap-10'>

      {/* Texto */}
      <div className='flex-1 w-full'>
        <div className='flex items-center gap-2 mb-3'>
          <FaPaw className='text-brand-500 text-xs' />
          <p className='text-[11px] font-semibold tracking-wider text-brand-500'>BEM-VINDO(A) À</p>
        </div>

        <h1 className='font-display text-4xl sm:text-5xl font-extrabold text-forest-800 flex items-center gap-3 flex-wrap'>
          REDE
          <FaPaw className='text-brand-500 text-3xl' />
          <span className='text-brand-500'>DOTA</span>
        </h1>

        <p className='text-sm sm:text-base text-muted mt-4 max-w-md leading-relaxed'>
          Conectando laços entre pessoas, protetores <span className='text-brand-500'>e animais</span> para transformar vidas através da adoção responsável e consciente.
        </p>

        <div className='flex flex-wrap items-center gap-3 mt-7'>
          <Link to='/animais' className='flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors'>
            Quero Adotar <FaArrowRight className='text-xs' />
          </Link>
          <Link to='/ongs' className='border border-line bg-white hover:border-forest-500 text-sm font-medium px-6 py-3 rounded-lg transition-colors'>
            Ver ONGs Parceiras
          </Link>
        </div>
      </div>

      {/* Logo do sistema */}
      <div className='flex-1 w-full max-w-md'>
        <img src={assets.logo} alt='Rede ADota - cachorro e gato dentro de um coração' className='w-full rounded-2xl' />
      </div>
    </section>
  )
}

export default Hero
