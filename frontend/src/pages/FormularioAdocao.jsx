import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { AdocaoContext } from '../context/AdocaoContext';

const FormularioAdocao = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { pets, enviarSolicitacao } = useContext(AdocaoContext);
  const [loading, setLoading] = useState(false);

  const pet = pets.find((p) => p.id === Number(petId));

  const [dados, setDados] = useState({
    nome: '', cpf: '', email: '', telefone: '', moradia: 'Casa', quintal: 'Sim', outrosAnimais: 'Não', motivo: '', tempo: '', acompanhamento: 'Sim', observacoes: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!pet) return <div className='text-center py-20 text-muted'>Animal não encontrado.</div>;

  const handleChange = (e) => setDados({ ...dados, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const sucesso = await enviarSolicitacao(pet, dados);
    setLoading(false);
    if (sucesso) navigate(`/animais/${pet.id}`);
  };

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-10 max-w-3xl mx-auto'>
      <button onClick={() => navigate(-1)} className='inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-6'>
        <FaArrowLeft className='text-xs' /> Voltar
      </button>

      <div className='bg-white border border-line rounded-2xl p-6 sm:p-10 shadow-sm'>
        <div className='flex items-center gap-3 mb-8'>
          <FaHeart className='text-brand-500 text-2xl' />
          <h1 className='font-display text-2xl sm:text-3xl font-bold text-forest-800'>Adotar {pet.nome}</h1>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            <div>
              <label className='block text-xs font-medium text-muted mb-1.5'>NOME COMPLETO</label>
              <input type="text" name="nome" required value={dados.nome} onChange={handleChange} className='w-full bg-surface border border-line rounded-lg px-4 py-3 text-sm outline-none' />
            </div>
            <div>
              <label className='block text-xs font-medium text-muted mb-1.5'>CPF</label>
              <input type="text" name="cpf" required value={dados.cpf} onChange={handleChange} className='w-full bg-surface border border-line rounded-lg px-4 py-3 text-sm outline-none' />
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            <div>
              <label className='block text-xs font-medium text-muted mb-1.5'>E-MAIL</label>
              <input type="email" name="email" required value={dados.email} onChange={handleChange} className='w-full bg-surface border border-line rounded-lg px-4 py-3 text-sm outline-none' />
            </div>
            <div>
              <label className='block text-xs font-medium text-muted mb-1.5'>TELEFONE / WHATSAPP</label>
              <input type="text" name="telefone" required value={dados.telefone} onChange={handleChange} className='w-full bg-surface border border-line rounded-lg px-4 py-3 text-sm outline-none' />
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-line pt-5 mt-2'>
            <div>
              <label className='block text-xs font-medium text-muted mb-1.5'>TIPO DE MORADIA</label>
              <select name="moradia" value={dados.moradia} onChange={handleChange} className='w-full bg-surface border border-line rounded-lg px-4 py-3 text-sm outline-none'>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
              </select>
            </div>
            <div>
              <label className='block text-xs font-medium text-muted mb-1.5'>POSSUI QUINTAL?</label>
              <select name="quintal" value={dados.quintal} onChange={handleChange} className='w-full bg-surface border border-line rounded-lg px-4 py-3 text-sm outline-none'>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>
            <div>
              <label className='block text-xs font-medium text-muted mb-1.5'>OUTROS ANIMAIS?</label>
              <select name="outrosAnimais" value={dados.outrosAnimais} onChange={handleChange} className='w-full bg-surface border border-line rounded-lg px-4 py-3 text-sm outline-none'>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>
          </div>

          <div>
            <label className='block text-xs font-medium text-muted mb-1.5'>POR QUE DESEJA ADOTAR?</label>
            <textarea name="motivo" rows={3} required value={dados.motivo} onChange={handleChange} className='w-full bg-surface border border-line rounded-lg px-4 py-3 text-sm outline-none resize-none'></textarea>
          </div>

          <button type="submit" disabled={loading} className='w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3.5 rounded-lg mt-4 transition-colors disabled:opacity-70'>
            {loading ? 'Enviando solicitação...' : 'Enviar Solicitação de Adoção'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioAdocao;