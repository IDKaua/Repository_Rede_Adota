import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaArrowLeft, FaCheck, FaWhatsapp, FaXmark } from 'react-icons/fa6'
import { AdocaoContext } from '../context/AdocaoContext'
import PetCard from '../components/PetCard'

// Bloco de informacao usado na ficha do animal
const Info = ({ rotulo, valor }) => (
  <div>
    <p className='text-[11px] text-muted'>{rotulo}</p>
    <p className='text-sm font-medium text-forest-800'>{valor || 'Não informado'}</p>
  </div>
)

const ItemSaude = ({ rotulo, ok }) => (
  <div className='flex items-center gap-2 text-sm'>
    <span className={`w-4 h-4 rounded flex items-center justify-center text-[9px] text-white ${ok ? 'bg-aprovado' : 'bg-line'}`}>
      {ok ? <FaCheck /> : <FaXmark className='text-muted' />}
    </span>
    <span className={ok ? 'text-ink' : 'text-muted'}>{rotulo}</span>
  </div>
)

const Animal = () => {

  const { petId } = useParams();
  const { pets, buscarOng } = useContext(AdocaoContext);

  // Parse do ID para numérico para comparar com o PostgreSQL
  const pet = pets.find((item) => item.id === Number(petId));

  const [selecionada, setSelecionada] = useState({ petId: null, foto: null });

  // Funções auxiliares para gerar sigla e cor da ONG
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

  const formatarIdade = (meses) => {
    if (!meses) return 'Desconhecida';
    if (meses < 12) return `${meses} meses`;
    const anos = Math.floor(meses / 12);
    return `${anos} ano${anos > 1 ? 's' : ''}`;
  };

  // Prepara as URLs das imagens baseadas na resposta da API
  const fotosValidas = pet?.fotos?.length > 0 
    ? pet.fotos.map(f => `http://localhost:5000${f.url_foto}`) 
    : ['https://via.placeholder.com/600x400?text=Sem+Foto'];

  const imagemCapa = fotosValidas[0];
  const imagem = selecionada.petId === petId && selecionada.foto ? selecionada.foto : imagemCapa;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [petId]);

  if (!pet) {
    return (
      <div className='px-4 sm:px-6 lg:px-8 py-16 text-center'>
        <p className='text-sm text-muted'>Animal não encontrado ou a carregar os dados.</p>
        <Link to='/animais' className='inline-block mt-4 text-sm font-medium text-brand-600 hover:text-brand-700'>
          Voltar para a lista
        </Link>
      </div>
    )
  }

  const ong = buscarOng(pet.id_ong);
  const galeria = fotosValidas;
  const relacionados = pets.filter((item) => item.id_ong === pet.id_ong && item.id !== pet.id).slice(0, 4);

  // Avalia o texto "condicao_saude" livre e infere se tem os marcadores (para o visual dos "checks")
  const condicao = pet.condicao_saude ? pet.condicao_saude.toLowerCase() : '';
  const vacinado = condicao.includes('vacinad');
  const vermifugado = condicao.includes('vermifugad');
  const castrado = condicao.includes('castrad');
  const microchipado = condicao.includes('chip') || condicao.includes('microchip');

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6'>

      <Link to='/animais' className='inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-5'>
        <FaArrowLeft className='text-xs' /> Voltar para a lista
      </Link>

      {/* Foto + ficha */}
      <div className='flex flex-col lg:flex-row gap-6'>

        <div className='flex-1'>
          <div className='flex justify-center'>
            <img
              src={imagem}
              alt={pet.nome}
              className='w-full aspect-square md:aspect-4/3 lg:max-h-112 object-cover rounded-xl border border-line'
            />
          </div>

          {galeria.length > 1 && (
            <div className='flex gap-3 mt-3 overflow-x-auto pb-2'>
              {galeria.map((item, indice) => (
                <img
                  key={indice}
                  onClick={() => setSelecionada({ petId, foto: item })}
                  src={item}
                  alt={`${pet.nome} - foto ${indice + 1}`}
                  className={`w-24 h-16 object-cover rounded-lg cursor-pointer border-2 transition-colors shrink-0 ${item === imagem ? 'border-brand-500' : 'border-line hover:border-brand-300'}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className='w-full lg:w-96 bg-white border border-line rounded-xl p-5'>
          <h1 className='font-display text-3xl font-bold text-forest-800'>{pet.nome}</h1>
          <p className='text-sm text-muted'>Disponível para adoção</p>

          <div className='border-t border-line my-4'></div>

          <div className='grid grid-cols-2 gap-y-4 gap-x-3'>
            <Info rotulo='Espécie' valor={pet.especie} />
            <Info rotulo='Raça' valor={pet.raca || 'SRD'} />
            <Info rotulo='Sexo' valor={pet.sexo} />
            <Info rotulo='Idade' valor={formatarIdade(pet.idade_meses)} />
            <Info rotulo='Porte' valor={pet.porte} />
            <Info rotulo='Localização' valor={ong ? `${ong.cidade} - ${ong.uf}` : 'Não informado'} />
          </div>

          <div className='border-t border-line my-4'></div>

          <p className='text-[11px] text-muted'>Personalidade / Detalhes</p>
          <p className='text-sm text-ink mt-1'>{pet.descricao}</p>

          <Link
            to={`/animais/${pet.id}/adotar`}
            className='w-full mt-5 block text-center bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium py-3 rounded-lg transition-colors'
          >
            Quero adotar {pet.nome}
          </Link>
        </div>
      </div>

      {/* Historia, saude e ONG */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6'>

        <div className='bg-white border border-line rounded-xl p-5 lg:col-span-2'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <p className='font-display font-semibold text-forest-800 mb-3'>Sobre {pet.nome}</p>
              <p className='text-sm text-muted leading-relaxed'>{pet.descricao}</p>
            </div>
            <div>
              <p className='font-display font-semibold text-forest-800 mb-3'>Saúde e cuidados</p>
              <div className='flex flex-col gap-2'>
                <ItemSaude rotulo='Vacinado' ok={vacinado} />
                <ItemSaude rotulo='Vermifugado' ok={vermifugado} />
                <ItemSaude rotulo='Castrado' ok={castrado} />
                <ItemSaude rotulo='Microchipado' ok={microchipado} />
              </div>
              <div className='border-t border-line my-4'></div>
              <p className='text-sm'>
                <span className='font-medium text-forest-800'>Condições relatadas: </span>
                <span className='text-muted'>{pet.condicao_saude || 'Nenhuma condição especial relatada.'}</span>
              </p>
            </div>
          </div>
        </div>

        {ong && (
          <div className='bg-white border border-line rounded-xl p-5 flex flex-col'>
            <div className='flex items-center gap-2'>
              <div className={`w-8 h-8 rounded-full ${obterCor(ong.id)} text-white text-[10px] font-semibold flex items-center justify-center`}>
                {gerarSigla(ong.nome)}
              </div>
              <div>
                <p className='font-display font-semibold text-forest-800 leading-tight'>{ong.nome}</p>
                <p className='text-[11px] text-muted'>{ong.cidade} - {ong.uf}</p>
              </div>
            </div>

            <p className='text-sm text-muted leading-relaxed mt-3 line-clamp-3'>{ong.descricao}</p>

            <Link to={`/ongs/${ong.id}`} className='text-sm font-medium text-brand-600 hover:text-brand-700 underline mt-3'>
              Ver perfil da ONG
            </Link>

            <div className='border-t border-line my-4'></div>

            <p className='text-sm font-medium text-forest-800'>Fale com o protetor</p>
            <a
              href={`https://wa.me/${ong.telefone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Tenho interesse em adotar o(a) ${pet.nome} que vi na Rede ADota.`)}`}
              target='_blank'
              rel='noreferrer'
              className='flex items-center justify-center gap-2 bg-forest-700 hover:bg-forest-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors mt-3'
            >
              <FaWhatsapp /> Conversar pelo WhatsApp
            </a>
            <p className='text-[11px] text-muted text-center mt-2'>Você será redirecionado para o WhatsApp.</p>
          </div>
        )}
      </div>

      {/* Outros animais da mesma ONG */}
      {relacionados.length > 0 && (
        <section className='mt-10'>
          <div className='flex items-end justify-between gap-4 mb-4'>
            <p className='font-display text-lg font-bold text-forest-800'>
              Outros pets para adoção da mesma ONG
            </p>
            <Link to='/animais' className='text-sm font-medium text-brand-600 hover:text-brand-700 whitespace-nowrap'>
              Ver todos
            </Link>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {relacionados.map((item) => <PetCard key={item.id} pet={item} />)}
          </div>
        </section>
      )}
    </div>
  )
}

export default Animal