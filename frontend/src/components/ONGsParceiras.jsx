import React, { useContext } from 'react'
import { AdocaoContext } from '../context/AdocaoContext'

const ONGsParceiras = () => {

  // 1. Puxamos a lista 'ongs' verdadeira da base de dados
  const { ongs } = useContext(AdocaoContext);

  // 2. Função para criar uma sigla (ex: "Associação Protetora" -> "AP")
  const gerarSigla = (nome) => {
    if (!nome) return 'ON';
    const palavras = nome.split(' ');
    if (palavras.length >= 2) {
      return (palavras[0][0] + palavras[1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  };

  // 3. Função para atribuir uma cor de fundo com base no ID da ONG
  const obterCor = (id) => {
    const cores = ['bg-brand-500', 'bg-forest-500', 'bg-blue-500', 'bg-orange-500', 'bg-purple-500'];
    return cores[(id || 0) % cores.length];
  };

  // Proteção para evitar o erro de 'map' caso os dados ainda estejam a carregar
  const listaOngs = ongs || [];

  return (
    <section className='mt-10 bg-white border border-line rounded-2xl px-6 py-10'>

      <h2 className='font-display text-2xl sm:text-3xl font-bold text-sidebar text-center'>
        ONGs parceiras da Rede ADota
      </h2>

      <p className='text-sm text-muted text-center leading-relaxed max-w-2xl mx-auto mt-4'>
        Com a <span className='font-semibold text-ink'>Rede ADota</span>, organizações de proteção animal divulgam seus
        animais, campanhas e eventos em um só lugar. Conheça as instituições que já fazem parte da rede e ajudam a
        transformar histórias todos os dias.
      </p>

      <div className='flex flex-wrap items-start justify-center gap-8 sm:gap-12 mt-10'>
        {listaOngs.map((ong) => (
          // Usamos ong.id (padrão do PostgreSQL)
          <div key={ong.id} className='flex flex-col items-center gap-3 w-28'>
            
            <div className={`w-24 h-20 rounded-lg ${obterCor(ong.id)} text-white font-display font-bold text-lg flex items-center justify-center`}>
              {gerarSigla(ong.nome)}
            </div>
            
            <p className='text-xs text-muted text-center leading-snug'>{ong.nome}</p>
          </div>
        ))}

        {listaOngs.length === 0 && (
          <p className='text-sm text-muted text-center w-full'>
            Ainda não há ONGs registadas. Seja a primeira a juntar-se à rede!
          </p>
        )}
      </div>
    </section>
  )
}

export default ONGsParceiras;