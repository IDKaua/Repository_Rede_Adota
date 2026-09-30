import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaPaw } from 'react-icons/fa6'
import { AdocaoContext } from '../context/AdocaoContext'
import Title from '../components/Title'
import FiltroPets from '../components/FiltroPets'
import PetCard from '../components/PetCard'

const Animais = () => {

  const { pets, ongs, especie, setEspecie, filtrarPets } = useContext(AdocaoContext);

  const petsFiltrados = filtrarPets();

  // Funções auxiliares para gerar sigla e cor da ONG (caso não venham do banco)
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

  // As abas usam o total geral, os selects de filtro atuam sobre a listagem
  const abas = [
    { valor: 'Todos', label: 'Todos os Pets', total: pets.length },
    { valor: 'Cachorro', label: 'Cachorros', total: pets.filter((p) => p.especie === 'Cachorro').length },
    { valor: 'Gato', label: 'Gatos', total: pets.filter((p) => p.especie === 'Gato').length },
  ];

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6'>

      <Title
        etiqueta='ADOÇÃO RESPONSÁVEL'
        icone={<FaPaw />}
        titulo='Animais para Adoção'
        subtitulo='Descubra cachorros e gatos ansiosos por um lar amoroso e uma nova família.'
      />

      <FiltroPets />

      {/* Abas por espécie */}
      <div className='flex items-center gap-6 border-b border-line mb-6'>
        {abas.map((aba) => (
          <button
            key={aba.valor}
            onClick={() => setEspecie(aba.valor)}
            className={`flex items-center gap-2 pb-3 text-sm transition-colors cursor-pointer ${especie === aba.valor ? 'text-forest-800 font-medium border-b-2 border-brand-500' : 'text-muted hover:text-ink'}`}
          >
            {aba.label}
            <span className='bg-brand-50 text-brand-600 text-[10px] font-semibold px-1.5 py-0.5 rounded'>{aba.total}</span>
          </button>
        ))}
      </div>

      {/* Listagem agrupada por ONG */}
      {petsFiltrados.length === 0 ? (
        <p className='text-sm text-muted py-10 text-center'>Nenhum animal encontrado com os filtros selecionados.</p>
      ) : (
        ongs.map((ong) => {
          // Alterado de pet.ong para pet.id_ong
          const petsDaOng = petsFiltrados.filter((pet) => pet.id_ong === ong.id);
          if (petsDaOng.length === 0) return null;

          return (
            <section key={ong.id} className='bg-brand-50/40 border border-line rounded-xl p-4 mb-5'>
              <Link to={`/ongs/${ong.id}`} className='flex items-center gap-2 mb-4 w-fit group'>
                <div className={`w-7 h-7 rounded-full ${obterCor(ong.id)} text-white text-[10px] font-semibold flex items-center justify-center`}>
                  {gerarSigla(ong.nome)}
                </div>
                <div>
                  <p className='text-sm font-semibold text-forest-800 group-hover:text-brand-600 transition-colors'>{ong.nome}</p>
                  <p className='text-[11px] text-muted'>{petsDaOng.length} animais disponíveis</p>
                </div>
              </Link>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {petsDaOng.map((pet) => <PetCard key={pet.id} pet={pet} />)}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}

export default Animais