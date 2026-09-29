import React, { useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaArrowLeft, FaCircleCheck, FaPaw, FaWhatsapp } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { AdocaoContext } from '../context/AdocaoContext'
import formularioImagem from '../assets/logo.png'

const Campo = ({ id, rotulo, erro, textarea, opcoes, className = '', ...props }) => {
  const estilo = `w-full bg-white border rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted ${erro ? 'border-recusado' : 'border-line focus:border-forest-500'}`;

  return (
    <div className={className}>
      <label htmlFor={id} className='block text-xs font-medium text-muted mb-1.5'>{rotulo}</label>

      {opcoes
        ? (
          <select id={id} className={`${estilo} cursor-pointer`} {...props}>
            <option value=''>Selecione uma opção</option>
            {opcoes.map((opcao) => <option key={opcao} value={opcao}>{opcao}</option>)}
          </select>
        )
        : textarea
          ? <textarea id={id} rows={4} className={estilo} {...props} />
          : <input id={id} className={estilo} {...props} />}

      {erro && <p className='text-xs text-recusado mt-1.5'>{erro}</p>}
    </div>
  )
}

const mascaraCpf = (valor) => valor.replace(/\D/g, '').slice(0, 11)
  .replace(/^(\d{3})(\d)/, '$1.$2')
  .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
  .replace(/\.(\d{3})(\d)/, '.$1-$2');

const mascaraTelefone = (valor) => valor.replace(/\D/g, '').slice(0, 11)
  .replace(/^(\d{2})(\d)/, '($1) $2')
  .replace(/(\d{5})(\d)/, '$1-$2');

const camposVazios = {
  nome: '', cpf: '', telefone: '', email: '',
  moradia: '', quintal: '', outrosAnimais: '',
  motivo: '', tempo: '', acompanhamento: '', observacoes: '',
};

const Adotar = () => {

  const { petId } = useParams();
  const { pets, buscarOng, enviarSolicitacao } = useContext(AdocaoContext);

  const pet = pets.find((item) => item._id === petId);

  const [dados, setDados] = useState(camposVazios);
  const [erros, setErros] = useState({});
  const [aceite, setAceite] = useState(false);
  const [enviada, setEnviada] = useState(false);

  if (!pet) {
    return (
      <div className='min-h-screen bg-surface flex items-center justify-center px-6 text-center'>
        <div>
          <p className='text-sm text-muted'>Animal não encontrado.</p>
          <Link to='/animais' className='inline-block mt-4 text-sm font-medium text-brand-600 hover:text-brand-700'>
            Ver animais disponíveis
          </Link>
        </div>
      </div>
    )
  }

  const ong = buscarOng(pet.ong);

  const alterar = (campo, valor) => {
    setDados((anterior) => ({ ...anterior, [campo]: valor }));
    if (erros[campo]) setErros((anterior) => ({ ...anterior, [campo]: '' }));
  }

  const validar = () => {
    const novos = {};

    if (dados.nome.trim().split(' ').length < 2) novos.nome = 'Informe o nome completo.';
    if (dados.cpf.replace(/\D/g, '').length !== 11) novos.cpf = 'Informe um CPF com 11 dígitos.';
    if (dados.telefone.replace(/\D/g, '').length < 10) novos.telefone = 'Informe um telefone com DDD.';
    if (!/^\S+@\S+\.\S+$/.test(dados.email)) novos.email = 'Informe um e-mail válido.';
    if (!dados.moradia) novos.moradia = 'Selecione o tipo de moradia.';
    if (!dados.quintal) novos.quintal = 'Selecione uma opção.';
    if (!dados.outrosAnimais.trim()) novos.outrosAnimais = 'Conte se você já tem outros animais.';
    if (dados.motivo.trim().length < 20) novos.motivo = 'Conte o motivo com pelo menos 20 caracteres.';
    if (!dados.tempo) novos.tempo = 'Selecione o tempo disponível.';
    if (!dados.acompanhamento) novos.acompanhamento = 'Selecione uma opção.';

    setErros(novos);
    return Object.keys(novos).length === 0;
  }

  const enviar = (e) => {
    e.preventDefault();

    if (!validar()) {
      toast.error('Confira os campos destacados antes de enviar.');
      return;
    }

    if (!aceite) {
      toast.error('É preciso aceitar os termos para enviar a solicitação.');
      return;
    }

    enviarSolicitacao(pet, dados);
    setEnviada(true);
    window.scrollTo(0, 0);
  }

  return (
    <div className='min-h-screen bg-surface'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 py-8'>

        <Link to={`/animais/${pet._id}`} className='inline-flex items-center gap-2 text-sm text-muted hover:text-ink'>
          <FaArrowLeft className='text-xs' /> Voltar para {pet.nome}
        </Link>

        {/* Cabeçalho */}
        <div className='bg-forest-800 text-white rounded-2xl p-6 sm:p-8 mt-5 flex items-center justify-between gap-5'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <FaPaw className='text-brand-500 text-xs' />
              <p className='text-[11px] font-semibold tracking-wider text-brand-500'>DÊ UM NOVO LAR A UM COMPANHEIRO</p>
            </div>
            <h1 className='font-display text-2xl sm:text-3xl font-bold'>Encontre seu novo melhor amigo</h1>
            <p className='text-sm text-white/70 mt-1'>
              As informações vão apenas para a ONG responsável pelo animal.
            </p>
          </div>

          <img
            src={formularioImagem}
            alt='Cachorro e gato'
            className='hidden sm:block w-24 h-24 object-cover rounded-xl shrink-0 bg-white'
          />
        </div>

        <div className='py-5'>

          {/* Resumo do animal escolhido */}
          <div className='bg-white border border-line rounded-xl p-4 flex items-center gap-4'>
            <img src={pet.imagem} alt={pet.nome} className='w-20 h-20 object-cover rounded-lg' />
            <div className='min-w-0'>
              <p className='text-[11px] text-muted'>Solicitação de adoção para</p>
              <p className='font-display text-xl font-bold text-forest-800'>{pet.nome}</p>
              <p className='text-xs text-muted truncate'>
                {pet.especie} • {pet.raca} • {pet.idade} — {ong.nome}
              </p>
            </div>
          </div>

          {enviada ? (
            /* Confirmação, no lugar do formulário */
            <div className='bg-white border border-line rounded-xl p-8 mt-5 text-center'>
              <FaCircleCheck className='text-aprovado text-4xl mx-auto' />
              <p className='font-display text-2xl font-bold text-forest-800 mt-4'>Solicitação enviada!</p>
              <p className='text-sm text-muted leading-relaxed mt-2 max-w-md mx-auto'>
                A <span className='font-medium text-forest-800'>{ong.nome}</span> recebeu seu pedido de adoção
                do {pet.nome}. A equipe analisa as informações e responde pelo telefone ou e-mail que você
                informou. O status da solicitação começa como <span className='font-medium text-forest-800'>Solicitado</span>.
              </p>

              <div className='flex flex-wrap items-center justify-center gap-3 mt-6'>
                <Link
                  to='/animais'
                  className='bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors'
                >
                  Ver outros animais
                </Link>
                <a
                  href={`https://wa.me/${ong.whatsapp}?text=${encodeURIComponent(`Olá! Acabei de enviar uma solicitação de adoção do(a) ${pet.nome} pela Rede ADota.`)}`}
                  target='_blank'
                  rel='noreferrer'
                  className='flex items-center gap-2 border border-line hover:border-brand-500 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors'
                >
                  <FaWhatsapp className='text-forest-700' /> Falar com a ONG
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={enviar} noValidate className='bg-white border border-line rounded-xl p-6 sm:p-8 mt-5 flex flex-col gap-6'>

              {/* Dados pessoais */}
              <section>
                <h2 className='font-display font-semibold text-forest-800 border-b border-line pb-2 mb-4'>
                  1. Seus dados
                </h2>

                <div className='flex flex-col gap-4'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <Campo
                      id='nome' rotulo='NOME COMPLETO' type='text' placeholder='Digite seu nome' erro={erros.nome}
                      value={dados.nome} onChange={(e) => alterar('nome', e.target.value)}
                    />
                    <Campo
                      id='cpf' rotulo='CPF' type='text' inputMode='numeric' placeholder='000.000.000-00'
                      maxLength={14} erro={erros.cpf}
                      value={dados.cpf} onChange={(e) => alterar('cpf', mascaraCpf(e.target.value))}
                    />
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <Campo
                      id='telefone' rotulo='TELEFONE / WHATSAPP' type='text' inputMode='tel'
                      placeholder='(00) 00000-0000' maxLength={15} erro={erros.telefone}
                      value={dados.telefone} onChange={(e) => alterar('telefone', mascaraTelefone(e.target.value))}
                    />
                    <Campo
                      id='email' rotulo='E-MAIL' type='email' autoComplete='email'
                      placeholder='seuemail@exemplo.com' erro={erros.email}
                      value={dados.email} onChange={(e) => alterar('email', e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Moradia */}
              <section>
                <h2 className='font-display font-semibold text-forest-800 border-b border-line pb-2 mb-4'>
                  2. Sua moradia
                </h2>

                <div className='flex flex-col gap-4'>
                  <Campo
                    id='moradia' rotulo='TIPO DE MORADIA' erro={erros.moradia}
                    opcoes={['Casa', 'Apartamento', 'Sítio ou chácara']}
                    value={dados.moradia} onChange={(e) => alterar('moradia', e.target.value)}
                  />

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <Campo
                      id='quintal' rotulo='POSSUI QUINTAL?' erro={erros.quintal}
                      opcoes={['Sim, cercado', 'Sim, sem cerca', 'Não']}
                      value={dados.quintal} onChange={(e) => alterar('quintal', e.target.value)}
                    />
                    <Campo
                      id='outrosAnimais' rotulo='POSSUI OUTROS ANIMAIS?' type='text' erro={erros.outrosAnimais}
                      placeholder='Ex: 1 gata castrada e vacinada'
                      value={dados.outrosAnimais} onChange={(e) => alterar('outrosAnimais', e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Rotina */}
              <section>
                <h2 className='font-display font-semibold text-forest-800 border-b border-line pb-2 mb-4'>
                  3. Rotina e cuidados
                </h2>

                <div className='flex flex-col gap-4'>
                  <Campo
                    id='motivo' rotulo='MOTIVO DA ADOÇÃO' textarea erro={erros.motivo}
                    placeholder={`Conte por que você quer adotar o(a) ${pet.nome} e como será a rotina dele(a) na sua casa...`}
                    value={dados.motivo} onChange={(e) => alterar('motivo', e.target.value)}
                  />

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <Campo
                      id='tempo' rotulo='TEMPO DISPONÍVEL POR DIA' erro={erros.tempo}
                      opcoes={['Período integral em casa', 'Meio período', 'Algumas horas por dia']}
                      value={dados.tempo} onChange={(e) => alterar('tempo', e.target.value)}
                    />
                    <Campo
                      id='acompanhamento' rotulo='ACEITA ACOMPANHAMENTO PÓS-ADOÇÃO?' erro={erros.acompanhamento}
                      opcoes={['Sim', 'Não']}
                      value={dados.acompanhamento} onChange={(e) => alterar('acompanhamento', e.target.value)}
                    />
                  </div>

                  <Campo
                    id='observacoes' rotulo='OBSERVAÇÕES (OPCIONAL)' textarea rows={3}
                    placeholder='Fale um pouco mais sobre você e sua casa...'
                    value={dados.observacoes} onChange={(e) => alterar('observacoes', e.target.value)}
                  />
                </div>
              </section>

              <label className='flex items-start gap-2 text-sm text-muted cursor-pointer'>
                <input
                  type='checkbox'
                  checked={aceite}
                  onChange={(e) => setAceite(e.target.checked)}
                  className='mt-1 accent-brand-500 cursor-pointer'
                />
                Concordo que meus dados sejam enviados para a {ong.nome} com o objetivo de analisar
                esta adoção, e confirmo que as informações são verdadeiras.
              </label>

              <button
                type='submit'
                className='w-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium py-3.5 rounded-lg transition-colors cursor-pointer'
              >
                Enviar solicitação de adoção
              </button>

              <p className='text-xs text-muted text-center -mt-3'>
                O envio não garante a adoção: a ONG entra em contato para conversar antes de aprovar.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Adotar
