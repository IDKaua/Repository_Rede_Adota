import React from 'react'
import { FaHandHoldingHeart, FaBullseye, FaStar, FaPaw } from 'react-icons/fa6'

const cartoes = [
  {
    titulo: 'Nossa Missão',
    icone: <FaHandHoldingHeart />,
    fundo: 'bg-brand-100',
    chip: 'bg-brand-500',
    botao: 'bg-brand-500 hover:bg-brand-600',
    marcador: 'bg-brand-500',
    resumo: 'Conectar ONGs, protetores e adotantes em um só lugar.',
    itens: [
      'Adoção responsável e segura',
      'Apoio às ONGs cadastradas',
      'Menos animais abandonados',
    ],
  },
  {
    titulo: 'Nosso Objetivo',
    icone: <FaBullseye />,
    fundo: 'bg-forest-100',
    chip: 'bg-forest-600',
    botao: 'bg-forest-600 hover:bg-forest-700',
    marcador: 'bg-forest-600',
    resumo: 'Organizar todo o processo de adoção, do anúncio à entrega.',
    itens: [
      'Divulgação de animais e eventos',
      'Solicitações com triagem',
      'Histórico de cada adoção',
    ],
  },
  {
    titulo: 'Por Que Nos Escolher',
    icone: <FaStar />,
    fundo: 'bg-sun-100',
    chip: 'bg-sun-500',
    botao: 'bg-sun-500 hover:bg-sun-600',
    marcador: 'bg-sun-500',
    resumo: 'Uma plataforma feita junto com quem cuida dos animais.',
    itens: [
      'Somente ONGs verificadas anunciam',
      'Filtros por porte, idade e bairro',
      'Acompanhamento da solicitação',
    ],
  },
]

const SobreNos = () => {
  return (
    <section className='mt-10 pb-4'>

      <h2 className='text-xl sm:text-2xl font-bold tracking-widest text-forest-800 text-center'>SOBRE NÓS</h2>

      <p className='text-sm text-muted text-center leading-relaxed max-w-3xl mx-auto mt-4'>
        A Rede ADota nasceu para reunir ONGs em prol da causa animal, promovendo adoção, doação, campanhas e eventos.
        Apenas organizações cadastradas podem anunciar e gerenciar animais, o que garante a procedência das informações
        e a segurança de todo o processo.
      </p>

      <div className='flex items-center justify-center gap-4 mt-8'>
        <FaPaw className='text-brand-500 text-3xl sm:text-4xl' />
        <p className='font-display text-4xl sm:text-6xl font-extrabold text-forest-800 tracking-tight'>REDE ADOTA</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-10'>
        {cartoes.map((cartao) => (
          <div key={cartao.titulo} className={`${cartao.fundo} rounded-2xl p-5 flex flex-col`}>

            <div className='flex items-center gap-3'>
              <div className={`w-10 h-10 rounded-lg ${cartao.chip} text-white flex items-center justify-center text-lg`}>
                {cartao.icone}
              </div>
              <p className='font-display text-lg font-semibold text-forest-800'>{cartao.titulo}</p>
            </div>

            <p className='text-sm font-medium text-forest-800 mt-5'>{cartao.resumo}</p>

            <div className='border-t border-forest-800/15 my-4'></div>

            <ul className='text-sm text-ink flex flex-col gap-2'>
              {cartao.itens.map((item) => (
                <li key={item} className='flex items-start gap-2'>
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${cartao.marcador} shrink-0`}></span>
                  {item}
                </li>
              ))}
            </ul>

            <div className='flex justify-end mt-6'>
              <button className={`${cartao.botao} text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer`}>
                Saiba mais
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SobreNos
