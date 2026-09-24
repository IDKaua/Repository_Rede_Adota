import React from 'react'
import { FaCalendarDays, FaLocationDot, FaPaw } from 'react-icons/fa6'

const EventoCard = ({ evento }) => {
  return (
    <div className='bg-white border border-line rounded-xl overflow-hidden hover:shadow-md transition-shadow'>

      <img src={evento.imagem} alt={evento.titulo} className='w-full h-44 object-cover' loading='lazy' />

      <div className='p-4'>
        <p className='font-display font-semibold text-forest-800'>{evento.titulo}</p>

        <div className='flex items-center gap-2 text-xs text-muted mt-2'>
          <FaCalendarDays className='text-brand-500' />
          <span>{evento.data} • {evento.horario}</span>
        </div>

        <div className='flex items-center gap-2 text-xs text-muted mt-1'>
          <FaLocationDot className='text-brand-500' />
          <span className='truncate'>{evento.local}</span>
        </div>

        <p className='text-xs text-muted leading-relaxed mt-3'>{evento.descricao}</p>

        <div className='flex items-center justify-between gap-3 mt-4'>
          <div className='flex items-center gap-2 text-xs text-forest-600'>
            <FaPaw className='text-brand-500' />
            <span>{evento.destaque}</span>
          </div>
          <button className='border border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer'>
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventoCard
