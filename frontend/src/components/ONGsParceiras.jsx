import React, { useContext } from 'react'
import { AdocaoContext } from '../context/AdocaoContext'

const ONGsParceiras = () => {

  const { ongsParceiras } = useContext(AdocaoContext);

  return (
    <section className='mt-10 bg-white border border-line rounded-2xl px-6 py-10'>

      <h2 className='font-display text-2xl sm:text-3xl font-bold text-sidebar text-center'>
        ONGs parceiras da Rede ADota
      </h2>

      <p className='text-sm text-muted text-center leading-relaxed max-w-2xl mx-auto mt-4'>
        Com a <span className='font-semibold text-ink'>Rede ADota</span>, organizações de proteção animal divulgam seus
        animais, campanhas e eventos em um só lugar. Conheça as instituições que já fazem parte da rede e ajudam a
        transformar histórias todos os dias.
      </p>

      <div className='flex flex-wrap items-start justify-center gap-8 sm:gap-12 mt-10'>
        {ongsParceiras.map((ong) => (
          <div key={ong._id} className='flex flex-col items-center gap-3 w-28'>
            <div className={`w-24 h-20 rounded-lg ${ong.cor} text-white font-display font-bold text-lg flex items-center justify-center`}>
              {ong.sigla}
            </div>
            <p className='text-xs text-muted text-center leading-snug'>{ong.nome}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ONGsParceiras
