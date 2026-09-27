import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaCalendarDays, FaCircleCheck, FaLocationDot, FaPaw, FaUsers } from 'react-icons/fa6'
import { AdocaoContext } from '../context/AdocaoContext'
import Title from '../components/Title'

const ONGs = () => {

  const { ongs, pets, eventos } = useContext(AdocaoContext);

  const resumo = [
    { icone: <FaUsers />, valor: ongs.length, rotulo: 'organizações parceiras' },
    { icone: <FaPaw />, valor: pets.length, rotulo: 'animais disponíveis' },
    { icone: <FaCalendarDays />, valor: eventos.length, rotulo: 'eventos programados' },
  ];

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6'>

      <Title
        etiqueta='PARCEIROS'
        icone={<FaUsers />}
        titulo='ONGs & Protetores'
        subtitulo='Organizações cadastradas que cuidam e disponibilizam animais para adoção.'
      />

      {/* Resumo da rede */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
        {resumo.map((item) => (
          <div key={item.rotulo} className='bg-white border border-line rounded-xl p-5 flex items-center gap-4'>
            <div className='w-11 h-11 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center text-lg'>
              {item.icone}
            </div>
            <div>
              <p className='font-display text-2xl font-bold text-forest-800 leading-none'>{item.valor}</p>
              <p className='text-xs text-muted mt-1'>{item.rotulo}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lista de ONGs */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
        {ongs.map((ong) => {
          const animais = pets.filter((pet) => pet.ong === ong._id).length;
          const agenda = eventos.filter((evento) => evento.ong === ong._id).length;

          return (
            <Link
              key={ong._id}
              to={`/ongs/${ong._id}`}
              className='group bg-white border border-line rounded-xl overflow-hidden hover:shadow-md hover:border-brand-300 transition-all flex flex-col'
            >
              {/* Faixa da ONG */}
              <div className='bg-forest-50 px-5 py-4 flex items-center gap-3'>
                <div className={`w-14 h-14 rounded-xl ${ong.cor} text-white font-display text-lg font-bold flex items-center justify-center shrink-0`}>
                  {ong.sigla}
                </div>

                <div className='min-w-0'>
                  <p className='font-display text-lg font-semibold text-forest-800 truncate group-hover:text-brand-600 transition-colors'>
                    {ong.nome}
                  </p>
                  <p className='flex items-center gap-1.5 text-xs text-muted mt-0.5'>
                    <FaLocationDot className='text-brand-500' /> {ong.local}
                  </p>
                </div>
              </div>

              <div className='p-5 flex flex-col flex-1'>
                {ong.verificada ? (
                  <span className='flex items-center gap-1.5 w-fit bg-forest-100 text-forest-700 text-[11px] font-semibold px-2.5 py-1 rounded-full'>
                    <FaCircleCheck className='text-aprovado' /> ONG verificada
                  </span>
                ) : (
                  <span className='w-fit bg-brand-50 text-brand-700 text-[11px] font-semibold px-2.5 py-1 rounded-full'>
                    Cadastro em análise
                  </span>
                )}

                <p className='text-sm text-muted leading-relaxed mt-3'>{ong.descricao}</p>

                <div className='flex flex-wrap gap-2 mt-4'>
                  {ong.atuacao.map((item) => (
                    <span key={item} className='bg-surface border border-line text-[11px] text-forest-700 px-2.5 py-1 rounded-full'>
                      {item}
                    </span>
                  ))}
                </div>

                <div className='flex items-center justify-between gap-3 border-t border-line mt-5 pt-4'>
                  <div className='flex items-center gap-4 text-xs text-muted'>
                    <span className='flex items-center gap-1.5'><FaPaw className='text-brand-500' /> {animais} animais</span>
                    <span className='flex items-center gap-1.5'><FaCalendarDays className='text-brand-500' /> {agenda} eventos</span>
                  </div>

                  <span className='flex items-center gap-1.5 text-sm font-medium text-brand-600 whitespace-nowrap'>
                    Ver perfil <FaArrowRight className='text-xs' />
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Chamada para novas ONGs */}
      <div className='bg-forest-800 text-white rounded-xl p-6 sm:p-8 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <p className='font-display text-xl font-bold'>Sua ONG ainda não está aqui?</p>
          <p className='text-sm text-white/70 mt-1 max-w-xl'>
            Cadastre a organização para divulgar animais, campanhas e eventos em um só lugar.
          </p>
        </div>

        <Link
          to='/cadastro'
          className='flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-3 rounded-lg transition-colors whitespace-nowrap'
        >
          Cadastrar minha ONG <FaArrowRight className='text-xs' />
        </Link>
      </div>
    </div>
  )
}

export default ONGs
