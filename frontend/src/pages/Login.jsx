import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaEye, FaEyeSlash, FaPaw } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import axios from 'axios'
import api from '../services/api' // Usa o axios configurado para a nossa API
import { AdocaoContext } from '../context/AdocaoContext'
import { assets } from '../assets/assets'

// Campo de texto padrao (rotulo + input + mensagem de erro)
const Campo = ({ id, rotulo, erro, className = '', ...props }) => (
  <div className={className}>
    <label htmlFor={id} className='block text-xs font-medium text-muted mb-1.5'>{rotulo}</label>
    <input
      id={id}
      name={id}
      aria-invalid={Boolean(erro)}
      className={`w-full bg-white border rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted ${erro ? 'border-recusado' : 'border-line focus:border-forest-500'}`}
      {...props}
    />
    {erro && <p className='text-xs text-recusado mt-1.5'>{erro}</p>}
  </div>
)

const mascaraCnpj = (valor) => valor.replace(/\D/g, '').slice(0, 14)
  .replace(/^(\d{2})(\d)/, '$1.$2')
  .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
  .replace(/\.(\d{3})(\d)/, '.$1/$2')
  .replace(/(\d{4})(\d)/, '$1-$2');

const mascaraTelefone = (valor) => valor.replace(/\D/g, '').slice(0, 11)
  .replace(/^(\d{2})(\d)/, '($1) $2')
  .replace(/(\d{5})(\d)/, '$1-$2');

const mascaraCep = (valor) => valor.replace(/\D/g, '').slice(0, 8)
  .replace(/^(\d{5})(\d)/, '$1-$2');

const camposVazios = {
  nome: '', cnpj: '', telefone: '', email: '', senha: '', confirmarSenha: '',
  cep: '', rua: '', numero: '', bairro: '', complemento: '', cidade: '', uf: '',
};

// Uma tela só: o estado "modo" troca entre entrar e cadastrar, sem mudar de página
const Login = ({ modoInicial = 'Login' }) => {

  const { entrarComoOng } = useContext(AdocaoContext);
  const navigate = useNavigate();

  const [modo, setModo] = useState(modoInicial);
  const [dados, setDados] = useState(camposVazios);
  const [erros, setErros] = useState({});
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [loading, setLoading] = useState(false); // Adicionado para bloquear o botão durante o envio

  const cadastrando = modo === 'Cadastro';

  const trocarModo = () => {
    setModo(cadastrando ? 'Login' : 'Cadastro');
    setErros({});
  }

  const alterar = (campo, valor) => {
    setDados((anterior) => ({ ...anterior, [campo]: valor }));
    if (erros[campo]) setErros((anterior) => ({ ...anterior, [campo]: '' }));
  }

  // Busca o endereço quando o CEP fica completo
  const preencherPeloCep = async (valor) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length !== 8) return;

    setBuscandoCep(true);
    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${numeros}/json/`);
      if (!data.erro) {
        setDados((anterior) => ({
          ...anterior,
          rua: data.logradouro || anterior.rua,
          bairro: data.bairro || anterior.bairro,
          cidade: data.localidade || anterior.cidade,
          uf: data.uf || anterior.uf,
        }));
        setErros((anterior) => ({ ...anterior, rua: '', bairro: '', cidade: '', uf: '' }));
      }
    } catch {
      // Sem internet ou serviço fora do ar: a ONG preenche o endereço na mão
    } finally {
      setBuscandoCep(false);
    }
  }

  const validar = () => {
    const novos = {};
    const cnpjNumeros = dados.cnpj.replace(/\D/g, '');

    if (cnpjNumeros.length !== 14) novos.cnpj = 'Informe um CNPJ completo, com 14 dígitos.';
    if (!dados.senha.trim()) novos.senha = 'A senha é obrigatória.';

    if (cadastrando) {
      const telefoneNumeros = dados.telefone.replace(/\D/g, '');
      const cepNumeros = dados.cep.replace(/\D/g, '');

      if (!dados.nome.trim()) novos.nome = 'Informe o nome da ONG.';
      if (telefoneNumeros.length < 10) novos.telefone = 'Informe um telefone com DDD.';
      if (!/^\S+@\S+\.\S+$/.test(dados.email)) novos.email = 'Informe um e-mail válido.';
      if (dados.senha.length < 6) novos.senha = 'A senha deve ter pelo menos 6 caracteres.';
      if (dados.senha !== dados.confirmarSenha) novos.confirmarSenha = 'As senhas não coincidem.';
      if (cepNumeros.length !== 8) novos.cep = 'Informe um CEP com 8 dígitos.';
      if (!dados.rua.trim()) novos.rua = 'Informe a rua.';
      if (!dados.numero.trim()) novos.numero = 'Informe o número.';
      if (!dados.bairro.trim()) novos.bairro = 'Informe o bairro.';
      if (!dados.cidade.trim()) novos.cidade = 'Informe a cidade.';
      if (dados.uf.trim().length !== 2) novos.uf = 'UF inválida.';
    }

    setErros(novos);
    return Object.keys(novos).length === 0;
  }

  const enviar = async (e) => {
    e.preventDefault();

    if (!validar()) {
      if (cadastrando) toast.error('Confira os campos destacados antes de continuar.');
      return;
    }

    setLoading(true);

    if (cadastrando) {
      try {
        // Envia os dados para a API (PostgreSQL)
        const resposta = await api.post('/ongs/cadastro', {
          nome: dados.nome,
          cnpj: dados.cnpj.replace(/\D/g, ''), // Envia só os números para o banco
          telefone: dados.telefone,
          email: dados.email,
          senha: dados.senha,
          rua: dados.rua,
          numero: dados.numero,
          complemento: dados.complemento,
          bairro: dados.bairro,
          cidade: dados.cidade,
          uf: dados.uf
        });

        toast.success(resposta.data.mensagem || 'Cadastro realizado com sucesso!');
        setDados({ ...camposVazios, cnpj: dados.cnpj });
        setModo('Login');
      } catch (erro) {
        console.error('Erro no cadastro:', erro);
        toast.error(erro.response?.data?.erro || 'Erro ao realizar o cadastro. Tente novamente.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // LOGICA DE LOGIN (Se não estiver a cadastrar)
    try {
      // Faz o pedido à nova rota do Node.js
      const resposta = await api.post('/ongs/login', {
        cnpj: dados.cnpj.replace(/\D/g, ''), // Limpa a pontuação do CNPJ
        senha: dados.senha
      });

      // Se der sucesso, guarda o token no navegador para o utilizador não perder a sessão
      localStorage.setItem('token', resposta.data.token);
      
      toast.success(resposta.data.mensagem);
      
      // Aqui atualizamos o Contexto com os dados verdadeiros da ONG que vieram do banco
      entrarComoOng(resposta.data.ong); 
      
      // Redireciona para a página inicial
      navigate('/');
      
    } catch (erro) {
      console.error('Erro no login:', erro);
      toast.error(erro.response?.data?.erro || 'Erro ao tentar aceder. Verifique os seus dados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex flex-col lg:flex-row bg-surface'>

      {/* Lado da marca */}
      <section className='w-full lg:w-1/2 bg-forest-800 text-white flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12'>

        <div className='flex items-center gap-2 mb-8'>
          <FaPaw className='text-brand-500 text-xl' />
          <p className='font-display text-xl font-semibold'>Rede ADota</p>
        </div>

        <img src={assets.logo} alt='Rede ADota' className='w-full max-w-md rounded-2xl' />

        <h1 className='font-display text-3xl sm:text-4xl font-extrabold leading-tight mt-8 max-w-md'>
          Um lar cheio de amor começa aqui
        </h1>

        <p className='text-white/70 leading-relaxed mt-4 max-w-md'>
          Área exclusiva das organizações parceiras. Entre para cadastrar animais, divulgar eventos
          e acompanhar as solicitações de adoção.
        </p>
      </section>

      {/* Lado do formulário */}
      <section className='w-full lg:w-1/2 flex flex-col'>

        <div className='px-8 sm:px-12 lg:px-16 pt-8'>
          <Link to='/' className='inline-flex items-center gap-2 text-sm text-muted hover:text-ink'>
            <FaArrowLeft className='text-xs' /> Voltar para o site
          </Link>
        </div>

        <div className='flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-16 py-10'>
          <div className='w-full max-w-lg'>

            <h2 className='font-display text-3xl font-bold text-forest-800'>
              {cadastrando ? 'Cadastrar ONG' : 'Entrar como ONG'}
            </h2>
            <p className='text-sm text-muted mt-2'>
              {cadastrando
                ? 'Preencha os dados da organização para fazer parte da rede.'
                : 'Acesse com o CNPJ cadastrado para gerenciar os animais da sua organização.'}
            </p>

            <form onSubmit={enviar} noValidate className='mt-8 flex flex-col gap-4'>

              {/* Só no cadastro */}
              {cadastrando && (
                <Campo
                  id='nome' rotulo='NOME DA ONG' type='text' placeholder='Ex: Amigos dos Animais'
                  value={dados.nome} onChange={(e) => alterar('nome', e.target.value)} erro={erros.nome}
                />
              )}

              <div className={cadastrando ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : ''}>
                <Campo
                  id='cnpj' rotulo='CNPJ' type='text' inputMode='numeric' autoComplete='username'
                  placeholder='00.000.000/0000-00' maxLength={18}
                  value={dados.cnpj} onChange={(e) => alterar('cnpj', mascaraCnpj(e.target.value))} erro={erros.cnpj}
                />

                {cadastrando && (
                  <Campo
                    id='telefone' rotulo='TELEFONE' type='text' inputMode='tel'
                    placeholder='(00) 00000-0000' maxLength={15}
                    value={dados.telefone} onChange={(e) => alterar('telefone', mascaraTelefone(e.target.value))} erro={erros.telefone}
                  />
                )}
              </div>

              {cadastrando && (
                <Campo
                  id='email' rotulo='E-MAIL DE ACESSO' type='email' autoComplete='email'
                  placeholder='contato@ong.org.br'
                  value={dados.email} onChange={(e) => alterar('email', e.target.value)} erro={erros.email}
                />
              )}

              {/* Senha */}
              <div className={cadastrando ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : ''}>
                <div>
                  <div className='flex items-center justify-between mb-1.5'>
                    <label htmlFor='senha' className='block text-xs font-medium text-muted'>SENHA</label>
                    {!cadastrando && (
                      <button
                        type='button'
                        onClick={() => toast.info('Recuperação de senha em breve.')}
                        className='text-xs text-brand-600 hover:underline cursor-pointer'
                      >
                        Esqueceu a senha?
                      </button>
                    )}
                  </div>

                  <div className='relative'>
                    <input
                      id='senha'
                      type={mostrarSenha ? 'text' : 'password'}
                      autoComplete={cadastrando ? 'new-password' : 'current-password'}
                      placeholder={cadastrando ? 'Mínimo 6 caracteres' : 'Digite sua senha'}
                      value={dados.senha}
                      onChange={(e) => alterar('senha', e.target.value)}
                      aria-invalid={Boolean(erros.senha)}
                      className={`w-full bg-white border rounded-lg px-4 py-3 pr-11 text-sm outline-none transition-colors placeholder:text-muted ${erros.senha ? 'border-recusado' : 'border-line focus:border-forest-500'}`}
                    />
                    <button
                      type='button'
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-forest-800 cursor-pointer'
                    >
                      {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {erros.senha && <p className='text-xs text-recusado mt-1.5'>{erros.senha}</p>}
                </div>

                {cadastrando && (
                  <Campo
                    id='confirmarSenha' rotulo='CONFIRMAR SENHA' type={mostrarSenha ? 'text' : 'password'}
                    autoComplete='new-password' placeholder='Repita a senha'
                    value={dados.confirmarSenha} onChange={(e) => alterar('confirmarSenha', e.target.value)} erro={erros.confirmarSenha}
                  />
                )}
              </div>

              {/* Endereço, só no cadastro */}
              {cadastrando && (
                <>
                  <p className='text-sm font-medium text-forest-800 border-t border-line pt-4 mt-1'>Endereço da sede</p>

                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <Campo
                      id='cep' rotulo={buscandoCep ? 'CEP (buscando...)' : 'CEP'} type='text' inputMode='numeric'
                      placeholder='00000-000' maxLength={9}
                      value={dados.cep}
                      onChange={(e) => {
                        const valor = mascaraCep(e.target.value);
                        alterar('cep', valor);
                        preencherPeloCep(valor);
                      }}
                      erro={erros.cep}
                    />
                    <Campo
                      className='sm:col-span-2'
                      id='rua' rotulo='RUA' type='text' placeholder='Nome da rua'
                      value={dados.rua} onChange={(e) => alterar('rua', e.target.value)} erro={erros.rua}
                    />
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <Campo
                      id='numero' rotulo='NÚMERO' type='text' inputMode='numeric' placeholder='123'
                      value={dados.numero} onChange={(e) => alterar('numero', e.target.value)} erro={erros.numero}
                    />
                    <Campo
                      className='sm:col-span-2'
                      id='bairro' rotulo='BAIRRO' type='text' placeholder='Nome do bairro'
                      value={dados.bairro} onChange={(e) => alterar('bairro', e.target.value)} erro={erros.bairro}
                    />
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <Campo
                      className='sm:col-span-2'
                      id='cidade' rotulo='CIDADE' type='text' placeholder='Nome da cidade'
                      value={dados.cidade} onChange={(e) => alterar('cidade', e.target.value)} erro={erros.cidade}
                    />
                    <Campo
                      id='uf' rotulo='UF' type='text' placeholder='AL' maxLength={2}
                      value={dados.uf} onChange={(e) => alterar('uf', e.target.value.toUpperCase())} erro={erros.uf}
                    />
                  </div>

                  <Campo
                    id='complemento' rotulo='COMPLEMENTO (OPCIONAL)' type='text' placeholder='Sala, bloco, ponto de referência...'
                    value={dados.complemento} onChange={(e) => alterar('complemento', e.target.value)}
                  />
                </>
              )}

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium py-3 rounded-lg transition-colors cursor-pointer mt-2 disabled:opacity-70'
              >
                {loading ? 'A processar...' : (cadastrando ? 'Concluir cadastro' : 'Entrar')}
              </button>
            </form>

            {/* Troca entre entrar e cadastrar, sem sair da tela */}
            <p className='text-sm text-muted text-center mt-6'>
              {cadastrando ? 'Sua ONG já faz parte da rede? ' : 'Sua ONG ainda não faz parte da rede? '}
              <button
                type='button'
                onClick={trocarModo}
                className='font-medium text-brand-600 hover:underline cursor-pointer'
              >
                {cadastrando ? 'Faça login' : 'Cadastre-se aqui'}
              </button>
            </p>

            {cadastrando && (
              <p className='text-xs text-muted text-center mt-4'>
                O cadastro passa por análise da equipe antes da liberação do acesso.
              </p>
            )}
          </div>
        </div>

        <p className='text-center text-xs text-muted pb-6 px-6'>
          © 2026 Rede ADota. Todos os direitos reservados.
        </p>
      </section>
    </div>
  )
}

export default Login