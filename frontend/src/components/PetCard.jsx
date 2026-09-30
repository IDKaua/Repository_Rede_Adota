import React from 'react'
import { Link } from 'react-router-dom'
import { FaPaw, FaLocationDot, FaAngleRight } from 'react-icons/fa6'

const PetCard = ({ pet }) => {
  // Lógica para encontrar a foto de capa do array retornado pela API
  const fotoCapaObj = pet.fotos?.find(f => f.foto_capa) || pet.fotos?.[0];
  
  // Como o banco guarda apenas '/uploads/nome-da-foto.webp', adicionamos o endereço do servidor.
  // Se não houver foto, utiliza uma imagem placeholder.
  const urlImagem = fotoCapaObj?.url_foto 
    ? `http://localhost:5000${fotoCapaObj.url_foto}` 
    : 'https://via.placeholder.com/400x300?text=Sem+Foto';

  // Função para exibir a idade de forma legível (o banco guarda em meses)
  const formatarIdade = (meses) => {
    if (!meses) return 'Idade desconhecida';
    if (meses < 12) return `${meses} meses`;
    const anos = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;
    return `${anos} ano${anos > 1 ? 's' : ''}${mesesRestantes > 0 ? ` e ${mesesRestantes} m` : ''}`;
  };

  // Temporariamente extraímos a cidade do logradouro se não vier diretamente da ONG
  const cidade = pet.ong_cidade || 'Maceió - AL'; 

  return (
    <div className='bg-white border border-line rounded-xl overflow-hidden hover:shadow-md transition-shadow'>

      {/* Foto + selos */}
      {/* Alterado pet._id para pet.id (PostgreSQL) */}
      <Link to={`/animais/${pet.id}`} className='block relative'>
        <img src={urlImagem} alt={pet.nome} className='w-full aspect-4/3 object-cover object-center' loading='lazy' />

        <span className='absolute top-2 left-2 bg-white/90 text-forest-800 text-[10px] font-medium px-2 py-0.5 rounded'>
          {pet.especie}
        </span>

        <div className='absolute top-2 right-2 flex flex-col items-end gap-1'>
          {/* O PostgreSQL guarda condições de saúde na coluna condicao_saude. Podemos exibir a raça/porte se o campo tag não existir */}
          {pet.porte && <span className='bg-sun-400 text-forest-800 text-[10px] font-semibold px-2 py-0.5 rounded'>{pet.porte}</span>}
        </div>
      </Link>

      {/* Informacoes */}
      <div className='p-3'>
        <Link to={`/animais/${pet.id}`} className='font-display font-semibold text-forest-800 hover:text-brand-600 transition-colors'>
          {pet.nome}
        </Link>

        <div className='flex items-center gap-1.5 text-[11px] text-muted mt-1'>
          <FaPaw className='text-brand-500 text-[9px]' />
          <span className='truncate'>{pet.raca || 'SRD'} • {formatarIdade(pet.idade_meses)}</span>
        </div>

        <div className='flex items-center gap-1.5 text-[11px] text-muted mt-0.5'>
          <FaLocationDot className='text-brand-500 text-[9px]' />
          <span>{pet.ong_nome}</span>
        </div>

        <Link
          to={`/animais/${pet.id}`}
          className='w-full mt-3 flex items-center justify-center gap-1 border border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white text-xs font-medium py-2 rounded-lg transition-colors'
        >
          Quero Adotar <FaAngleRight className='text-[10px]' />
        </Link>
      </div>
    </div>
  )
}

export default PetCard