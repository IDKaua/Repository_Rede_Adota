import React, { useContext, useState } from 'react'
import { FaCalendarDays } from 'react-icons/fa6'
import { AdocaoContext } from '../context/AdocaoContext'
import { tiposDeEvento } from '../assets/assets'
import Title from '../components/Title'
import EventoCard from '../components/EventoCard'

const Eventos = () => {

  const { eventos } = useContext(AdocaoContext);
  const [tipo, setTipo] = useState('Todos');

  const eventosFiltrados = tipo === 'Todos' ? eventos : eventos.filter((evento) => evento.tipo === tipo);

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6'>

      <Title
        etiqueta='AGENDA'
        icone={<FaCalendarDays />}
        titulo='Eventos'
        subtitulo='Encontre feiras, campanhas e mutirões de adoção e cuidado animal.'
      />

      {/* Filtros por tipo de evento */}
      <div className='flex flex-wrap gap-3 mb-6'>
        {tiposDeEvento.map((item) => (
          <button
            key={item}
            onClick={() => setTipo(item)}
            className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors cursor-pointer ${tipo === item ? 'bg-brand-500 border-brand-500 text-white' : 'bg-white border-line text-ink hover:border-brand-500'}`}
          >
            {item}
          </button>
        ))}
      </div>

      {eventosFiltrados.length === 0 ? (
        <p className='text-sm text-muted py-10 text-center'>Nenhum evento encontrado para esse filtro.</p>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
          {eventosFiltrados.map((evento) => <EventoCard key={evento._id} evento={evento} />)}
        </div>
      )}
    </div>
  )
}

export default Eventos
