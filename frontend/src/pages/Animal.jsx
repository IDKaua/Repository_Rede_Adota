import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaArrowLeft, FaCheck, FaWhatsapp, FaXmark } from 'react-icons/fa6'
import { AdocaoContext } from '../context/AdocaoContext'
import PetCard from '../components/PetCard'

// Bloco de informacao usado na ficha do animal (Especie, Raca, Sexo...)
const Info = ({ rotulo, valor }) => (
  <div>
    <p className='text-[11px] text-muted'>{rotulo}</p>
    <p className='text-sm font-medium text-forest-800'>{valor}</p>
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
  const { pets, buscarOng, solicitarAdocao } = useContext(AdocaoContext);

  const pet = pets.find((item) => item._id === petId);

  // A foto escolhida guarda a qual animal pertence: ao trocar de pet pelos
  // cards relacionados, a galeria volta sozinha para a primeira imagem
  const [selecionada, setSelecionada] = useState({ petId: null, foto: null });

  const imagem = selecionada.petId === petId ? selecionada.foto : (pet?.fotos?.[0] || pet?.imagem);

  // Volta ao topo da pagina quando o animal muda
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [petId]);

  if (!pet) {
    return (
      <div className='px-4 sm:px-6 lg:px-8 py-16 text-center'>
        <p className='text-sm text-muted'>Animal não encontrado.</p>
        <Link to='/animais' className='inline-block mt-4 text-sm font-medium text-brand-600 hover:text-brand-700'>
          Voltar para a lista
        </Link>
      </div>
    )
  }

  const ong = buscarOng(pet.ong);
  const galeria = pet.fotos?.length ? pet.fotos : [pet.imagem];
  const relacionados = pets.filter((item) => item.ong === pet.ong && item._id !== pet._id).slice(0, 4);

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6'>

      <Link to='/animais' className='inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-5'>
        <FaArrowLeft className='text-xs' /> Voltar para a lista
      </Link>

      {/* Foto + ficha */}
      <div className='flex flex-col lg:flex-row gap-6'>

        <div className='flex-1'>
          {/* A moldura acompanha o tamanho da foto, sem sobrar espaço em branco */}
          <div className='flex justify-center'>
            <img
              src={imagem}
              alt={pet.nome}
              className='max-w-full max-h-112 rounded-xl border border-line'
            />
          </div>

          {galeria.length > 1 && (
            <div className='flex gap-3 mt-3'>
              {galeria.map((item, indice) => (
                <img
                  key={indice}
                  onClick={() => setSelecionada({ petId, foto: item })}
                  src={item}
                  alt={`${pet.nome} - foto ${indice + 1}`}
                  className={`w-24 h-16 object-cover rounded-lg cursor-pointer border-2 transition-colors ${item === imagem ? 'border-brand-500' : 'border-line hover:border-brand-300'}`}
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
            <Info rotulo='Raça' valor={pet.raca} />
            <Info rotulo='Sexo' valor={pet.sexo} />
            <Info rotulo='Idade' valor={pet.idade} />
            <Info rotulo='Porte' valor={pet.porte} />
            <Info rotulo='Localização' valor={pet.local} />
          </div>

          <div className='border-t border-line my-4'></div>

          <p className='text-[11px] text-muted'>Personalidade</p>
          <p className='text-sm text-ink mt-1'>{pet.personalidade}</p>

          <button
            onClick={() => solicitarAdocao(pet)}
            className='w-full mt-5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium py-3 rounded-lg transition-colors cursor-pointer'
          >
            Quero adotar {pet.nome}
          </button>
        </div>
      </div>

      {/* Historia, saude e ONG */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6'>

        <div className='bg-white border border-line rounded-xl p-5'>
          <p className='font-display font-semibold text-forest-800 mb-3'>Sobre {pet.nome}</p>
          <p className='text-sm text-muted leading-relaxed'>{pet.historia}</p>
        </div>

        <div className='bg-white border border-line rounded-xl p-5'>
          <p className='font-display font-semibold text-forest-800 mb-3'>Saúde e cuidados</p>
          <div className='flex flex-col gap-2'>
            <ItemSaude rotulo='Vacinado' ok={pet.vacinado} />
            <ItemSaude rotulo='Vermifugado' ok={pet.vermifugado} />
            <ItemSaude rotulo='Castrado' ok={pet.castrado} />
            <ItemSaude rotulo='Microchipado' ok={pet.microchipado} />
          </div>
          <div className='border-t border-line my-4'></div>
          <p className='text-sm'>
            <span className='font-medium text-forest-800'>Necessidades especiais: </span>
            <span className='text-muted'>{pet.necessidadesEspeciais}</span>
          </p>
        </div>

        <div className='bg-white border border-line rounded-xl p-5 flex flex-col'>
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

          <p className='text-sm font-medium text-forest-800'>Fale com o protetor</p>
          <a
            href={`https://wa.me/${ong.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse em adotar o(a) ${pet.nome} que vi na Rede ADota.`)}`}
            target='_blank'
            rel='noreferrer'
            className='flex items-center justify-center gap-2 bg-forest-700 hover:bg-forest-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors mt-3'
          >
            <FaWhatsapp /> Conversar pelo WhatsApp
          </a>
          <p className='text-[11px] text-muted text-center mt-2'>Você será redirecionado para o WhatsApp.</p>
        </div>
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
            {relacionados.map((item) => <PetCard key={item._id} pet={item} />)}
          </div>
        </section>
      )}
    </div>
  )
}

export default Animal
