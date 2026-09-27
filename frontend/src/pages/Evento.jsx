import React, { useContext, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaArrowLeft, FaCalendarDays, FaCheck, FaClock, FaFileLines, FaHeart, FaLocationDot, FaMoneyBillWave, FaPaw, FaScissors, FaSyringe, FaTriangleExclamation, FaUsers, FaWhatsapp } from 'react-icons/fa6'
import { AdocaoContext } from '../context/AdocaoContext'
import EventoCard from '../components/EventoCard'

// Icones usados pelos detalhes especificos de cada tipo de evento
const icones = {
  seringa: <FaSyringe />,
  tesoura: <FaScissors />,
  dinheiro: <FaMoneyBillWave />,
  documento: <FaFileLines />,
  aviso: <FaTriangleExclamation />,
  coracao: <FaHeart />,
  pata: <FaPaw />,
}

// Linha de informacao da ficha (icone + rotulo + valor)
const Linha = ({ icone, rotulo, valor }) => (
  <div className='flex items-start gap-3'>
    <span className='text-brand-500 mt-0.5'>{icone}</span>
    <div>
      <p className='text-[11px] text-muted'>{rotulo}</p>
      <p className='text-sm font-medium text-forest-800'>{valor}</p>
    </div>
  </div>
)

const Evento = () => {

  const { eventoId } = useParams();
  const { eventos, buscarOng } = useContext(AdocaoContext);

  const evento = eventos.find((item) => item._id === eventoId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [eventoId]);

  if (!evento) {
    return (
      <div className='px-4 sm:px-6 lg:px-8 py-16 text-center'>
        <p className='text-sm text-muted'>Evento não encontrado.</p>
        <Link to='/eventos' className='inline-block mt-4 text-sm font-medium text-brand-600 hover:text-brand-700'>
          Voltar para os eventos
        </Link>
      </div>
    )
  }

  const ong = buscarOng(evento.ong);
  const outros = eventos.filter((item) => item._id !== evento._id).slice(0, 3);

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6'>

      <Link to='/eventos' className='inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-5'>
        <FaArrowLeft className='text-xs' /> Voltar para os eventos
      </Link>

      {/* Foto + ficha */}
      <div className='flex flex-col lg:flex-row gap-6'>

        {/* A moldura acompanha o tamanho da foto, sem sobrar espaço em branco */}
        <div className='flex-1 flex justify-center'>
          <img
            src={evento.imagem}
            alt={evento.titulo}
            className='max-w-full max-h-112 rounded-xl border border-line'
          />
        </div>

        <div className='w-full lg:w-96 bg-white border border-line rounded-xl p-5'>
          <span className='inline-block bg-brand-50 text-brand-600 text-[11px] font-semibold px-2.5 py-1 rounded'>
            {evento.tipo}
          </span>

          <h1 className='font-display text-2xl font-bold text-forest-800 mt-3 leading-tight'>{evento.titulo}</h1>

          <div className='border-t border-line my-4'></div>

          <div className='flex flex-col gap-4'>
            <Linha icone={<FaCalendarDays />} rotulo='Data' valor={evento.data} />
            <Linha icone={<FaClock />} rotulo='Horário' valor={evento.horario} />
            <Linha icone={<FaLocationDot />} rotulo='Local' valor={evento.local} />

            {/* Informações que mudam conforme o tipo: vacinação, castração ou adoção */}
            {evento.detalhes.map((detalhe) => (
              <Linha key={detalhe.rotulo} icone={icones[detalhe.icone]} rotulo={detalhe.rotulo} valor={detalhe.valor} />
            ))}

            <Linha icone={<FaUsers />} rotulo='Acesso' valor={evento.publico} />
          </div>
        </div>
      </div>

      {/* Descricao, requisitos e ONG */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6'>

        <div className='bg-white border border-line rounded-xl p-5'>
          <p className='font-display font-semibold text-forest-800 mb-3'>Sobre o evento</p>
          <p className='text-sm text-muted leading-relaxed'>{evento.sobre}</p>
        </div>

        <div className='bg-white border border-line rounded-xl p-5'>
          <p className='font-display font-semibold text-forest-800 mb-3'>O que levar</p>
          <ul className='flex flex-col gap-2.5'>
            {evento.requisitos.map((item) => (
              <li key={item} className='flex items-start gap-2 text-sm text-ink'>
                <span className='w-4 h-4 mt-0.5 rounded bg-aprovado text-white text-[9px] flex items-center justify-center shrink-0'>
                  <FaCheck />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className='bg-white border border-line rounded-xl p-5 flex flex-col'>
          <p className='text-[11px] text-muted mb-2'>Organizado por</p>

          <div className='flex items-center gap-2'>
            <div className={`w-8 h-8 rounded-full ${ong.cor} text-white text-[10px] font-semibold flex items-center justify-center`}>
              {ong.sigla}
            </div>
            <div>
              <p className='font-display font-semibold text-forest-800 leading-tight'>{ong.nome}</p>
              <p className='text-[11px] text-muted'>{ong.local}</p>
            </div>
          </div>

          <p className='text-sm text-muted leading-relaxed mt-3'>{ong.descricao}</p>

          <Link to={`/ongs/${ong._id}`} className='text-sm font-medium text-brand-600 hover:text-brand-700 underline mt-3'>
            Ver perfil da ONG
          </Link>

          <div className='border-t border-line my-4'></div>

          <p className='text-sm font-medium text-forest-800'>Dúvidas sobre o evento?</p>
          <a
            href={`https://wa.me/${ong.whatsapp}?text=${encodeURIComponent(`Olá! Tenho uma dúvida sobre o evento "${evento.titulo}" que vi na Rede ADota.`)}`}
            target='_blank'
            rel='noreferrer'
            className='flex items-center justify-center gap-2 bg-forest-700 hover:bg-forest-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors mt-3'
          >
            <FaWhatsapp /> Falar com a ONG
          </a>
        </div>
      </div>

      {/* Outros eventos */}
      {outros.length > 0 && (
        <section className='mt-10'>
          <div className='flex items-end justify-between gap-4 mb-4'>
            <p className='font-display text-lg font-bold text-forest-800'>Outros eventos</p>
            <Link to='/eventos' className='text-sm font-medium text-brand-600 hover:text-brand-700 whitespace-nowrap'>
              Ver todos
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            {outros.map((item) => <EventoCard key={item._id} evento={item} />)}
          </div>
        </section>
      )}
    </div>
  )
}

export default Evento
