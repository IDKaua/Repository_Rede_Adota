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

const formatarCnpj = (valor = '') => {
  const v = String(valor).replace(/\D/g, '');
  if (v.length !== 14) return valor;
  return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

// Funções auxiliares para cor e sigla
const gerarSigla = (nome) => {
  if (!nome) return 'ON';
  const palavras = nome.split(' ');
  if (palavras.length >= 2) return (palavras[0][0] + palavras[1][0]).toUpperCase();
  return nome.substring(0, 2).toUpperCase();
};

const obterCor = (id) => {
  const cores = ['bg-brand-500', 'bg-forest-500', 'bg-blue-500', 'bg-orange-500', 'bg-purple-500'];
  return cores[(id || 0) % cores.length];
};

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

  // O ID que vem do React Router é string, mas no PostgreSQL é número
  const ong = buscarOng(Number(ongId));

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
        <p className='text-sm text-muted'>ONG não encontrada ou a carregar dados.</p>
        <Link to='/ongs' className='inline-block mt-4 text-sm font-medium text-brand-600 hover:text-brand-700'>
          Voltar para a lista de ONGs
        </Link>
      </div>
    )
  }

  // A ONG só edita o próprio perfil (compara os IDs numéricos)
  const ehDona = ongLogada?.id === ong.id;

  // Filtra os relacionamentos com o novo padrão (id_ong em vez de ong)
  const animaisDaOng = pets.filter((pet) => pet.id_ong === ong.id);
  const eventosDaOng = eventos.filter((evento) => evento.id_ong === ong.id);

  // Garante que existe um array de atuação (mesmo que o banco ainda não tenha este campo)
  const atuacao = ong.atuacao || ['Proteção Animal', 'Resgate'];

  const abrirEdicao = () => {
    setRascunho({
      descricao: ong.descricao || '',
      telefone: ong.telefone || '',
      email: ong.email || '',
      endereco: ong.endereco || `${ong.rua || ''}, ${ong.numero || ''}`.trim() || '',
      responsavel: ong.responsavel || '',
      instagram: ong.instagram || '',
      facebook: ong.facebook || '',
      site: ong.site || '',
    });
    setAba('Sobre');
    setEditando(true);
  }

  const salvar = (e) => {
    e.preventDefault();
    // Envia os dados para a função do Contexto (que futuramente fará o PUT para a API)
    atualizarOng(ong.id, rascunho);
    setEditando(false);
  }

  const emBreve = (acao) => toast.info(`${acao} estará disponível em breve.`);

  // Formata o número para o link do WhatsApp (apenas números)
  const numeroWhats = ong.telefone ? String(ong.telefone).replace(/\D/g, '') : '';

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto'>

      <Link to='/ongs' className='inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-5'>
        <FaArrowLeft className='text-xs' /> Voltar para as ONGs
      </Link>

      {/* Cabeçalho */}
      <div className='bg-white border border-line rounded-xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-5'>

        <div className={`w-20 h-20 rounded-xl ${obterCor(ong.id)} text-white font-display text-2xl font-bold flex items-center justify-center shrink-0 shadow-sm`}>
          {gerarSigla(ong.nome)}
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='font-display text-2xl sm:text-3xl font-bold text-forest-800'>{ong.nome}</h1>
            
            {/* Podemos assumir que se está no banco, foi validada, ou usar uma coluna futura "status" */}
            <span className='flex items-center gap-1.5 bg-forest-50 text-forest-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-forest-100'>
              <FaCircleCheck className='text-aprovado' /> ONG verificada
            </span>
          </div>

          <p className='text-sm text-muted leading-relaxed mt-2 max-w-3xl line-clamp-2'>
            {ong.descricao || 'Instituição de proteção e bem-estar animal parceira da Rede ADota.'}
          </p>

          <div className='flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-xs text-muted'>
            <span className='flex items-center gap-1.5'><FaLocationDot className='text-brand-500' /> {ong.cidade ? `${ong.cidade} - ${ong.uf}` : 'Local não informado'}</span>
            <span className='flex items-center gap-1.5'><FaPhone className='text-brand-500' /> {ong.telefone || 'Não informado'}</span>
            <span className='flex items-center gap-1.5'><FaEnvelope className='text-brand-500' /> {ong.email}</span>
          </div>
        </div>

        {/* Ação principal muda conforme quem está vendo */}
        {ehDona ? (
          <button
            onClick={abrirEdicao}
            className='flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm'
          >
            <FaPencil className='text-xs' /> Editar perfil
          </button>
        ) : (
          <a
            href={`https://wa.me/${numeroWhats}?text=${encodeURIComponent(`Olá, ${ong.nome}! Vi o perfil de vocês na Rede ADota.`)}`}
            target='_blank'
            rel='noreferrer'
            className='flex items-center justify-center gap-2 border border-line hover:border-brand-500 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap bg-surface'
          >
            <FaWhatsapp className='text-forest-700 text-lg' /> Ver no WhatsApp
          </a>
        )}
      </div>

      {/* Abas */}
      <div className='flex items-center gap-6 border-b border-line mt-6 mb-6 overflow-x-auto'>
        {abas.map((item) => (
          <button
            key={item}
            onClick={() => setAba(item)}
            className={`flex items-center gap-2 pb-3 text-sm transition-colors cursor-pointer whitespace-nowrap ${aba === item ? 'text-forest-800 font-medium border-b-2 border-brand-500' : 'text-muted hover:text-ink'}`}
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
              <form onSubmit={salvar} className='bg-white border border-line rounded-xl p-5 shadow-sm'>
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
                    id='endereco' rotulo='ENDEREÇO COMPLETO' value={rascunho.endereco}
                    onChange={(e) => setRascunho({ ...rascunho, endereco: e.target.value })}
                  />

                  <Campo
                    id='responsavel' rotulo='RESPONSÁVEL' value={rascunho.responsavel}
                    onChange={(e) => setRascunho({ ...rascunho, responsavel: e.target.value })}
                  />

                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <Campo
                      id='instagram' rotulo='INSTAGRAM' placeholder="@usuario" value={rascunho.instagram}
                      onChange={(e) => setRascunho({ ...rascunho, instagram: e.target.value })}
                    />
                    <Campo
                      id='facebook' rotulo='FACEBOOK' placeholder="/pagina" value={rascunho.facebook}
                      onChange={(e) => setRascunho({ ...rascunho, facebook: e.target.value })}
                    />
                    <Campo
                      id='site' rotulo='SITE' placeholder="www.site.com" value={rascunho.site}
                      onChange={(e) => setRascunho({ ...rascunho, site: e.target.value })}
                    />
                  </div>
                </div>

                <div className='flex items-center justify-end gap-3 mt-6 pt-4 border-t border-line'>
                  <button
                    type='button'
                    onClick={() => setEditando(false)}
                    className='border border-line hover:border-brand-500 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer bg-surface'
                  >
                    Cancelar
                  </button>
                  <button
                    type='submit'
                    className='bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm'
                  >
                    Salvar alterações
                  </button>
                </div>
              </form>
            ) : (
              <div className='bg-white border border-line rounded-xl p-5 shadow-sm'>
                <div className='flex items-center gap-2 mb-4'>
                  <FaPaw className='text-brand-500 text-sm' />
                  <p className='font-display font-semibold text-forest-800 text-lg'>Sobre a ONG</p>
                </div>

                <p className='text-sm text-muted leading-relaxed whitespace-pre-wrap'>{ong.descricao || 'Nenhuma descrição fornecida.'}</p>

                <div className='flex flex-wrap gap-x-6 gap-y-3 mt-6 pt-5 border-t border-line'>
                  {atuacao.map((item) => (
                    <span key={item} className='flex items-center gap-2 text-sm font-medium text-ink bg-surface px-3 py-1.5 rounded-lg border border-line'>
                      <span className='w-2 h-2 rounded-full bg-brand-500'></span>
                      {item}
                    </span>
                  ))}
                </div>

                {(ong.instagram || ong.facebook || ong.site) && (
                  <div className='bg-surface border border-line rounded-xl p-4 mt-6'>
                    <p className='text-sm font-medium text-forest-800 mb-3'>Nossas redes</p>
                    <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-muted'>
                      {ong.instagram && <span className='flex items-center gap-2'><FaInstagram className='text-brand-500 text-lg' /> {ong.instagram}</span>}
                      {ong.facebook && <span className='flex items-center gap-2'><FaFacebook className='text-brand-500 text-lg' /> {ong.facebook}</span>}
                      {ong.site && <span className='flex items-center gap-2'><FaGlobe className='text-brand-500 text-lg' /> {ong.site}</span>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Chamada para adotar e doar */}
            <div className='bg-white border border-line rounded-xl p-5 shadow-sm'>
              <div className='flex items-center gap-3'>
                <div className='bg-brand-50 w-12 h-12 rounded-full flex items-center justify-center'>
                  <FaHeart className='text-brand-500 text-xl' />
                </div>
                <div>
                  <p className='font-display text-xl font-bold text-forest-800'>Juntos por eles</p>
                  <p className='text-sm text-muted'>Aqui você encontra, adota, apoia e faz a diferença.</p>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6'>
                <div className='bg-forest-50 border border-forest-100 rounded-xl p-5 flex flex-col'>
                  <p className='font-display text-lg font-bold text-forest-800'>Adotar</p>
                  <p className='text-sm text-forest-700/80 mt-1 mb-4 flex-1'>Encontre seu novo amigo e dê um lar cheio de amor.</p>
                  <button
                    onClick={() => setAba('Animais')}
                    className='flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer w-full'
                  >
                    Ver animais <FaArrowRight className='text-xs' />
                  </button>
                </div>

                <div className='bg-brand-50 border border-brand-100 rounded-xl p-5 flex flex-col'>
                  <p className='font-display text-lg font-bold text-forest-800'>Doar animal</p>
                  <p className='text-sm text-forest-700/80 mt-1 mb-4 flex-1'>Precisa encaminhar um animal? Avaliamos cada pedido.</p>
                  <button
                    onClick={() => navigate(`/ongs/${ong.id}/doar`)}
                    className='flex items-center justify-center gap-2 bg-white border border-brand-200 text-brand-600 hover:border-brand-500 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer w-full'
                  >
                    <FaFileLines className='text-xs' /> Formulário
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna lateral */}
          <div className='flex flex-col gap-5'>

            <div className='bg-forest-800 text-white rounded-xl p-6 shadow-sm relative overflow-hidden'>
              <div className='relative z-10'>
                <p className='font-display font-bold text-lg'>Apoie nosso trabalho</p>
                <p className='text-xs text-white/80 mt-1 leading-relaxed'>
                  Faça uma doação e contribua para continuarmos salvando vidas.
                </p>

                <div className='bg-white/10 border border-white/20 rounded-lg p-6 mt-5 flex flex-col items-center backdrop-blur-sm'>
                  <FaQrcode className='text-white/60 text-5xl mb-3' />
                  <p className='text-[11px] text-white/80 text-center'>
                    Chave Pix em breve.
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-white border border-line rounded-xl p-5 shadow-sm'>
              <div className='flex items-center gap-2 mb-5'>
                <FaShieldHalved className='text-brand-500 text-sm' />
                <p className='font-display font-semibold text-forest-800'>Dados Institucionais</p>
              </div>

              <div className='flex flex-col gap-4 text-sm'>
                <div>
                  <p className='text-[10px] text-muted font-bold tracking-wider uppercase mb-0.5'>Instituição</p>
                  <p className='text-forest-800 font-medium'>{ong.nome}</p>
                </div>
                <div>
                  <p className='text-[10px] text-muted font-bold tracking-wider uppercase mb-0.5'>CNPJ</p>
                  <p className='text-forest-800 font-medium'>{formatarCnpj(ong.cnpj)}</p>
                </div>
                <div>
                  <p className='text-[10px] text-muted font-bold tracking-wider uppercase mb-0.5'>Endereço Registado</p>
                  <p className='text-forest-800 font-medium'>{ong.rua || 'Rua não informada'}, {ong.numero || 'S/N'} - {ong.bairro}</p>
                  <p className='text-forest-800 font-medium'>{ong.cidade} - {ong.uf}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANIMAIS */}
      {aba === 'Animais' && (
        <div>
          <div className='flex flex-wrap items-center justify-between gap-3 mb-6 bg-surface border border-line rounded-xl p-4'>
            <p className='text-sm text-forest-800 font-medium'>
              <span className='text-brand-600 font-bold'>{animaisDaOng.length}</span> {animaisDaOng.length === 1 ? 'animal disponível' : 'animais disponíveis'} nesta ONG
            </p>

            {ehDona && (
              <button
                onClick={() => navigate('/animais/novo')}
                className='flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm'
              >
                <FaPlus className='text-xs' /> Cadastrar animal
              </button>
            )}
          </div>

          {animaisDaOng.length === 0 ? (
            <div className='bg-white border border-dashed border-line rounded-2xl py-16 flex flex-col items-center justify-center text-center'>
              <FaPaw className='text-line text-4xl mb-3' />
              <p className='text-forest-800 font-medium'>Nenhum animal disponível</p>
              <p className='text-sm text-muted mt-1'>Esta ONG ainda não cadastrou animais para adoção.</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
              {/* O PetCard agora usa id */}
              {animaisDaOng.map((pet) => <PetCard key={pet.id} pet={pet} />)}
            </div>
          )}
        </div>
      )}

      {/* EVENTOS */}
      {aba === 'Eventos' && (
        <div>
          <div className='flex flex-wrap items-center justify-between gap-3 mb-6 bg-surface border border-line rounded-xl p-4'>
            <p className='text-sm text-forest-800 font-medium'>
              <span className='text-brand-600 font-bold'>{eventosDaOng.length}</span> {eventosDaOng.length === 1 ? 'evento organizado' : 'eventos organizados'} por esta ONG
            </p>

            {ehDona && (
              <button
                onClick={() => emBreve('Criação de Eventos')}
                className='flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm'
              >
                <FaPlus className='text-xs' /> Criar evento
              </button>
            )}
          </div>

          {eventosDaOng.length === 0 ? (
            <div className='bg-white border border-dashed border-line rounded-2xl py-16 flex flex-col items-center justify-center text-center'>
               <div className='bg-surface w-12 h-12 rounded-full flex items-center justify-center mb-3'>
                 <FaQrcode className='text-muted text-xl' />
               </div>
              <p className='text-forest-800 font-medium'>Nenhum evento agendado</p>
              <p className='text-sm text-muted mt-1'>A ONG não possui campanhas ou eventos ativos no momento.</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
              {/* EventoCard também vai precisar de usar id futuramente */}
              {eventosDaOng.map((evento) => <EventoCard key={evento.id || evento._id} evento={evento} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Ong