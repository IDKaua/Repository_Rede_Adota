import React, { useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaArrowLeft, FaCircleCheck, FaPaw, FaWhatsapp } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { AdocaoContext } from '../context/AdocaoContext'
import { assets } from '../assets/assets'

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

const vacinasComuns = ['Raiva', 'V8/V10', 'V4 felina'];

const camposVazios = {
  nome: '', cpf: '', email: '', telefone: '', endereco: '',
  animal: '', especie: '', raca: '', idade: '', sexo: '', outrasVacinas: '', descricao: '',
};

const Doar = () => {

  const { ongId } = useParams();
  const { buscarOng, enviarDoacao } = useContext(AdocaoContext);

  const ong = buscarOng(ongId);

  const [dados, setDados] = useState(camposVazios);
  const [vacinas, setVacinas] = useState([]);
  const [erros, setErros] = useState({});
  const [aceite, setAceite] = useState(false);
  const [enviado, setEnviado] = useState(false);

  if (!ong) {
    return (
      <div className='min-h-screen bg-surface flex items-center justify-center px-6 text-center'>
        <div>
          <p className='text-sm text-muted'>ONG não encontrada.</p>
          <Link to='/ongs' className='inline-block mt-4 text-sm font-medium text-brand-600 hover:text-brand-700'>
            Ver ONGs parceiras
          </Link>
        </div>
      </div>
    )
  }

  const alterar = (campo, valor) => {
    setDados((anterior) => ({ ...anterior, [campo]: valor }));
    if (erros[campo]) setErros((anterior) => ({ ...anterior, [campo]: '' }));
  }

  const alternarVacina = (vacina) => {
    setVacinas(vacinas.includes(vacina)
      ? vacinas.filter((item) => item !== vacina)
      : [...vacinas, vacina]);
  }

  const validar = () => {
    const novos = {};

    if (dados.nome.trim().split(' ').length < 2) novos.nome = 'Informe o nome completo.';
    if (dados.cpf.replace(/\D/g, '').length !== 11) novos.cpf = 'Informe um CPF com 11 dígitos.';
    if (!/^\S+@\S+\.\S+$/.test(dados.email)) novos.email = 'Informe um e-mail válido.';
    if (dados.telefone.replace(/\D/g, '').length < 10) novos.telefone = 'Informe um telefone com DDD.';
    if (!dados.endereco.trim()) novos.endereco = 'Informe o endereço completo.';

    if (!dados.animal.trim()) novos.animal = 'Informe o nome do animal.';
    if (!dados.especie) novos.especie = 'Selecione a espécie.';
    if (!dados.raca.trim()) novos.raca = 'Informe a raça ou SRD.';
    if (!dados.idade.trim()) novos.idade = 'Informe a idade aproximada.';
    if (!dados.sexo) novos.sexo = 'Selecione o sexo.';
    if (dados.descricao.trim().length < 20) novos.descricao = 'Conte um pouco sobre o animal, com pelo menos 20 caracteres.';

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
      toast.error('É preciso aceitar os termos da doação responsável.');
      return;
    }

    enviarDoacao(ong, { ...dados, vacinas });
    setEnviado(true);
    window.scrollTo(0, 0);
  }

  return (
    <div className='min-h-screen bg-surface'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 py-8'>

        <Link to={`/ongs/${ong._id}`} className='inline-flex items-center gap-2 text-sm text-muted hover:text-ink'>
          <FaArrowLeft className='text-xs' /> Voltar para {ong.nome}
        </Link>

        {/* Cabeçalho */}
        <div className='bg-forest-800 text-white rounded-2xl p-6 sm:p-8 mt-5 flex items-center justify-between gap-5'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <FaPaw className='text-brand-500 text-xs' />
              <p className='text-[11px] font-semibold tracking-wider text-brand-500'>DOAÇÃO RESPONSÁVEL</p>
            </div>
            <h1 className='font-display text-2xl sm:text-3xl font-bold'>Um lar cheio de amor</h1>
            <p className='text-sm text-white/70 mt-1'>
              Dê ao seu companheiro a chance de uma nova vida.
            </p>
          </div>

          <img
            src={assets.logo}
            alt='Rede ADota'
            className='hidden sm:block w-24 h-24 object-cover rounded-xl shrink-0'
          />
        </div>

        <div className='py-5'>

          {/* ONG que vai receber o pedido */}
          <div className='bg-white border border-line rounded-xl p-4 flex items-center gap-4'>
            <div className={`w-14 h-14 rounded-xl ${ong.cor} text-white font-display text-lg font-bold flex items-center justify-center shrink-0`}>
              {ong.sigla}
            </div>
            <div className='min-w-0'>
              <p className='text-[11px] text-muted'>Formulário de doação para</p>
              <p className='font-display text-xl font-bold text-forest-800'>{ong.nome}</p>
              <p className='text-xs text-muted truncate'>{ong.local}</p>
            </div>
          </div>

          {enviado ? (
            <div className='bg-white border border-line rounded-xl p-8 mt-5 text-center'>
              <FaCircleCheck className='text-aprovado text-4xl mx-auto' />
              <p className='font-display text-2xl font-bold text-forest-800 mt-4'>Formulário enviado!</p>
              <p className='text-sm text-muted leading-relaxed mt-2 max-w-md mx-auto'>
                A <span className='font-medium text-forest-800'>{ong.nome}</span> recebeu as informações
                do {dados.animal}. A equipe avalia a capacidade de acolhimento e responde pelo telefone
                ou e-mail que você informou.
              </p>

              <div className='flex flex-wrap items-center justify-center gap-3 mt-6'>
                <Link
                  to={`/ongs/${ong._id}`}
                  className='bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors'
                >
                  Voltar para a ONG
                </Link>
                <a
                  href={`https://wa.me/${ong.whatsapp}?text=${encodeURIComponent(`Olá! Acabei de enviar um formulário de doação do(a) ${dados.animal} pela Rede ADota.`)}`}
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

              {/* Doador */}
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
                      id='email' rotulo='E-MAIL' type='email' autoComplete='email'
                      placeholder='seuemail@exemplo.com' erro={erros.email}
                      value={dados.email} onChange={(e) => alterar('email', e.target.value)}
                    />
                    <Campo
                      id='telefone' rotulo='TELEFONE / WHATSAPP' type='text' inputMode='tel'
                      placeholder='(00) 00000-0000' maxLength={15} erro={erros.telefone}
                      value={dados.telefone} onChange={(e) => alterar('telefone', mascaraTelefone(e.target.value))}
                    />
                  </div>

                  <Campo
                    id='endereco' rotulo='ENDEREÇO COMPLETO' type='text' erro={erros.endereco}
                    placeholder='Rua, número, bairro, cidade'
                    value={dados.endereco} onChange={(e) => alterar('endereco', e.target.value)}
                  />
                </div>
              </section>

              {/* Animal */}
              <section>
                <h2 className='font-display font-semibold text-forest-800 border-b border-line pb-2 mb-4'>
                  2. Dados do animal
                </h2>

                <div className='flex flex-col gap-4'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <Campo
                      id='animal' rotulo='NOME DO ANIMAL' type='text' placeholder='Ex: Thor' erro={erros.animal}
                      value={dados.animal} onChange={(e) => alterar('animal', e.target.value)}
                    />
                    <Campo
                      id='especie' rotulo='ESPÉCIE' erro={erros.especie}
                      opcoes={['Cachorro', 'Gato']}
                      value={dados.especie} onChange={(e) => alterar('especie', e.target.value)}
                    />
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <Campo
                      id='raca' rotulo='RAÇA' type='text' placeholder='SRD (Vira-lata)' erro={erros.raca}
                      value={dados.raca} onChange={(e) => alterar('raca', e.target.value)}
                    />
                    <Campo
                      id='idade' rotulo='IDADE' type='text' placeholder='Ex: 2 anos, 6 meses' erro={erros.idade}
                      value={dados.idade} onChange={(e) => alterar('idade', e.target.value)}
                    />
                    <Campo
                      id='sexo' rotulo='SEXO' erro={erros.sexo}
                      opcoes={['Macho', 'Fêmea']}
                      value={dados.sexo} onChange={(e) => alterar('sexo', e.target.value)}
                    />
                  </div>

                  {/* Vacinas */}
                  <div>
                    <p className='text-xs font-medium text-muted mb-2'>VACINAS TOMADAS</p>
                    <div className='flex flex-wrap items-center gap-4'>
                      {vacinasComuns.map((vacina) => (
                        <label key={vacina} className='flex items-center gap-2 text-sm text-ink cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={vacinas.includes(vacina)}
                            onChange={() => alternarVacina(vacina)}
                            className='accent-brand-500 cursor-pointer'
                          />
                          {vacina}
                        </label>
                      ))}

                      <input
                        type='text'
                        placeholder='Outras (especificar)'
                        value={dados.outrasVacinas}
                        onChange={(e) => alterar('outrasVacinas', e.target.value)}
                        className='flex-1 min-w-48 bg-white border border-line focus:border-forest-500 rounded-lg px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted'
                      />
                    </div>
                  </div>

                  <Campo
                    id='descricao' rotulo='DESCRIÇÃO ADICIONAL' textarea erro={erros.descricao}
                    placeholder='Conte o temperamento do animal, se é castrado, se já fez alguma cirurgia e o motivo da doação...'
                    value={dados.descricao} onChange={(e) => alterar('descricao', e.target.value)}
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
                Concordo com os termos da doação responsável e autorizo o envio dos meus dados
                para a {ong.nome} avaliar o acolhimento do animal.
              </label>

              <button
                type='submit'
                className='w-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium py-3.5 rounded-lg transition-colors cursor-pointer'
              >
                Enviar formulário de doação
              </button>

              <p className='text-xs text-muted text-center -mt-3'>
                O envio não garante o acolhimento: a ONG depende de espaço e recursos disponíveis.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doar
