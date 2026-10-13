// Helpers para exibir dados da ONG que vêm do banco (sigla, cor do avatar e WhatsApp)

export const gerarSigla = (nome) => {
  if (!nome) return 'ON';
  const palavras = nome.split(' ');
  if (palavras.length >= 2) return (palavras[0][0] + palavras[1][0]).toUpperCase();
  return nome.substring(0, 2).toUpperCase();
}

export const obterCor = (id) => {
  const cores = ['bg-brand-500', 'bg-forest-500', 'bg-blue-500', 'bg-orange-500', 'bg-purple-500'];
  return cores[(id || 0) % cores.length];
}

// Número só com dígitos, no formato que o wa.me espera
export const whatsappOng = (ong) => ong?.telefone?.replace(/\D/g, '') || '';
