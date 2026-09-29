import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaArrowLeft, FaCalendarDays, FaImage, FaPaw, FaScissors, FaSyringe, FaTrash,
} from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { AdocaoContext } from '../context/AdocaoContext'

/*
  Cada tipo de evento pede informações diferentes. O objeto abaixo descreve,
  para cada um: o rótulo do campo de capacidade (que vira o destaque do card),
  os campos próprios e a lista de itens sugeridos em "O que levar".
*/
const tipos = {
  'Feiras de Adoção': {
    icone: <FaPaw />,
    resumo: 'Animais para adoção, com triagem no local',
    capacidade: { rotulo: 'ANIMAIS DISPONÍVEIS', placeholder: '18 cães e gatos, todos vacinados', icone: 'pata' },
    campos: [
      { id: 'triagem', rotulo: 'TRIAGEM', placeholder: 'Formulário e entrevista no local', icone: 'documento' },
      { id: 'entrega', rotulo: 'ENTREGA', placeholder: 'No mesmo dia, após aprovação do cadastro', icone: 'coracao' },
    ],
    sugestoes: ['Documento com foto', 'Comprovante de residência', 'Ser maior de 18 anos', 'Preencher o formulário de adoção no local'],
  },
  'Campanhas de Vacinação': {
    icone: <FaSyringe />,
    resumo: 'Vacinação e orientação veterinária',
    capacidade: { rotulo: 'ANIMAIS PARTICIPANTES', placeholder: '12 animais participantes', icone: 'pata' },
    campos: [
      { id: 'vacinas', rotulo: 'VACINAS APLICADAS', placeholder: 'Antirrábica, V10 canina e V4 felina', icone: 'seringa' },
      { id: 'publicoAtendido', rotulo: 'PÚBLICO ATENDIDO', placeholder: 'Cães e gatos acima de 3 meses', icone: 'pata' },
    ],
    sugestoes: ['Levar o animal em coleira, guia ou caixa de transporte', 'Animais acima de 3 meses', 'Levar a carteira de vacinação, se já tiver'],
  },
  'Mutirão de Castração': {
    icone: <FaScissors />,
    resumo: 'Castração com equipe veterinária',
    capacidade: { rotulo: 'VAGAS', placeholder: '24 vagas, por ordem de agendamento', icone: 'pata' },
    campos: [
      { id: 'procedimento', rotulo: 'PROCEDIMENTO', placeholder: 'Castração de cães e gatos, machos e fêmeas', icone: 'tesoura' },
      { id: 'preparo', rotulo: 'PREPARO', placeholder: 'Jejum de 8 horas antes do horário marcado', icone: 'aviso' },
    ],
    sugestoes: ['Agendamento prévio pelo WhatsApp da ONG', 'Jejum de 8 horas antes do procedimento', 'Levar caixa de transporte ou coleira'],
  },
}

const acessos = ['Aberto ao público', 'Inscrição prévia recomendada', 'Somente com agendamento'];

const Campo = ({ id, rotulo, erro, textarea, className = '', ...props }) => (
  <div className={className}>
    <label htmlFor={id} className='block text-xs font-medium text-muted mb-1.5'>{rotulo}</label>
    {textarea
      ? <textarea id={id} rows={4} className={`w-full bg-white border rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted ${erro ? 'border-recusado' : 'border-line focus:border-forest-500'}`} {...props} />
      : <input id={id} className={`w-full bg-white border rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted ${erro ? 'border-recusado' : 'border-line focus:border-forest-500'}`} {...props} />}
    {erro && <p className='text-xs text-recusado mt-1.5'>{erro}</p>}
  </div>
)

const NovoEvento = () => {

  const { ongLogada, criarEvento } = useContext(AdocaoContext);
  const navigate = useNavigate();

  const [tipo, setTipo] = useState('Feiras de Adoção');
  const [dados, setDados] = useState({
    titulo: '', data: '', horaInicio: '', horaFim: '', local: '',
    capacidade: '', publico: acessos[0], sobre: '', observacoes: '',
  });
  const [especificos, setEspecificos] = useState({});
  const [requisitos, setRequisitos] = useState(tipos['Feiras de Adoção'].sugestoes);
  const [novoRequisito, setNovoRequisito] = useState('');
  const [capa, setCapa] = useState(null);
  const [erros, setErros] = useState({});
  const [aceite, setAceite] = useState(false);

  const config = tipos[tipo];

  // Trocar o tipo troca os campos próprios e a lista sugerida de itens
  const trocarTipo = (novoTipo) => {
    setTipo(novoTipo);
    setEspecificos({});
    setRequisitos(tipos[novoTipo].sugestoes);
    setErros({});
  }

  const alterar = (campo, valor) => {
    setDados((anterior) => ({ ...anterior, [campo]: valor }));
    if (erros[campo]) setErros((anterior) => ({ ...anterior, [campo]: '' }));
  }

  const alterarEspecifico = (campo, valor) => {
    setEspecificos((anterior) => ({ ...anterior, [campo]: valor }));
    if (erros[campo]) setErros((anterior) => ({ ...anterior, [campo]: '' }));
  }

  const adicionarRequisito = () => {
    const item = novoRequisito.trim();
    if (!item) return;
    if (requisitos.includes(item)) return;
    setRequisitos([...requisitos, item]);
    setNovoRequisito('');
  }

  const escolherCapa = (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    if (arquivo.size > 5 * 1024 * 1024) {
      toast.error('A imagem precisa ter no máximo 5 MB.');
      return;
    }

    setCapa({ arquivo, previa: URL.createObjectURL(arquivo) });
    setErros((anterior) => ({ ...anterior, capa: '' }));
  }

  // Formata "2026-01-12" como "Sáb, 12 jan", igual aos cards
  const formatarData = (valor) => {
    const [ano, mes, dia] = valor.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    const semana = data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    const mesCurto = data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    return `${semana.charAt(0).toUpperCase()}${semana.slice(1)}, ${String(dia).padStart(2, '0')} ${mesCurto}`;
  }

  const validar = () => {
    const novos = {};

    if (!dados.titulo.trim()) novos.titulo = 'Informe o nome do evento.';
    if (!dados.data) novos.data = 'Escolha a data.';
    if (!dados.horaInicio) novos.horaInicio = 'Informe o horário de início.';
    if (!dados.horaFim) novos.horaFim = 'Informe o horário de término.';
    else if (dados.horaInicio && dados.horaFim <= dados.horaInicio) novos.horaFim = 'O término deve ser depois do início.';
    if (!dados.local.trim()) novos.local = 'Informe o local.';
    if (!dados.capacidade.trim()) novos.capacidade = 'Preencha este campo.';
    if (dados.sobre.trim().length < 20) novos.sobre = 'Descreva o evento com pelo menos 20 caracteres.';
    if (!capa) novos.capa = 'Escolha uma imagem de capa.';
    if (requisitos.length === 0) novos.requisitos = 'Inclua ao menos um item.';

    config.campos.forEach((campo) => {
      if (!especificos[campo.id]?.trim()) novos[campo.id] = 'Preencha este campo.';
    });

    setErros(novos);
    return Object.keys(novos).length === 0;
  }

  const publicar = (e) => {
    e.preventDefault();

    if (!validar()) {
      toast.error('Confira os campos destacados antes de publicar.');
      return;
    }

    if (!aceite) {
      toast.error('É preciso aceitar os termos de publicação.');
      return;
    }

    // Monta o evento no mesmo formato que as telas de listagem e detalhes usam
    const detalhes = [
      ...(tipo === 'Campanhas de Vacinação' ? [] : [{ icone: config.capacidade.icone, rotulo: config.capacidade.rotulo.charAt(0) + config.capacidade.rotulo.slice(1).toLowerCase(), valor: dados.capacidade }]),
      ...config.campos.map((campo) => ({
        icone: campo.icone,
        rotulo: campo.rotulo.charAt(0) + campo.rotulo.slice(1).toLowerCase(),
        valor: especificos[campo.id],
      })),
    ];

    const novo = criarEvento({
      tipo,
      titulo: dados.titulo,
      ong: ongLogada._id,
      data: formatarData(dados.data),
      horario: `${dados.horaInicio}-${dados.horaFim}`,
      local: dados.local,
      descricao: dados.sobre.slice(0, 120),
      destaque: dados.capacidade,
      publico: dados.publico,
      inscricao: dados.publico !== acessos[0],
      imagem: capa.previa,
      sobre: dados.sobre,
      requisitos,
      detalhes,
      observacoes: dados.observacoes,
    });

    navigate(`/eventos/${novo._id}`);
  }

  // Só ONG logada cria evento
  if (!ongLogada) {
    return (
      <div className='min-h-screen bg-surface flex items-center justify-center px-6'>
        <div className='bg-white border border-line rounded-xl p-8 text-center max-w-sm'>
          <FaCalendarDays className='text-brand-500 text-3xl mx-auto' />
          <p className='font-display font-semibold text-forest-800 mt-4'>Área exclusiva das ONGs</p>
          <p className='text-sm text-muted mt-1'>Entre com a conta da sua organização para criar eventos.</p>
          <Link
            to='/login'
            className='inline-block bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors mt-5'
          >
            Entrar como ONG
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-surface'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 py-8'>

        <Link to={`/ongs/${ongLogada._id}`} className='inline-flex items-center gap-2 text-sm text-muted hover:text-ink'>
          <FaArrowLeft className='text-xs' /> Voltar para o perfil
        </Link>

        {/* Cabeçalho */}
        <div className='bg-forest-800 text-white rounded-2xl p-6 sm:p-8 mt-5 flex items-center justify-between gap-5'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <FaPaw className='text-brand-500 text-xs' />
              <p className='text-[11px] font-semibold tracking-wider text-brand-500'>JUNTOS FAZEMOS MAIS POR ELES</p>
            </div>
            <h1 className='font-display text-2xl sm:text-3xl font-bold'>Crie seu evento</h1>
            <p className='text-sm text-white/70 mt-1'>
              O evento entra na agenda pública e no perfil da sua ONG assim que for publicado.
            </p>
          </div>

          <img
            src={assets.logo}
            alt='Rede ADota'
            className='hidden sm:block w-24 h-24 object-cover rounded-xl shrink-0'
          />
        </div>

        <div className='bg-white border border-line rounded-2xl p-6 sm:p-8 mt-5'>
          <h2 className='font-display text-xl font-bold text-forest-800'>Informações do evento</h2>
          <p className='text-sm text-muted mt-1'>
            Publicando como <span className='font-medium text-forest-800'>{ongLogada.nome}</span>.
          </p>

          <form onSubmit={publicar} noValidate className='mt-8 flex flex-col gap-5'>

            {/* Tipo de evento */}
            <div>
              <p className='text-xs font-medium text-muted mb-2'>TIPO DE EVENTO</p>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                {Object.entries(tipos).map(([nome, item]) => (
                  <button
                    key={nome}
                    type='button'
                    onClick={() => trocarTipo(nome)}
                    className={`text-left border rounded-lg p-3 transition-colors cursor-pointer ${tipo === nome ? 'border-brand-500 bg-brand-50' : 'border-line bg-white hover:border-brand-300'}`}
                  >
                    <span className={`text-lg ${tipo === nome ? 'text-brand-500' : 'text-forest-600'}`}>{item.icone}</span>
                    <p className='text-sm font-medium text-forest-800 mt-2'>{nome}</p>
                    <p className='text-[11px] text-muted mt-0.5 leading-snug'>{item.resumo}</p>
                  </button>
                ))}
              </div>
            </div>

            <Campo
              id='titulo' rotulo='NOME DO EVENTO' type='text' erro={erros.titulo}
              placeholder='Ex: Feira de Adoção - Praça Centenário'
              value={dados.titulo} onChange={(e) => alterar('titulo', e.target.value)}
            />

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              <Campo
                id='data' rotulo='DATA' type='date' erro={erros.data}
                value={dados.data} onChange={(e) => alterar('data', e.target.value)}
              />
              <Campo
                id='horaInicio' rotulo='INÍCIO' type='time' erro={erros.horaInicio}
                value={dados.horaInicio} onChange={(e) => alterar('horaInicio', e.target.value)}
              />
              <Campo
                id='horaFim' rotulo='TÉRMINO' type='time' erro={erros.horaFim}
                value={dados.horaFim} onChange={(e) => alterar('horaFim', e.target.value)}
              />
            </div>

            <Campo
              id='local' rotulo='LOCAL' type='text' erro={erros.local}
              placeholder='Praça Centenário, Farol, Maceió - AL'
              value={dados.local} onChange={(e) => alterar('local', e.target.value)}
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Campo
                id='capacidade' rotulo={config.capacidade.rotulo} type='text' erro={erros.capacidade}
                placeholder={config.capacidade.placeholder}
                value={dados.capacidade} onChange={(e) => alterar('capacidade', e.target.value)}
              />

              <div>
                <label htmlFor='publico' className='block text-xs font-medium text-muted mb-1.5'>ACESSO</label>
                <select
                  id='publico'
                  value={dados.publico}
                  onChange={(e) => alterar('publico', e.target.value)}
                  className='w-full bg-white border border-line focus:border-forest-500 rounded-lg px-4 py-3 text-sm outline-none cursor-pointer transition-colors'
                >
                  {acessos.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>

            {/* Campos que mudam conforme o tipo */}
            <div className='border border-line rounded-lg p-4 bg-forest-50/50'>
              <p className='text-xs font-medium text-forest-800 mb-3'>
                Informações de {tipo.toLowerCase()}
              </p>
              <div className='flex flex-col gap-4'>
                {config.campos.map((campo) => (
                  <Campo
                    key={campo.id}
                    id={campo.id} rotulo={campo.rotulo} type='text' erro={erros[campo.id]}
                    placeholder={campo.placeholder}
                    value={especificos[campo.id] || ''}
                    onChange={(e) => alterarEspecifico(campo.id, e.target.value)}
                  />
                ))}
              </div>
            </div>

            <Campo
              id='sobre' rotulo='SOBRE O EVENTO' textarea erro={erros.sobre}
              placeholder='Descreva o evento, as atividades e o que os participantes podem esperar...'
              value={dados.sobre} onChange={(e) => alterar('sobre', e.target.value)}
            />

            {/* O que levar */}
            <div>
              <p className='text-xs font-medium text-muted mb-2'>O QUE LEVAR</p>
              <div className='border border-line rounded-lg p-4 bg-white'>
                {requisitos.length === 0 && <p className='text-sm text-muted'>Nenhum item na lista.</p>}

                <ul className='flex flex-col gap-2'>
                  {requisitos.map((item) => (
                    <li key={item} className='flex items-center justify-between gap-3 text-sm text-ink'>
                      <span className='flex items-center gap-2'>
                        <span className='w-1.5 h-1.5 rounded-full bg-brand-500'></span>
                        {item}
                      </span>
                      <button
                        type='button'
                        onClick={() => setRequisitos(requisitos.filter((atual) => atual !== item))}
                        aria-label={`Remover ${item}`}
                        className='text-muted hover:text-recusado cursor-pointer'
                      >
                        <FaTrash className='text-xs' />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className='flex gap-2 mt-4'>
                  <input
                    type='text'
                    value={novoRequisito}
                    onChange={(e) => setNovoRequisito(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); adicionarRequisito(); } }}
                    placeholder='Adicionar outro item...'
                    className='flex-1 bg-white border border-line focus:border-forest-500 rounded-lg px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted'
                  />
                  <button
                    type='button'
                    onClick={adicionarRequisito}
                    className='border border-line hover:border-brand-500 text-sm font-medium px-4 rounded-lg transition-colors cursor-pointer'
                  >
                    Adicionar
                  </button>
                </div>
              </div>
              {erros.requisitos && <p className='text-xs text-recusado mt-1.5'>{erros.requisitos}</p>}
            </div>

            {/* Imagem de capa */}
            <div>
              <p className='text-xs font-medium text-muted mb-2'>IMAGEM DE CAPA</p>
              <label
                htmlFor='capa'
                className={`flex items-center gap-4 border border-dashed rounded-lg p-4 cursor-pointer transition-colors ${erros.capa ? 'border-recusado' : 'border-line hover:border-brand-500'}`}
              >
                {capa
                  ? <img src={capa.previa} alt='Prévia da capa' className='w-28 h-20 object-cover rounded-lg' />
                  : <span className='w-28 h-20 bg-forest-50 rounded-lg flex items-center justify-center text-forest-300 text-2xl'><FaImage /></span>}

                <span className='text-sm'>
                  <span className='block font-medium text-forest-800'>
                    {capa ? capa.arquivo.name : 'Escolher imagem'}
                  </span>
                  <span className='block text-xs text-muted mt-0.5'>JPG ou PNG, até 5 MB. Proporção 3:2 fica melhor no card.</span>
                </span>

                <input id='capa' type='file' accept='image/png, image/jpeg' onChange={escolherCapa} className='hidden' />
              </label>
              {erros.capa && <p className='text-xs text-recusado mt-1.5'>{erros.capa}</p>}
            </div>

            <Campo
              id='observacoes' rotulo='OBSERVAÇÕES (OPCIONAL)' textarea rows={3}
              placeholder='Alguma informação adicional para a equipe da Rede ADota?'
              value={dados.observacoes} onChange={(e) => alterar('observacoes', e.target.value)}
            />

            <label className='flex items-start gap-2 text-sm text-muted cursor-pointer'>
              <input
                type='checkbox'
                checked={aceite}
                onChange={(e) => setAceite(e.target.checked)}
                className='mt-1 accent-brand-500 cursor-pointer'
              />
              Confirmo que as informações são verdadeiras e que a ONG é responsável pela realização do evento.
            </label>

            <button
              type='submit'
              className='w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium py-3.5 rounded-lg transition-colors cursor-pointer'
            >
              <FaCalendarDays className='text-xs' /> Criar evento
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NovoEvento
