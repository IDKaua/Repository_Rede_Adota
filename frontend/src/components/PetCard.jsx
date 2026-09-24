import React, { useContext } from 'react'
import { FaPaw, FaLocationDot, FaAngleRight } from 'react-icons/fa6'
import { AdocaoContext } from '../context/AdocaoContext'

const PetCard = ({ pet }) => {

  const { solicitarAdocao } = useContext(AdocaoContext);

  return (
    <div className='bg-white border border-line rounded-xl overflow-hidden hover:shadow-md transition-shadow'>

      {/* Foto + selos */}
      <div className='relative'>
        <img src={pet.imagem} alt={pet.nome} className='w-full h-40 object-cover' loading='lazy' />

        <span className='absolute top-2 left-2 bg-white/90 text-forest-800 text-[10px] font-medium px-2 py-0.5 rounded'>
          {pet.especie}
        </span>

        <div className='absolute top-2 right-2 flex flex-col items-end gap-1'>
          {pet.castrado && <span className='bg-white/90 text-forest-700 text-[10px] font-medium px-2 py-0.5 rounded'>Castrado</span>}
          {pet.vacinado && <span className='bg-white/90 text-aprovado text-[10px] font-semibold px-2 py-0.5 rounded'>Vacinado</span>}
          <span className='bg-sun-400 text-forest-800 text-[10px] font-semibold px-2 py-0.5 rounded'>{pet.tag}</span>
        </div>
      </div>

      {/* Informacoes */}
      <div className='p-3'>
        <p className='font-display font-semibold text-forest-800'>{pet.nome}</p>

        <div className='flex items-center gap-1.5 text-[11px] text-muted mt-1'>
          <FaPaw className='text-brand-500 text-[9px]' />
          <span className='truncate'>{pet.raca} • {pet.idade}</span>
        </div>

        <div className='flex items-center gap-1.5 text-[11px] text-muted mt-0.5'>
          <FaLocationDot className='text-brand-500 text-[9px]' />
          <span>{pet.local}</span>
        </div>

        <button
          onClick={() => solicitarAdocao(pet)}
          className='w-full mt-3 flex items-center justify-center gap-1 border border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white text-xs font-medium py-2 rounded-lg transition-colors cursor-pointer'
        >
          Quero Adotar <FaAngleRight className='text-[10px]' />
        </button>
      </div>
    </div>
  )
}

export default PetCard
