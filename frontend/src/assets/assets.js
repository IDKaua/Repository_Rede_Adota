/*
  Dados de exemplo (mock) usados enquanto o backend nao esta pronto.
  As imagens apontam para um servico de placeholder; quando a API com
  Multer/Sharp estiver no ar, troque "imagem" pela URL devolvida pelo servidor.
*/

import logo from './logo.png'

export const assets = { logo }

const foto = (semente) => `https://picsum.photos/seed/${semente}/600/400`

export const ongsParceiras = [
  { _id: 'p1', nome: 'WWF', sigla: 'WWF', cor: 'bg-forest-600' },
  { _id: 'p2', nome: 'Instituto Luisa Mell', sigla: 'LM', cor: 'bg-brand-500' },
  { _id: 'p3', nome: 'PETA', sigla: 'P', cor: 'bg-forest-500' },
  { _id: 'p4', nome: 'AMPARA Animal', sigla: 'A', cor: 'bg-solicitado' },
  { _id: 'p5', nome: 'SOS Animal', sigla: 'SOS', cor: 'bg-brand-600' },
]

export const ongs = [
  { _id: 'o1', nome: 'Patas do Amanhã', sigla: 'PA', cor: 'bg-brand-500' },
  { _id: 'o2', nome: 'Esperança Animal', sigla: 'EA', cor: 'bg-forest-500' },
  { _id: 'o3', nome: 'Vida Pet', sigla: 'VP', cor: 'bg-solicitado' },
  { _id: 'o4', nome: 'Refúgio Animal Maceió', sigla: 'RM', cor: 'bg-forest-700' },
]

export const pets = [
  { _id: 'a1', nome: 'Thor', especie: 'Cachorro', raca: 'SRD (Vira-lata)', idade: '2 anos', porte: 'Médio', sexo: 'Macho', local: 'Maceió - AL', ong: 'o1', castrado: true, vacinado: true, tag: 'Dócil', imagem: foto('thor') },
  { _id: 'a2', nome: 'Luna', especie: 'Gato', raca: 'SRD (Vira-lata)', idade: '1 ano', porte: 'Pequeno', sexo: 'Fêmea', local: 'Maceió - AL', ong: 'o1', castrado: true, vacinado: true, tag: 'Brincalhona', imagem: foto('luna') },
  { _id: 'a3', nome: 'Bento', especie: 'Cachorro', raca: 'SRD (Vira-lata)', idade: '3 anos', porte: 'Médio', sexo: 'Macho', local: 'Maceió - AL', ong: 'o1', castrado: false, vacinado: true, tag: 'Guardião', imagem: foto('bento') },
  { _id: 'a4', nome: 'Mel', especie: 'Gato', raca: 'Siamês', idade: '2 anos', porte: 'Pequeno', sexo: 'Fêmea', local: 'Maceió - AL', ong: 'o1', castrado: true, vacinado: true, tag: 'Tímida', imagem: foto('mel') },

  { _id: 'a5', nome: 'Bob', especie: 'Cachorro', raca: 'Labrador Mix', idade: '4 anos', porte: 'Grande', sexo: 'Macho', local: 'Maceió - AL', ong: 'o2', castrado: true, vacinado: true, tag: 'Protetor', imagem: foto('bob') },
  { _id: 'a6', nome: 'Chloe', especie: 'Gato', raca: 'SRD (Vira-lata)', idade: '2 anos', porte: 'Pequeno', sexo: 'Fêmea', local: 'Maceió - AL', ong: 'o2', castrado: false, vacinado: true, tag: 'Meiga', imagem: foto('chloe') },
  { _id: 'a7', nome: 'Rex', especie: 'Cachorro', raca: 'Pitbull Mix', idade: '3 anos', porte: 'Grande', sexo: 'Macho', local: 'Maceió - AL', ong: 'o2', castrado: true, vacinado: true, tag: 'Companheiro', imagem: foto('rex') },
  { _id: 'a8', nome: 'Nina', especie: 'Gato', raca: 'SRD (Vira-lata)', idade: '1 ano', porte: 'Pequeno', sexo: 'Fêmea', local: 'Maceió - AL', ong: 'o2', castrado: true, vacinado: true, tag: 'Curiosa', imagem: foto('nina') },

  { _id: 'a9', nome: 'Toby', especie: 'Cachorro', raca: 'SRD (Vira-lata)', idade: '2 anos', porte: 'Pequeno', sexo: 'Macho', local: 'Maceió - AL', ong: 'o3', castrado: false, vacinado: true, tag: 'Brincalhão', imagem: foto('toby') },
  { _id: 'a10', nome: 'Simba', especie: 'Gato', raca: 'Persa Mix', idade: '4 anos', porte: 'Médio', sexo: 'Macho', local: 'Maceió - AL', ong: 'o3', castrado: true, vacinado: true, tag: 'Independente', imagem: foto('simba') },
  { _id: 'a11', nome: 'Lola', especie: 'Cachorro', raca: 'Golden Retriever Mix', idade: '5 anos', porte: 'Grande', sexo: 'Fêmea', local: 'Maceió - AL', ong: 'o3', castrado: true, vacinado: true, tag: 'Companheira', imagem: foto('lola') },
  { _id: 'a12', nome: 'Zeca', especie: 'Gato', raca: 'SRD (Vira-lata)', idade: '3 anos', porte: 'Pequeno', sexo: 'Macho', local: 'Maceió - AL', ong: 'o3', castrado: true, vacinado: true, tag: 'Atrevido', imagem: foto('zeca') },

  { _id: 'a13', nome: 'Pipoca', especie: 'Cachorro', raca: 'SRD (Vira-lata)', idade: '2 anos', porte: 'Pequeno', sexo: 'Fêmea', local: 'Maceió - AL', ong: 'o4', castrado: true, vacinado: true, tag: 'Agitada', imagem: foto('pipoca') },
  { _id: 'a14', nome: 'Amora', especie: 'Gato', raca: 'SRD (Vira-lata)', idade: '1 ano', porte: 'Pequeno', sexo: 'Fêmea', local: 'Maceió - AL', ong: 'o4', castrado: true, vacinado: true, tag: 'Brincalhona', imagem: foto('amora') },
  { _id: 'a15', nome: 'Fred', especie: 'Cachorro', raca: 'SRD (Vira-lata)', idade: '3 anos', porte: 'Médio', sexo: 'Macho', local: 'Maceió - AL', ong: 'o4', castrado: false, vacinado: true, tag: 'Dócil', imagem: foto('fred') },
  { _id: 'a16', nome: 'Jade', especie: 'Gato', raca: 'Siamês', idade: '3 anos', porte: 'Pequeno', sexo: 'Fêmea', local: 'Maceió - AL', ong: 'o4', castrado: true, vacinado: true, tag: 'Carinhosa', imagem: foto('jade') },
]

export const eventos = [
  { _id: 'e1', tipo: 'Feiras de Adoção', titulo: 'Feira de Adoção - Praça Central', data: 'Sáb, 12 jan', horario: '10:00-16:00', local: 'Praça Central, São Paulo - SP', descricao: 'Encontre cães e gatos para adoção. Consulta veterinária e orientação de cuidado.', destaque: '18 animais disponíveis', imagem: foto('feira1') },
  { _id: 'e2', tipo: 'Campanhas de Vacinação', titulo: 'Campanha de Vacinação - ONG Amigos', data: 'Dom, 14 jan', horario: '09:00-13:00', local: 'Rua das Flores, 120, Curitiba - PR', descricao: 'Vacinação antirrábica e orientação sobre saúde animal. Inscrição prévia recomendada.', destaque: '12 animais participantes', imagem: foto('vacina1') },
  { _id: 'e3', tipo: 'Mutirão de Castração', titulo: 'Mutirão de Castração - Clínica Vida', data: 'Sáb, 19 jan', horario: '08:00-17:00', local: 'Av. Paulista, 1000, São Paulo - SP', descricao: 'Castração e esterilização com equipe especializada. Agendamento necessário.', destaque: '24 vagas disponíveis', imagem: foto('castra1') },
  { _id: 'e4', tipo: 'Feiras de Adoção', titulo: 'Feira de Adoção - Parque Maceió', data: 'Dom, 21 jan', horario: '10:00-17:00', local: 'Parque do Ibirapuera, São Paulo - SP', descricao: 'Evento ao ar livre com adoção, orientação e atividades para família e pets.', destaque: '32 animais disponíveis', imagem: foto('feira2') },
  { _id: 'e5', tipo: 'Campanhas de Vacinação', titulo: 'Campanha de Vacinação - Bairro Leste', data: 'Sáb, 26 jan', horario: '09:00-16:00', local: 'Rua do Comércio, 55, Belo Horizonte - MG', descricao: 'Vacinação e atendimento veterinário. Acompanhamento de saúde e orientação.', destaque: '20 animais participantes', imagem: foto('vacina2') },
  { _id: 'e6', tipo: 'Mutirão de Castração', titulo: 'Mutirão de Castração - ONG Vida Animal', data: 'Sáb, 02 fev', horario: '08:00-17:00', local: 'Rua dos Animais, 88, Porto Alegre - RS', descricao: 'Castração e esterilização com equipe especializada. Agendamento obrigatório.', destaque: '15 vagas disponíveis', imagem: foto('castra2') },
]

export const tiposDeEvento = ['Todos', 'Feiras de Adoção', 'Campanhas de Vacinação', 'Mutirão de Castração']
