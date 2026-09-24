import React, { useContext } from 'react'
import { FaUsers } from 'react-icons/fa6'
import { AdocaoContext } from '../context/AdocaoContext'
import Title from '../components/Title'

// Tela ainda nao prototipada no Figma: existe apenas para o menu funcionar
const ONGs = () => {

  const { ongs, pets } = useContext(AdocaoContext);

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6'>

      <Title
        etiqueta='PARCEIROS'
        icone={<FaUsers />}
        titulo='ONGs & Protetores'
        subtitulo='Organizações cadastradas que cuidam e disponibilizam animais para adoção.'
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {ongs.map((ong) => (
          <div key={ong._id} className='bg-white border border-line rounded-xl p-4 hover:shadow-md transition-shadow'>
            <div className={`w-10 h-10 rounded-full ${ong.cor} text-white text-xs font-semibold flex items-center justify-center`}>
              {ong.sigla}
            </div>
            <p className='font-display font-semibold text-forest-800 mt-3'>{ong.nome}</p>
            <p className='text-xs text-muted mt-1'>
              {pets.filter((pet) => pet.ong === ong._id).length} animais disponíveis
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ONGs
