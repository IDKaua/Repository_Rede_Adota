import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa6'
import { AdocaoContext } from '../context/AdocaoContext'
import PetCard from './PetCard'

// Vitrine da home: mostra os 5 primeiros animais e leva para a listagem completa
const PetsDisponiveis = () => {

  const { pets } = useContext(AdocaoContext);

  return (
    <section className='mt-8'>

      <div className='flex items-start justify-between gap-4 mb-5'>
        <div>
          <h2 className='font-display text-xl font-bold text-forest-800'>Animais</h2>
          <p className='text-sm text-muted mt-1'>Encontre seu novo melhor amigo.</p>
        </div>

        <Link to='/animais' className='flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap'>
          Ver todos <FaArrowRight className='text-xs' />
        </Link>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
        {pets.slice(0, 5).map((pet) => <PetCard key={pet._id} pet={pet} />)}
      </div>
    </section>
  )
}

export default PetsDisponiveis
