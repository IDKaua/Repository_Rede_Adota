import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  FaArrowLeft, FaArrowRight, FaCircleCheck, FaEnvelope, FaFacebook, FaFileLines, FaGlobe,
  FaHandHoldingHeart, FaHeart, FaInstagram, FaLocationDot, FaPaw, FaPencil, FaPhone, FaPlus,
  FaQrcode, FaShieldHalved, FaWhatsapp,
} from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { AdocaoContext } from '../context/AdocaoContext'
import PetCard from '../components/PetCard'
import EventoCard from '../components/EventoCard'

const abas = ['Sobre', 'Animais', 'Eventos'];

const formatarCnpj = (valor = '') => valor
  .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');

// Campo usado no modo de edição do perfil
const Campo = ({ id, rotulo, textarea, className = '', ...props }) => (
  <div className={className}>
    <label htmlFor={id} className='block text-xs font-medium text-muted mb-1.5'>{rotulo}</label>
    {textarea
      ? <textarea id={id} rows={4} className='w-full bg-white border border-line focus:border-forest-500 rounded-lg px-4 py-3 text-sm outline-none transition-colors' {...props} />
      : <input id={id} className='w-full bg-white border border-line focus:border-forest-500 rounded-lg px-4 py-3 text-sm outline-none transition-colors' {...props} />}
  </div>
)

const Ong = () => {

  const { ongId } = useParams();
  const navigate = useNavigate();
  const { pets, eventos, buscarOng, atualizarOng, ongLogada } = useContext(AdocaoContext);

  const ong = buscarOng(ongId);

  // A visão guarda a qual ONG pertence: ao abrir outro perfil, volta
  // sozinha para a aba "Sobre" e sai do modo de edição
  const [visao, setVisao] = useState({ ongId: null, aba: 'Sobre', editando: false });
  const [rascunho, setRascunho] = useState(null);

  const mesmaOng = visao.ongId === ongId;
  const aba = mesmaOng ? visao.aba : 'Sobre';
  const editando = mesmaOng ? visao.editando : false;

  const setAba = (nova) => setVisao({ ongId, aba: nova, editando: false });
  const setEditando = (valor) => setVisao({ ongId, aba: 'Sobre', editando: valor });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [ongId]);

  if (!ong) {
    return (
      <div className='px-4 sm:px-6 lg:px-8 py-16 text-center'>
        <p className='text-sm text-muted'>ONG não encontrada.</p>
        <Link to='/ongs' className='inline-block mt-4 text-sm font-medium text-brand-600 hover:text-brand-700'>
          Voltar para a lista de ONGs
        </Link>
      </div>
    )
  }

  // A ONG só edita o próprio perfil
  const ehDona = ongLogada?._id === ong._id;

  const animaisDaOng = pets.filter((pet) => pet.ong === ong._id);
  const eventosDaOng = eventos.filter((evento) => evento.ong === ong._id);

  const abrirEdicao = () => {
    setRascunho({
      descricao: ong.descricao,
      telefone: ong.telefone,
      email: ong.email,
      endereco: ong.endereco,
      responsavel: ong.responsavel,
      instagram: ong.redes.instagram,
      facebook: ong.redes.facebook,
      site: ong.redes.site,
    });
    setAba('Sobre');
    setEditando(true);
  }

  const salvar = (e) => {
    e.preventDefault();
    const { instagram, facebook, site, ...resto } = rascunho;
    atualizarOng(ong._id, { ...resto, redes: { instagram, facebook, site } });
    setEditando(false);
  }

  const emBreve = (acao) => toast.info(`${acao} estará disponível em breve.`);

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6'>

      <Link to='/ongs' className='inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-5'>
        <FaArrowLeft className='text-xs' /> Voltar para as ONGs
      </Link>

      {/* Cabeçalho */}
      <div className='bg-white border border-line rounded-xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-5'>

        <div className={`w-20 h-20 rounded-xl ${ong.cor} text-white font-display text-2xl font-bold flex items-center justify-center shrink-0`}>
          {ong.sigla}
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='font-display text-2xl sm:text-3xl font-bold text-forest-800'>{ong.nome}</h1>
            {ong.verificada && (
              <span className='flex items-center gap-1.5 bg-forest-50 text-forest-700 text-[11px] font-semibold px-2.5 py-1 rounded-full'>
                <FaCircleCheck className='text-aprovado' /> ONG verificada
              </span>
            )}
          </div>

          <p className='text-sm text-muted leading-relaxed mt-2 max-w-3xl'>{ong.descricao}</p>

          <div className='flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-xs text-muted'>
            <span className='flex items-center gap-1.5'><FaLocationDot className='text-brand-500' /> {ong.local}</span>
            <span className='flex items-center gap-1.5'><FaPhone className='text-brand-500' /> {ong.telefone}</span>
            <span className='flex items-center gap-1.5'><FaEnvelope className='text-brand-500' /> {ong.email}</span>
          </div>
        </div>

        {/* Ação principal muda conforme quem está vendo */}
        {ehDona ? (
          <button
            onClick={abrirEdicao}
            className='flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap'
          >
            <FaPencil className='text-xs' /> Editar perfil
          </button>
        ) : (
          <a
            href={`https://wa.me/${ong.whatsapp}?text=${encodeURIComponent(`Olá, ${ong.nome}! Vi o perfil de vocês na Rede ADota.`)}`}
            target='_blank'
            rel='noreferrer'
            className='flex items-center justify-center gap-2 border border-line hover:border-brand-500 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap'
          >
            <FaWhatsapp className='text-forest-700' /> Ver no WhatsApp
          </a>
        )}
      </div>

      {/* Abas */}
      <div className='flex items-center gap-6 border-b border-line mt-6 mb-6'>
        {abas.map((item) => (
          <button
            key={item}
            onClick={() => setAba(item)}
            className={`flex items-center gap-2 pb-3 text-sm transition-colors cursor-pointer ${aba === item ? 'text-forest-800 font-medium border-b-2 border-brand-500' : 'text-muted hover:text-ink'}`}
          >
            {item}
            {item === 'Animais' && <span className='bg-brand-50 text-brand-600 text-[10px] font-semibold px-1.5 py-0.5 rounded'>{animaisDaOng.length}</span>}
            {item === 'Eventos' && <span className='bg-brand-50 text-brand-600 text-[10px] font-semibold px-1.5 py-0.5 rounded'>{eventosDaOng.length}</span>}
          </button>
        ))}
      </div>

      {/* SOBRE */}
      {aba === 'Sobre' && (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>

          <div className='lg:col-span-2 flex flex-col gap-5'>

            {editando ? (
              <form onSubmit={salvar} className='bg-white border border-line rounded-xl p-5'>
                <p className='font-display font-semibold text-forest-800 mb-4'>Editar informações</p>

                <div className='flex flex-col gap-4'>
                  <Campo
                    id='descricao' rotulo='SOBRE A ONG' textarea
                    value={rascunho.descricao}
                    onChange={(e) => setRascunho({ ...rascunho, descricao: e.target.value })}
                  />

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <Campo
                      id='telefone' rotulo='TELEFONE' value={rascunho.telefone}
                      onChange={(e) => setRascunho({ ...rascunho, telefone: e.target.value })}
                    />
                    <Campo
                      id='email' rotulo='E-MAIL' type='email' value={rascunho.email}
                      onChange={(e) => setRascunho({ ...rascunho, email: e.target.value })}
                    />
                  </div>

                  <Campo
                    id='endereco' rotulo='ENDEREÇO' value={rascunho.endereco}
                    onChange={(e) => setRascunho({ ...rascunho, endereco: e.target.value })}
                  />

                  <Campo
                    id='responsavel' rotulo='RESPONSÁVEL' value={rascunho.responsavel}
                    onChange={(e) => setRascunho({ ...rascunho, responsavel: e.target.value })}
                  />

                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <Campo
                      id='instagram' rotulo='INSTAGRAM' value={rascunho.instagram}
                      onChange={(e) => setRascunho({ ...rascunho, instagram: e.target.value })}
                    />
                    <Campo
                      id='facebook' rotulo='FACEBOOK' value={rascunho.facebook}
                      onChange={(e) => setRascunho({ ...rascunho, facebook: e.target.value })}
                    />
                    <Campo
                      id='site' rotulo='SITE' value={rascunho.site}
                      onChange={(e) => setRascunho({ ...rascunho, site: e.target.value })}
                    />
                  </div>
                </div>

                <div className='flex items-center justify-end gap-3 mt-5'>
                  <button
                    type='button'
                    onClick={() => setEditando(false)}
                    className='border border-line hover:border-brand-500 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer'
                  >
                    Cancelar
                  </button>
                  <button
                    type='submit'
                    className='bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer'
                  >
                    Salvar alterações
                  </button>
                </div>
              </form>
            ) : (
              <div className='bg-white border border-line rounded-xl p-5'>
                <div className='flex items-center gap-2 mb-3'>
                  <FaPaw className='text-brand-500 text-xs' />
                  <p className='font-display font-semibold text-forest-800'>Sobre a ONG</p>
                </div>

                <p className='text-sm text-muted leading-relaxed'>{ong.descricao}</p>

                <div className='flex flex-wrap gap-x-8 gap-y-2 mt-5'>
                  {ong.atuacao.map((item) => (
                    <span key={item} className='flex items-center gap-2 text-sm text-ink'>
                      <span className='w-1.5 h-1.5 rounded-full bg-brand-500'></span>
                      {item}
                    </span>
                  ))}
                </div>

                <div className='border border-line rounded-lg p-4 mt-5'>
                  <p className='text-sm font-medium text-forest-800 mb-3'>Nossas redes sociais</p>
                  <div className='flex flex-col gap-2 text-sm text-muted'>
                    <span className='flex items-center gap-2'><FaInstagram className='text-brand-500' /> {ong.redes.instagram}</span>
                    <span className='flex items-center gap-2'><FaFacebook className='text-brand-500' /> {ong.redes.facebook}</span>
                    <span className='flex items-center gap-2'><FaGlobe className='text-brand-500' /> {ong.redes.site}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Chamada para adotar e doar */}
            <div className='bg-white border border-line rounded-xl p-5'>
              <div className='flex items-center gap-3'>
                <FaPaw className='text-brand-500 text-xl' />
                <div>
                  <p className='font-display text-xl font-bold text-forest-800'>Juntos por eles</p>
                  <p className='text-sm text-muted'>Aqui você encontra, adota, apoia e faz a diferença.</p>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5'>
                <div className='bg-forest-50 rounded-xl p-5 flex flex-col'>
                  <FaHeart className='text-brand-500 text-2xl' />
                  <p className='font-display text-lg font-bold text-forest-800 mt-3'>Adotar</p>
                  <p className='text-sm text-muted mt-1'>Encontre seu novo amigo e dê um lar cheio de amor.</p>
                  <button
                    onClick={() => setAba('Animais')}
                    className='flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors mt-4 cursor-pointer'
                  >
                    Ver animais disponíveis <FaArrowRight className='text-xs' />
                  </button>
                </div>

                <div className='bg-brand-50 rounded-xl p-5 flex flex-col'>
                  <FaHandHoldingHeart className='text-brand-500 text-2xl' />
                  <p className='font-display text-lg font-bold text-forest-800 mt-3'>Doar animal</p>
                  <p className='text-sm text-muted mt-1'>Precisa encaminhar um animal? A ONG avalia cada pedido.</p>
                  <button
                    onClick={() => navigate(`/ongs/${ong._id}/doar`)}
                    className='flex items-center justify-center gap-2 border border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors mt-4 cursor-pointer'
                  >
                    <FaFileLines className='text-xs' /> Acessar formulário
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna lateral */}
          <div className='flex flex-col gap-5'>

            <div className='bg-white border border-line rounded-xl p-5'>
              <p className='font-display font-semibold text-forest-800'>Apoie nosso trabalho</p>
              <p className='text-xs text-muted mt-1'>
                Faça uma doação e contribua para continuarmos salvando vidas.
              </p>

              <div className='border border-dashed border-line rounded-lg p-6 mt-4 flex flex-col items-center'>
                <FaQrcode className='text-forest-300 text-5xl' />
                <p className='text-[11px] text-muted text-center mt-3'>
                  A ONG ainda não cadastrou uma chave Pix ou QR Code.
                </p>
              </div>
            </div>

            <div className='bg-white border border-line rounded-xl p-5'>
              <div className='flex items-center gap-2 mb-4'>
                <FaShieldHalved className='text-brand-500 text-xs' />
                <p className='font-display font-semibold text-forest-800'>Informações institucionais</p>
              </div>

              <div className='flex flex-col gap-3 text-sm'>
                <div>
                  <p className='text-[11px] text-muted'>Nome da instituição</p>
                  <p className='text-forest-800'>{ong.nome}</p>
                </div>
                <div>
                  <p className='text-[11px] text-muted'>CNPJ</p>
                  <p className='text-forest-800'>{formatarCnpj(ong.cnpj)}</p>
                </div>
                <div>
                  <p className='text-[11px] text-muted'>Endereço</p>
                  <p className='text-forest-800'>{ong.endereco}</p>
                </div>
                <div>
                  <p className='text-[11px] text-muted'>Responsável</p>
                  <p className='text-forest-800'>{ong.responsavel}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANIMAIS */}
      {aba === 'Animais' && (
        <div>
          <div className='flex flex-wrap items-center justify-between gap-3 mb-5'>
            <p className='text-sm text-muted'>
              {animaisDaOng.length} {animaisDaOng.length === 1 ? 'animal disponível' : 'animais disponíveis'} nesta ONG
            </p>

            {ehDona && (
              <button
                onClick={() => emBreve('O cadastro de animais')}
                className='flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer'
              >
                <FaPlus className='text-xs' /> Cadastrar animal
              </button>
            )}
          </div>

          {animaisDaOng.length === 0 ? (
            <p className='text-sm text-muted py-10 text-center'>Nenhum animal cadastrado por esta ONG.</p>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {animaisDaOng.map((pet) => <PetCard key={pet._id} pet={pet} />)}
            </div>
          )}
        </div>
      )}

      {/* EVENTOS */}
      {aba === 'Eventos' && (
        <div>
          <div className='flex flex-wrap items-center justify-between gap-3 mb-5'>
            <p className='text-sm text-muted'>
              {eventosDaOng.length} {eventosDaOng.length === 1 ? 'evento organizado' : 'eventos organizados'} por esta ONG
            </p>

            {ehDona && (
              <button
                onClick={() => navigate('/eventos/novo')}
                className='flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer'
              >
                <FaPlus className='text-xs' /> Criar evento
              </button>
            )}
          </div>

          {eventosDaOng.length === 0 ? (
            <p className='text-sm text-muted py-10 text-center'>Nenhum evento cadastrado por esta ONG.</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
              {eventosDaOng.map((evento) => <EventoCard key={evento._id} evento={evento} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Ong
