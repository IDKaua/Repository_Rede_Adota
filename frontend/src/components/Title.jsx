import React from 'react'

// Cabecalho padrao das secoes: etiqueta pequena + titulo + subtitulo
const Title = ({ etiqueta, icone, titulo, subtitulo }) => {
  return (
    <div className='mb-6'>
      {etiqueta && (
        <div className='flex items-center gap-2 mb-1'>
          {icone && <span className='text-brand-500 text-xs'>{icone}</span>}
          <p className='text-[11px] font-semibold tracking-wider text-brand-500'>{etiqueta}</p>
        </div>
      )}
      <h1 className='font-display text-2xl sm:text-3xl font-bold text-forest-800'>{titulo}</h1>
      {subtitulo && <p className='text-sm text-muted mt-1'>{subtitulo}</p>}
    </div>
  )
}

export default Title
