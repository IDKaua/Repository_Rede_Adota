import React, { useContext } from 'react'
import { FaMagnifyingGlass, FaSliders } from 'react-icons/fa6'
import { AdocaoContext } from '../context/AdocaoContext'

const FiltroPets = () => {

  const { busca, setBusca, especie, setEspecie, porte, setPorte, sexo, setSexo, limparFiltros } = useContext(AdocaoContext);

  const estiloSelect = 'border border-line bg-white rounded-lg px-3 py-2.5 text-sm text-ink outline-none cursor-pointer focus:border-forest-500';

  return (
    <div className='flex flex-col md:flex-row gap-3 mb-6'>

      {/* Busca */}
      <div className='flex-1 flex items-center gap-2 border border-line bg-white rounded-lg px-3 py-2.5 focus-within:border-forest-500'>
        <FaMagnifyingGlass className='text-muted text-xs' />
        <input
          onChange={(e) => setBusca(e.target.value)}
          value={busca}
          className='w-full text-sm outline-none placeholder:text-muted'
          type='text'
          placeholder='Buscar por nome, raça ou cidade...'
        />
      </div>

      {/* Filtros */}
      <div className='flex flex-wrap gap-3'>
        <div className='flex flex-col'>
          <label className='text-[10px] text-muted mb-0.5'>ESPÉCIE</label>
          <select value={especie} onChange={(e) => setEspecie(e.target.value)} className={estiloSelect}>
            <option value='Todos'>Todos os animais</option>
            <option value='Cachorro'>Cachorros</option>
            <option value='Gato'>Gatos</option>
          </select>
        </div>

        <div className='flex flex-col'>
          <label className='text-[10px] text-muted mb-0.5'>PORTE</label>
          <select value={porte} onChange={(e) => setPorte(e.target.value)} className={estiloSelect}>
            <option value='Todos'>Todos os portes</option>
            <option value='Pequeno'>Pequeno</option>
            <option value='Médio'>Médio</option>
            <option value='Grande'>Grande</option>
          </select>
        </div>

        <div className='flex flex-col'>
          <label className='text-[10px] text-muted mb-0.5'>SEXO</label>
          <select value={sexo} onChange={(e) => setSexo(e.target.value)} className={estiloSelect}>
            <option value='Todos'>Todos os sexos</option>
            <option value='Macho'>Macho</option>
            <option value='Fêmea'>Fêmea</option>
          </select>
        </div>

        <button
          onClick={limparFiltros}
          className='self-end flex items-center gap-2 bg-forest-700 hover:bg-forest-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer'
        >
          <FaSliders className='text-xs' /> Filtros
        </button>
      </div>
    </div>
  )
}

export default FiltroPets
