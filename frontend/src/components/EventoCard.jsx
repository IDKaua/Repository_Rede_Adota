import React from 'react'
import { Link } from 'react-router-dom'
import { FaCalendarDays, FaLocationDot, FaPaw } from 'react-icons/fa6'

const EventoCard = ({ evento }) => {
  return (
    <div className='bg-white border border-line rounded-xl overflow-hidden hover:shadow-md transition-shadow'>

      <Link to={`/eventos/${evento._id}`} className='block'>
        <img src={evento.imagem} alt={evento.titulo} className='w-full aspect-3/2 object-cover object-center' loading='lazy' />
      </Link>

      <div className='p-4'>
        <Link to={`/eventos/${evento._id}`} className='font-display font-semibold text-forest-800 hover:text-brand-600 transition-colors'>
          {evento.titulo}
        </Link>

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
          <Link
            to={`/eventos/${evento._id}`}
            className='border border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap'
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventoCard
