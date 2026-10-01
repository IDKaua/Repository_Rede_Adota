import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaArrowRightFromBracket, FaBars, FaRightToBracket } from 'react-icons/fa6'
import { AdocaoContext } from '../context/AdocaoContext'

// Nome de cada secao usado na trilha de navegacao
const titulos = {
  animais: 'Animais',
  ongs: 'ONGs & Protetores',
  eventos: 'Eventos',
}

// Monta a trilha a partir da rota: /animais/a1 -> Página Inicial • Animais • Detalhes do pet
const montarTrilha = (pathname) => {
  const partes = pathname.split('/').filter(Boolean);
  const trilha = [{ label: 'Página Inicial', to: '/' }];

  if (partes[0] && titulos[partes[0]]) {
    trilha.push({ label: titulos[partes[0]], to: `/${partes[0]}` });
  }

  if (partes[1]) {
    if (partes[0] === 'animais') trilha.push({ label: 'Detalhes do pet' });
    if (partes[0] === 'eventos') trilha.push({ label: 'Detalhes do evento' });
    if (partes[0] === 'ongs') trilha.push({ label: 'Perfil da ONG' });
  }

  return trilha;
}

const Topbar = () => {

  const { setMenuAberto, ongLogada, sairDaConta } = useContext(AdocaoContext);
  const { pathname } = useLocation();

  const trilha = montarTrilha(pathname);

  // Funções auxiliares para manter a cor e a sigla consistentes com o resto do sistema
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

  return (
    <header className='sticky top-0 z-20 bg-header border-b border-line'>
      <div className='flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3'>

        <div className='flex items-center gap-3 min-w-0'>
          <button onClick={() => setMenuAberto(true)} className='lg:hidden text-muted hover:text-ink cursor-pointer'>
            <FaBars />
          </button>

          <p className='text-xs truncate'>
            {trilha.map((item, indice) => {
              const ultimo = indice === trilha.length - 1;
              return (
                <span key={item.label}>
                  {indice > 0 && <span className='text-brand-500 mx-1.5'>•</span>}
                  {ultimo
                    ? <span className='text-forest-800 font-medium'>{item.label}</span>
                    : <Link to={item.to} className='text-muted hover:text-ink'>{item.label}</Link>}
                </span>
              )
            })}
          </p>
        </div>

        {/* Sem sessão mostra o acesso das ONGs; com sessão, a ONG e o botão de sair */}
        {ongLogada ? (
          <div className='flex items-center gap-3'>
            {/* CORREÇÃO: Removido o _id e alterado para id */}
            <Link to={`/ongs/${ongLogada.id}`} title='Ver meu perfil' className='flex items-center gap-2 group'>
              <p className='hidden sm:block text-sm text-ink group-hover:text-brand-600 transition-colors'>{ongLogada.nome}</p>
              
              <div className={`w-8 h-8 rounded-full ${obterCor(ongLogada.id)} text-white text-[10px] font-semibold flex items-center justify-center`}>
                {gerarSigla(ongLogada.nome)}
              </div>
            </Link>
            
            <button
              onClick={sairDaConta}
              title='Sair da conta'
              className='text-muted hover:text-brand-500 transition-colors cursor-pointer'
            >
              <FaArrowRightFromBracket />
            </button>
          </div>
        ) : (
          <Link
            to='/login'
            className='flex items-center gap-2 border border-line hover:border-brand-500 text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap'
          >
            <FaRightToBracket className='text-xs text-brand-500' />
            <span className='hidden sm:inline'>Entrar como ONG</span>
            <span className='sm:hidden'>Entrar</span>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Topbar