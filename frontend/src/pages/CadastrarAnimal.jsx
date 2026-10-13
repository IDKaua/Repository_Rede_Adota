import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaCheck, FaImage, FaPaw, FaXmark } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { AdocaoContext } from '../context/AdocaoContext'

const Campo = ({ id, rotulo, erro, textarea, opcoes, className = '', ...props }) => {
  const estilo = `w-full bg-white disabled:bg-surface disabled:cursor-not-allowed border rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted ${erro ? 'border-recusado' : 'border-line focus:border-forest-500'}`;

  return (
    <div className={className}>
      {rotulo && <label htmlFor={id} className='block text-xs font-medium text-muted mb-1.5'>{rotulo}</label>}

      {opcoes
        ? (
          <select id={id} className={`${estilo} cursor-pointer`} {...props}>
            <option value=''>Selecione a espécie</option>
            {opcoes.map((opcao) => <option key={opcao} value={opcao}>{opcao}</option>)}
          </select>
        )
        : textarea
          ? <textarea id={id} rows={3} className={`${estilo} resize-y`} {...props} />
          : <input id={id} className={estilo} {...props} />}

      {erro && <p className='text-xs text-recusado mt-1.5'>{erro}</p>}
    </div>
  )
}

// Grupo de opções em formato de rádio (sexo e necessidades especiais)
const Radios = ({ nome, opcoes, valor, onChange }) => (
  <div className='flex items-center gap-6'>
    {opcoes.map((opcao) => (
      <label key={opcao} className='flex items-center gap-2 text-sm text-ink cursor-pointer'>
        <input
          type='radio'
          name={nome}
          value={opcao}
          checked={valor === opcao}
          onChange={() => onChange(opcao)}
          className='w-4 h-4 accent-brand-500 cursor-pointer'
        />
        {opcao}
      </label>
    ))}
  </div>
)

const portes = ['Grande', 'Médio', 'Pequeno'];

// Os mesmos marcadores que a tela de detalhes procura no texto de saúde
const cuidados = ['Vacinado', 'Vermifugado', 'Castrado', 'Microchipado'];

const MAX_FOTOS = 5;

const CadastrarAnimal = () => {

  const { ongLogada, cadastrarPet } = useContext(AdocaoContext);
  const navigate = useNavigate();

  const [dados, setDados] = useState({
    nome: '', especie: '', raca: '', idade: '', unidadeIdade: 'anos', porte: '', sexo: '',
    personalidade: '', sobre: '', saude: '', necessidades: 'Não', descricaoNecessidades: '',
  });
  const [marcados, setMarcados] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [arrastando, setArrastando] = useState(false);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  const alterar = (campo, valor) => {
    setDados((anterior) => ({ ...anterior, [campo]: valor }));
    if (erros[campo]) setErros((anterior) => ({ ...anterior, [campo]: '' }));
  }

  const alternarCuidado = (item) => {
    setMarcados(marcados.includes(item)
      ? marcados.filter((atual) => atual !== item)
      : [...marcados, item]);
  }

  const adicionarFotos = (lista) => {
    const imagens = Array.from(lista).filter((arquivo) => ['image/png', 'image/jpeg', 'image/webp'].includes(arquivo.type));

    if (imagens.some((arquivo) => arquivo.size > 5 * 1024 * 1024)) {
      toast.error('Cada foto precisa ter no máximo 5 MB.');
      return;
    }

    const vagas = MAX_FOTOS - fotos.length;
    if (imagens.length > vagas) toast.info(`Você pode enviar até ${MAX_FOTOS} fotos.`);

    const novas = imagens.slice(0, vagas).map((arquivo) => ({ arquivo, previa: URL.createObjectURL(arquivo) }));
    if (novas.length === 0) return;

    setFotos([...fotos, ...novas]);
    setErros((anterior) => ({ ...anterior, fotos: '' }));
  }

  const removerFoto = (indice) => {
    URL.revokeObjectURL(fotos[indice].previa);
    setFotos(fotos.filter((_, atual) => atual !== indice));
  }

  const soltarFotos = (e) => {
    e.preventDefault();
    setArrastando(false);
    adicionarFotos(e.dataTransfer.files);
  }

  const validar = () => {
    const novos = {};
    const idade = Number(dados.idade);

    if (!dados.nome.trim()) novos.nome = 'Informe o nome do animal.';
    if (!dados.especie) novos.especie = 'Selecione a espécie.';
    if (!dados.idade || !Number.isInteger(idade) || idade < 0) novos.idade = 'Informe a idade em números inteiros.';
    if (!dados.porte) novos.porte = 'Escolha o porte.';
    if (!dados.sexo) novos.sexo = 'Selecione o sexo.';
    if (dados.sobre.trim().length < 20) novos.sobre = 'Conte um pouco sobre o animal, com pelo menos 20 caracteres.';
    if (dados.necessidades === 'Sim' && !dados.descricaoNecessidades.trim()) novos.descricaoNecessidades = 'Descreva quais são as necessidades.';
    if (fotos.length === 0) novos.fotos = 'Adicione pelo menos uma foto.';

    setErros(novos);
    return Object.keys(novos).length === 0;
  }

  const salvar = async (e) => {
    e.preventDefault();

    if (!validar()) {
      toast.error('Confira os campos destacados antes de salvar.');
      return;
    }

    // O banco guarda a idade em meses
    const idadeMeses = dados.unidadeIdade === 'anos' ? Number(dados.idade) * 12 : Number(dados.idade);

    // Os cuidados marcados entram no começo do texto de saúde, que é o que a tela de detalhes lê
    const condicaoSaude = [
      marcados.length > 0 ? `${marcados.join(', ')}.` : '',
      dados.saude.trim(),
    ].filter(Boolean).join(' ');

    setEnviando(true);
    const petId = await cadastrarPet({
      id_ong: ongLogada.id,
      nome: dados.nome.trim(),
      especie: dados.especie,
      raca: dados.raca.trim() || 'SRD',
      sexo: dados.sexo,
      idade_meses: idadeMeses,
      porte: dados.porte,
      condicao_saude: condicaoSaude,
      descricao: dados.sobre.trim(),
      personalidade: dados.personalidade.trim(),
      necessidades_especiais: dados.necessidades === 'Sim',
      descricao_necessidades: dados.necessidades === 'Sim' ? dados.descricaoNecessidades.trim() : '',
    }, fotos.map((foto) => foto.arquivo));
    setEnviando(false);

    if (petId) navigate(`/animais/${petId}`);
  }

  // Só ONG logada cadastra animal
  if (!ongLogada) {
    return (
      <div className='min-h-screen bg-surface flex items-center justify-center px-6'>
        <div className='bg-white border border-line rounded-xl p-8 text-center max-w-sm'>
          <FaPaw className='text-brand-500 text-3xl mx-auto' />
          <p className='font-display font-semibold text-forest-800 mt-4'>Área exclusiva das ONGs</p>
          <p className='text-sm text-muted mt-1'>Entre com a conta da sua organização para cadastrar animais.</p>
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
      <div className='max-w-4xl mx-auto px-4 sm:px-6 py-8'>

        <Link to={`/ongs/${ongLogada.id}`} className='inline-flex items-center gap-2 text-sm text-muted hover:text-ink'>
          <FaArrowLeft className='text-xs' /> Voltar para o perfil
        </Link>

        {/* Cabeçalho */}
        <div className='bg-forest-800 text-white rounded-2xl p-6 sm:p-8 mt-5 flex items-center justify-between gap-5'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <FaPaw className='text-brand-500 text-xs' />
              <p className='text-[11px] font-semibold tracking-wider text-brand-500'>UM NOVO LAR COMEÇA AQUI</p>
            </div>
            <h1 className='font-display text-2xl sm:text-3xl font-bold'>Cadastrar animal</h1>
            <p className='text-sm text-white/70 mt-1'>
              O animal aparece na lista de adoção e no perfil da sua ONG assim que for salvo.
            </p>
          </div>

          <img
            src={assets.logo}
            alt='Rede ADota'
            className='hidden sm:block w-24 h-24 object-cover rounded-xl shrink-0'
          />
        </div>

        <div className='bg-white border border-line rounded-2xl p-6 sm:p-8 mt-5'>
          <h2 className='font-display text-xl font-bold text-forest-800'>Informações do animal</h2>
          <p className='text-sm text-muted mt-1'>
            Cadastrando como <span className='font-medium text-forest-800'>{ongLogada.nome}</span>.
          </p>

          <form onSubmit={salvar} noValidate className='mt-8 flex flex-col gap-5'>

            {/* Foto + nome, espécie e raça */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div>
                <p className='text-xs font-medium text-muted mb-1.5'>FOTOS DO ANIMAL</p>
                <label
                  htmlFor='fotos'
                  onDragOver={(e) => { e.preventDefault(); setArrastando(true); }}
                  onDragLeave={() => setArrastando(false)}
                  onDrop={soltarFotos}
                  className={`flex flex-col items-center justify-center text-center h-full min-h-56 border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${erros.fotos ? 'border-recusado' : arrastando ? 'border-brand-500 bg-brand-50' : 'border-line hover:border-brand-500'}`}
                >
                  {fotos.length > 0
                    ? <img src={fotos[0].previa} alt='Prévia da foto principal' className='w-full h-44 object-cover rounded-lg' />
                    : <span className='w-16 h-16 bg-forest-50 rounded-xl flex items-center justify-center text-forest-300 text-3xl'><FaImage /></span>}

                  <span className='block text-sm font-medium text-forest-800 mt-3'>
                    {fotos.length > 0 ? 'Adicionar mais fotos' : 'Clique para adicionar uma foto'}
                  </span>
                  <span className='block text-xs text-muted mt-0.5'>
                    (ou arraste e solte) · JPG ou PNG, até 5 MB, no máximo {MAX_FOTOS}
                  </span>

                  <input
                    id='fotos' type='file' multiple accept='image/png, image/jpeg, image/webp'
                    onChange={(e) => { adicionarFotos(e.target.files); e.target.value = ''; }}
                    className='hidden'
                  />
                </label>
                {erros.fotos && <p className='text-xs text-recusado mt-1.5'>{erros.fotos}</p>}
              </div>

              <div className='flex flex-col gap-4'>
                <Campo
                  id='nome' rotulo='NOME' type='text' placeholder='Digite o nome do animal' erro={erros.nome}
                  value={dados.nome} onChange={(e) => alterar('nome', e.target.value)}
                />
                <Campo
                  id='especie' rotulo='ESPÉCIE' erro={erros.especie}
                  opcoes={['Cachorro', 'Gato']}
                  value={dados.especie} onChange={(e) => alterar('especie', e.target.value)}
                />
                <Campo
                  id='raca' rotulo='RAÇA' type='text' placeholder='Digite a raça (deixe em branco para SRD)'
                  value={dados.raca} onChange={(e) => alterar('raca', e.target.value)}
                />
              </div>
            </div>

            {/* Miniaturas: a primeira foto é a capa do card */}
            {fotos.length > 0 && (
              <div className='flex flex-wrap gap-3 -mt-1'>
                {fotos.map((foto, indice) => (
                  <div key={foto.previa} className='relative'>
                    <img
                      src={foto.previa}
                      alt={`Foto ${indice + 1}`}
                      className={`w-20 h-16 object-cover rounded-lg border-2 ${indice === 0 ? 'border-brand-500' : 'border-line'}`}
                    />
                    {indice === 0 && (
                      <span className='absolute bottom-1 left-1 bg-brand-500 text-white text-[9px] font-semibold px-1.5 rounded'>CAPA</span>
                    )}
                    <button
                      type='button'
                      onClick={() => removerFoto(indice)}
                      aria-label={`Remover foto ${indice + 1}`}
                      className='absolute -top-2 -right-2 w-5 h-5 bg-white border border-line rounded-full flex items-center justify-center text-[10px] text-muted hover:text-recusado cursor-pointer'
                    >
                      <FaXmark />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Idade + porte */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div>
                <label htmlFor='idade' className='block text-xs font-medium text-muted mb-1.5'>IDADE</label>
                <div className='flex gap-2'>
                  <input
                    id='idade' type='number' min='0' inputMode='numeric' placeholder='Ex: 2'
                    value={dados.idade} onChange={(e) => alterar('idade', e.target.value)}
                    className={`flex-1 min-w-0 bg-white border rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted ${erros.idade ? 'border-recusado' : 'border-line focus:border-forest-500'}`}
                  />
                  <select
                    aria-label='Unidade da idade'
                    value={dados.unidadeIdade}
                    onChange={(e) => alterar('unidadeIdade', e.target.value)}
                    className='bg-white border border-line focus:border-forest-500 rounded-lg px-3 py-3 text-sm outline-none cursor-pointer transition-colors'
                  >
                    <option value='anos'>anos</option>
                    <option value='meses'>meses</option>
                  </select>
                </div>
                {erros.idade && <p className='text-xs text-recusado mt-1.5'>{erros.idade}</p>}
              </div>

              <div>
                <p className='text-xs font-medium text-muted mb-1.5'>PORTE</p>
                <div className='grid grid-cols-3 gap-3'>
                  {portes.map((item) => (
                    <button
                      key={item}
                      type='button'
                      onClick={() => alterar('porte', item)}
                      className={`border rounded-lg py-3 text-sm font-medium transition-colors cursor-pointer ${dados.porte === item ? 'border-brand-500 bg-brand-50 text-brand-700' : erros.porte ? 'border-recusado text-ink' : 'border-line text-ink hover:border-brand-300'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {erros.porte && <p className='text-xs text-recusado mt-1.5'>{erros.porte}</p>}
              </div>
            </div>

            {/* Sexo + personalidade */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div>
                <p className='text-xs font-medium text-muted mb-2.5'>SEXO</p>
                <Radios nome='sexo' opcoes={['Macho', 'Fêmea']} valor={dados.sexo} onChange={(valor) => alterar('sexo', valor)} />
                {erros.sexo && <p className='text-xs text-recusado mt-1.5'>{erros.sexo}</p>}
              </div>

              <Campo
                id='personalidade' rotulo='PERSONALIDADE' textarea
                placeholder='Descreva a personalidade do animal: brincalhão, calmo, se dá bem com crianças...'
                value={dados.personalidade} onChange={(e) => alterar('personalidade', e.target.value)}
              />
            </div>

            <Campo
              id='sobre' rotulo='SOBRE' textarea erro={erros.sobre}
              placeholder='Conte um pouco mais sobre o animal: como foi resgatado, sua rotina, do que gosta...'
              value={dados.sobre} onChange={(e) => alterar('sobre', e.target.value)}
            />

            {/* Saúde + necessidades especiais */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div>
                <p className='text-xs font-medium text-muted mb-1.5'>SAÚDE E CUIDADOS</p>
                <div className='flex flex-wrap gap-2 mb-3'>
                  {cuidados.map((item) => {
                    const ativo = marcados.includes(item);
                    return (
                      <button
                        key={item}
                        type='button'
                        onClick={() => alternarCuidado(item)}
                        className={`flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${ativo ? 'border-forest-500 bg-forest-50 text-forest-800' : 'border-line text-muted hover:border-forest-300'}`}
                      >
                        {ativo && <FaCheck className='text-[9px]' />} {item}
                      </button>
                    )
                  })}
                </div>
                <Campo
                  id='saude' textarea aria-label='Saúde e cuidados'
                  placeholder='Informe sobre a saúde e cuidados necessários...'
                  value={dados.saude} onChange={(e) => alterar('saude', e.target.value)}
                />
              </div>

              <div>
                <p className='text-xs font-medium text-muted mb-2.5'>PRECISA DE NECESSIDADES ESPECIAIS?</p>
                <Radios
                  nome='necessidades' opcoes={['Sim', 'Não']} valor={dados.necessidades}
                  onChange={(valor) => alterar('necessidades', valor)}
                />
                <Campo
                  id='descricaoNecessidades' textarea className='mt-3' aria-label='Quais necessidades especiais'
                  erro={erros.descricaoNecessidades}
                  disabled={dados.necessidades !== 'Sim'}
                  placeholder='Se sim, descreva quais...'
                  value={dados.descricaoNecessidades} onChange={(e) => alterar('descricaoNecessidades', e.target.value)}
                />
              </div>
            </div>

            <div className='border-t border-line pt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-3'>
              <button
                type='button'
                onClick={() => navigate(`/ongs/${ongLogada.id}`)}
                className='border border-line hover:border-brand-500 text-sm font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer'
              >
                Cancelar
              </button>
              <button
                type='submit'
                disabled={enviando}
                className='flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-wait text-white text-sm font-medium px-8 py-3 rounded-lg transition-colors cursor-pointer'
              >
                <FaPaw className='text-xs' /> {enviando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CadastrarAnimal
