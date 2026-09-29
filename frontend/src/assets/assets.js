/*
  Dados de exemplo (mock) usados enquanto o backend nao esta pronto.
  As fotos dos animais ficam nesta pasta, nomeadas pela raca do animal.
  As fotos dos eventos seguem o tipo de cada um (feira, vacinacao, castracao).
*/

import logo from './logo.png'

// Fotos dos caes
import cavapoo from './cavapoo.jpg'
import labradorFilhote from './labrador-filhote.jpg'
import labradorRetriever from './labrador-retriever.jpg'
import maltipoo from './maltipoo.jpg'
import pastorAustraliano from './pastor-australiano.jpg'
import samoieda from './samoieda.jpg'
import viraLataCaramelo from './vira-lata-caramelo.jpg'
import yorkshireTerrier from './yorkshire-terrier.jpg'

// Fotos dos gatos
import angoraMix from './angora-mix.jpg'
import bombaim from './bombaim.jpg'
import britishShorthair from './british-shorthair.jpg'
import gatoBicolor from './gato-bicolor.jpg'
import gatoLaranja from './gato-laranja.jpg'
import gatoRajado from './gato-rajado.jpg'
import ragdoll from './ragdoll.jpg'
import siames from './siames.jpg'

// Fotos dos eventos
import feiraAdocao1 from './feira-adocao-1.jpg'
import feiraAdocao2 from './feira-adocao-2.jpg'
import vacinacao1 from './vacinacao-1.jpg'
import vacinacao2 from './vacinacao-2.jpg'
import castracao1 from './castracao-1.jpg'
import castracao2 from './castracao-2.jpg'

export const assets = { logo }


export const ongsParceiras = [
  { _id: 'p1', nome: 'WWF', sigla: 'WWF', cor: 'bg-forest-600' },
  { _id: 'p2', nome: 'Instituto Luisa Mell', sigla: 'LM', cor: 'bg-brand-500' },
  { _id: 'p3', nome: 'PETA', sigla: 'P', cor: 'bg-forest-500' },
  { _id: 'p4', nome: 'AMPARA Animal', sigla: 'A', cor: 'bg-solicitado' },
  { _id: 'p5', nome: 'SOS Animal', sigla: 'SOS', cor: 'bg-brand-600' },
]

export const ongs = [
  {
    _id: 'o1', nome: 'Patas do Amanhã', sigla: 'PA', cor: 'bg-brand-500', local: 'Maceió - AL',
    descricao: 'Instituição dedicada ao resgate, reabilitação e encaminhamento para adoção responsável de cães e gatos em situação de abandono.',
    whatsapp: '5582999990001', cnpj: '12345678000190', verificada: true,
    telefone: '(82) 98765-4321', email: 'contato@patasdoamanha.org.br',
    endereco: 'Rua das Flores, 123 - Jaraguá, Maceió - AL', responsavel: 'Maria Silva',
    atuacao: ['Resgate e acolhimento', 'Adoção responsável', 'Voluntariado'],
    redes: { instagram: '@patasdoamanha', facebook: '/patasdoamanha', site: 'www.patasdoamanha.org.br' },
  },
  {
    _id: 'o2', nome: 'Esperança Animal', sigla: 'EA', cor: 'bg-forest-500', local: 'Maceió - AL',
    descricao: 'ONG formada por voluntários que acolhem animais vítimas de maus-tratos e acompanham cada adoção após a entrega.',
    whatsapp: '5582999990002', cnpj: '23456789000181', verificada: true,
    telefone: '(82) 98765-4322', email: 'contato@esperancaanimal.org.br',
    endereco: 'Av. Fernandes Lima, 480 - Farol, Maceió - AL', responsavel: 'João Pereira',
    atuacao: ['Resgate e acolhimento', 'Reabilitação', 'Acompanhamento pós-adoção'],
    redes: { instagram: '@esperancaanimal', facebook: '/esperancaanimal', site: 'www.esperancaanimal.org.br' },
  },
  {
    _id: 'o3', nome: 'Vida Pet', sigla: 'VP', cor: 'bg-solicitado', local: 'Maceió - AL',
    descricao: 'Projeto voltado à castração, vacinação e adoção responsável, com foco em reduzir o abandono na região metropolitana.',
    whatsapp: '5582999990003', cnpj: '34567890000172', verificada: true,
    telefone: '(82) 98765-4323', email: 'contato@vidapet.org.br',
    endereco: 'Rua do Comércio, 55 - Benedito Bentes, Maceió - AL', responsavel: 'Ana Duarte',
    atuacao: ['Castração', 'Vacinação', 'Adoção responsável'],
    redes: { instagram: '@vidapetmaceio', facebook: '/vidapetmaceio', site: 'www.vidapet.org.br' },
  },
  {
    _id: 'o4', nome: 'Refúgio Animal Maceió', sigla: 'RM', cor: 'bg-forest-700', local: 'Maceió - AL',
    descricao: 'Abrigo que mantém cães e gatos resgatados até encontrarem uma família, oferecendo cuidado veterinário contínuo.',
    whatsapp: '5582999990004', cnpj: '45678901000163', verificada: false,
    telefone: '(82) 98765-4324', email: 'contato@refugioanimalmaceio.org.br',
    endereco: 'Rua dos Animais, 88 - Tabuleiro, Maceió - AL', responsavel: 'Carlos Menezes',
    atuacao: ['Abrigo permanente', 'Cuidado veterinário', 'Voluntariado'],
    redes: { instagram: '@refugioanimalmcz', facebook: '/refugioanimalmcz', site: 'www.refugioanimalmaceio.org.br' },
  },
]

export const pets = [
  {
    _id: 'a1', nome: 'Thor', especie: 'Cachorro', raca: 'SRD (Vira-lata)', idade: '2 anos', porte: 'Médio', sexo: 'Macho',
    local: 'Maceió - AL', ong: 'o1', castrado: true, vacinado: true, vermifugado: true, microchipado: true,
    necessidadesEspeciais: 'Não', tag: 'Dócil', imagem: viraLataCaramelo,
    personalidade: 'Brincalhão, carinhoso e muito sociável.',
    historia: 'Thor foi resgatado das ruas e agora busca um lar amoroso. É extremamente carinhoso com adultos e crianças, se dá bem com outros cães e adora passeios ao ar livre. Tem energia média e precisa de espaço ou passeios frequentes para se exercitar.',
  },
  {
    _id: 'a2', nome: 'Luna', especie: 'Gato', raca: 'SRD (Vira-lata)', idade: '1 ano', porte: 'Pequeno', sexo: 'Fêmea',
    local: 'Maceió - AL', ong: 'o1', castrado: true, vacinado: true, vermifugado: true, microchipado: false,
    necessidadesEspeciais: 'Não', tag: 'Brincalhona', imagem: gatoBicolor,
    personalidade: 'Curiosa, ativa e cheia de energia.',
    historia: 'Luna foi encontrada ainda filhote dentro de uma caixa perto da sede da ONG. Cresceu cercada de cuidado e hoje adora brinquedos, lugares altos e a companhia de outros gatos.',
  },
  {
    _id: 'a3', nome: 'Bento', especie: 'Cachorro', raca: 'Pastor Australiano', idade: '3 anos', porte: 'Médio', sexo: 'Macho',
    local: 'Maceió - AL', ong: 'o1', castrado: false, vacinado: true, vermifugado: true, microchipado: true,
    necessidadesEspeciais: 'Não', tag: 'Guardião', imagem: pastorAustraliano,
    personalidade: 'Atento, leal e muito companheiro.',
    historia: 'Bento chegou à ONG quando a família não pôde mais cuidar dele. É obediente, aprende comandos com facilidade e precisa de espaço para gastar a energia que tem de sobra.',
  },
  {
    _id: 'a4', nome: 'Mel', especie: 'Gato', raca: 'British Shorthair', idade: '2 anos', porte: 'Pequeno', sexo: 'Fêmea',
    local: 'Maceió - AL', ong: 'o1', castrado: true, vacinado: true, vermifugado: true, microchipado: true,
    necessidadesEspeciais: 'Não', tag: 'Tímida', imagem: britishShorthair,
    personalidade: 'Tranquila, discreta e observadora.',
    historia: 'Mel foi resgatada de um abrigo superlotado. Leva um tempo para confiar em pessoas novas, mas depois que se solta não desgruda de quem cuida dela. Prefere casas calmas.',
  },

  {
    _id: 'a5', nome: 'Bob', especie: 'Cachorro', raca: 'Labrador Retriever', idade: '4 anos', porte: 'Grande', sexo: 'Macho',
    local: 'Maceió - AL', ong: 'o2', castrado: true, vacinado: true, vermifugado: true, microchipado: true,
    necessidadesEspeciais: 'Não', tag: 'Protetor', imagem: labradorRetriever,
    personalidade: 'Companheiro, obediente e protetor.',
    historia: 'Bob viveu preso a uma corrente por anos até ser resgatado por voluntários. Hoje é um cão equilibrado, adora água e brincadeiras de buscar bolinha.',
  },
  {
    _id: 'a6', nome: 'Chloe', especie: 'Gato', raca: 'Ragdoll', idade: '2 anos', porte: 'Pequeno', sexo: 'Fêmea',
    local: 'Maceió - AL', ong: 'o2', castrado: false, vacinado: true, vermifugado: true, microchipado: false,
    necessidadesEspeciais: 'Não', tag: 'Meiga', imagem: ragdoll,
    personalidade: 'Dócil, carinhosa e muito calma.',
    historia: 'Chloe foi entregue à ONG após o falecimento do tutor. Aceita colo sem resistência, convive bem com outros gatos e procura sempre o lugar mais tranquilo da casa.',
  },
  {
    _id: 'a7', nome: 'Rex', especie: 'Cachorro', raca: 'Samoieda', idade: '3 anos', porte: 'Grande', sexo: 'Macho',
    local: 'Maceió - AL', ong: 'o2', castrado: true, vacinado: true, vermifugado: true, microchipado: true,
    necessidadesEspeciais: 'Escovação frequente por causa do pelo longo', tag: 'Companheiro', imagem: samoieda,
    personalidade: 'Alegre, brincalhão e muito sociável.',
    historia: 'Rex foi encontrado perdido e o tutor nunca foi localizado. Se dá bem com praticamente todo mundo, mas precisa de cuidados constantes com a pelagem.',
  },
  {
    _id: 'a8', nome: 'Nina', especie: 'Gato', raca: 'Angorá Mix', idade: '1 ano', porte: 'Pequeno', sexo: 'Fêmea',
    local: 'Maceió - AL', ong: 'o2', castrado: true, vacinado: true, vermifugado: true, microchipado: false,
    necessidadesEspeciais: 'Não', tag: 'Curiosa', imagem: angoraMix,
    personalidade: 'Curiosa, independente e brincalhona.',
    historia: 'Nina veio de uma ninhada resgatada em um terreno baldio. Explora tudo o que vê pela frente e transforma qualquer caixa de papelão em brinquedo.',
  },

  {
    _id: 'a9', nome: 'Toby', especie: 'Cachorro', raca: 'Yorkshire Terrier', idade: '2 anos', porte: 'Pequeno', sexo: 'Macho',
    local: 'Maceió - AL', ong: 'o3', castrado: false, vacinado: true, vermifugado: true, microchipado: false,
    necessidadesEspeciais: 'Não', tag: 'Brincalhão', imagem: yorkshireTerrier,
    personalidade: 'Agitado, alegre e muito apegado.',
    historia: 'Toby foi deixado na porta da ONG dentro de uma caixa. Apesar do tamanho pequeno, tem energia de sobra e adora passear pela vizinhança.',
  },
  {
    _id: 'a10', nome: 'Simba', especie: 'Gato', raca: 'SRD (Vira-lata)', idade: '4 anos', porte: 'Médio', sexo: 'Macho',
    local: 'Maceió - AL', ong: 'o3', castrado: true, vacinado: true, vermifugado: true, microchipado: true,
    necessidadesEspeciais: 'Acompanhamento veterinário para alergia de pele', tag: 'Independente', imagem: gatoLaranja,
    personalidade: 'Independente, calmo e observador.',
    historia: 'Simba vivia nas ruas do bairro e era alimentado pelos vizinhos até ser acolhido pela ONG. Gosta de rotina, janelas ensolaradas e de escolher a hora do carinho.',
  },
  {
    _id: 'a11', nome: 'Lola', especie: 'Cachorro', raca: 'Cavapoo', idade: '1 ano', porte: 'Pequeno', sexo: 'Fêmea',
    local: 'Maceió - AL', ong: 'o3', castrado: true, vacinado: true, vermifugado: true, microchipado: true,
    necessidadesEspeciais: 'Não', tag: 'Companheira', imagem: cavapoo,
    personalidade: 'Dócil, sociável e muito apegada.',
    historia: 'Lola foi resgatada de um criadouro irregular junto com outros filhotes. Convive bem com crianças e outros animais e não gosta de ficar sozinha por muito tempo.',
  },
  {
    _id: 'a12', nome: 'Zeca', especie: 'Gato', raca: 'Bombaim', idade: '3 anos', porte: 'Pequeno', sexo: 'Macho',
    local: 'Maceió - AL', ong: 'o3', castrado: true, vacinado: true, vermifugado: true, microchipado: false,
    necessidadesEspeciais: 'Prefere ser o único gato da casa', tag: 'Atrevido', imagem: bombaim,
    personalidade: 'Esperto, ativo e cheio de personalidade.',
    historia: 'Zeca chegou machucado à ONG e se recuperou completamente depois de meses de tratamento. É brincalhão, mas não divide bem o espaço com outros gatos.',
  },

  {
    _id: 'a13', nome: 'Pipoca', especie: 'Cachorro', raca: 'Maltipoo', idade: '2 anos', porte: 'Pequeno', sexo: 'Fêmea',
    local: 'Maceió - AL', ong: 'o4', castrado: true, vacinado: true, vermifugado: true, microchipado: true,
    necessidadesEspeciais: 'Não', tag: 'Agitada', imagem: maltipoo,
    personalidade: 'Agitada, curiosa e muito carinhosa.',
    historia: 'Pipoca foi resgatada ainda filhote junto com os irmãos. É a mais elétrica da ninhada e passa o dia atrás de bolinhas e brinquedos.',
  },
  {
    _id: 'a14', nome: 'Amora', especie: 'Gato', raca: 'SRD (Vira-lata)', idade: '1 ano', porte: 'Pequeno', sexo: 'Fêmea',
    local: 'Maceió - AL', ong: 'o4', castrado: true, vacinado: true, vermifugado: true, microchipado: false,
    necessidadesEspeciais: 'Não', tag: 'Brincalhona', imagem: gatoRajado,
    personalidade: 'Brincalhona, sociável e esperta.',
    historia: 'Amora apareceu no quintal de uma voluntária e nunca mais saiu. Convive bem com outros gatos e adora ser escovada no fim do dia.',
  },
  {
    _id: 'a15', nome: 'Fred', especie: 'Cachorro', raca: 'Labrador Retriever', idade: '8 meses', porte: 'Médio', sexo: 'Macho',
    local: 'Maceió - AL', ong: 'o4', castrado: false, vacinado: true, vermifugado: true, microchipado: false,
    necessidadesEspeciais: 'Ainda em fase de adestramento básico', tag: 'Dócil', imagem: labradorFilhote,
    personalidade: 'Dócil, brincalhão e cheio de energia.',
    historia: 'Fred nasceu no abrigo e está pronto para conhecer sua família. Por ser filhote, precisa de um tutor com paciência para acompanhar a fase de aprendizado.',
  },
  {
    _id: 'a16', nome: 'Jade', especie: 'Gato', raca: 'Siamês', idade: '3 anos', porte: 'Pequeno', sexo: 'Fêmea',
    local: 'Maceió - AL', ong: 'o4', castrado: true, vacinado: true, vermifugado: true, microchipado: true,
    necessidadesEspeciais: 'Não', tag: 'Carinhosa', imagem: siames,
    personalidade: 'Carinhosa, comunicativa e apegada.',
    historia: 'Jade foi devolvida por uma família que não pôde mais cuidar dela. É bastante vocal, conversa o tempo todo e acompanha os tutores por toda a casa.',
  },
]

export const eventos = [
  {
    _id: 'e1', tipo: 'Feiras de Adoção', titulo: 'Feira de Adoção - Praça Central', ong: 'o1',
    data: 'Sáb, 12 jan', horario: '10:00-16:00', local: 'Praça Centenário, Farol, Maceió - AL',
    descricao: 'Encontre cães e gatos para adoção. Consulta veterinária e orientação de cuidado.',
    destaque: '18 animais disponíveis', inscricao: false, publico: 'Aberto ao público', imagem: feiraAdocao1,
    sobre: 'A feira reúne animais resgatados pela ONG que já estão vacinados e prontos para ganhar uma família. Voluntários acompanham cada conversa, explicam a rotina de cada animal e ajudam a entender qual perfil combina com a sua casa. Também haverá orientação veterinária gratuita para quem já tem pets.',
    requisitos: ['Documento com foto', 'Comprovante de residência', 'Ser maior de 18 anos', 'Preencher o formulário de adoção no local'],
    detalhes: [
      { icone: 'pata', rotulo: 'Animais disponíveis', valor: '18 cães e gatos, todos vacinados' },
      { icone: 'documento', rotulo: 'Triagem', valor: 'Formulário e entrevista no local' },
      { icone: 'coracao', rotulo: 'Entrega', valor: 'No mesmo dia, após aprovação do cadastro' },
    ],
  },
  {
    _id: 'e2', tipo: 'Campanhas de Vacinação', titulo: 'Campanha de Vacinação - ONG Amigos', ong: 'o2',
    data: 'Dom, 14 jan', horario: '09:00-13:00', local: 'Rua das Flores, 120, Jatiúca, Maceió - AL',
    descricao: 'Vacinação antirrábica e orientação sobre saúde animal. Inscrição prévia recomendada.',
    destaque: '12 animais participantes', inscricao: true, publico: 'Inscrição prévia recomendada', imagem: vacinacao1,
    sobre: 'Campanha gratuita de vacinação antirrábica para cães e gatos do bairro e da região. A equipe veterinária também tira dúvidas sobre alimentação, vermifugação e cuidados básicos. A carteirinha de vacinação é entregue no local.',
    requisitos: ['Levar o animal em coleira, guia ou caixa de transporte', 'Animais acima de 3 meses', 'Levar a carteira de vacinação, se já tiver', 'Não levar fêmeas em período de gestação avançada'],
    detalhes: [
      { icone: 'seringa', rotulo: 'Vacinas aplicadas', valor: 'Antirrábica, V10 canina e V4 felina' },
      { icone: 'pata', rotulo: 'Público atendido', valor: 'Cães e gatos acima de 3 meses' },
    ],
  },
  {
    _id: 'e3', tipo: 'Mutirão de Castração', titulo: 'Mutirão de Castração - Clínica Vida', ong: 'o3',
    data: 'Sáb, 19 jan', horario: '08:00-17:00', local: 'Av. Fernandes Lima, 1000, Gruta de Lourdes, Maceió - AL',
    descricao: 'Castração e esterilização com equipe especializada. Agendamento necessário.',
    destaque: '24 vagas disponíveis', inscricao: true, publico: 'Somente com agendamento', imagem: castracao1,
    sobre: 'Mutirão de castração com valor social, realizado por equipe veterinária especializada. A castração previne doenças, reduz o abandono e melhora a qualidade de vida do animal. Cada tutor recebe orientação completa sobre o pós-operatório.',
    requisitos: ['Agendamento prévio pelo WhatsApp da ONG', 'Jejum de 8 horas antes do procedimento', 'Levar caixa de transporte ou coleira', 'Retornar para retirada dos pontos em 10 dias'],
    detalhes: [
      { icone: 'tesoura', rotulo: 'Procedimento', valor: 'Castração de cães e gatos, machos e fêmeas' },
      { icone: 'pata', rotulo: 'Vagas', valor: '24 vagas, por ordem de agendamento' },
      { icone: 'aviso', rotulo: 'Preparo', valor: 'Jejum de 8 horas antes do horário marcado' },
    ],
  },
  {
    _id: 'e4', tipo: 'Feiras de Adoção', titulo: 'Feira de Adoção - Parque Maceió', ong: 'o4',
    data: 'Dom, 21 jan', horario: '10:00-17:00', local: 'Parque Municipal, Bebedouro, Maceió - AL',
    descricao: 'Evento ao ar livre com adoção, orientação e atividades para família e pets.',
    destaque: '32 animais disponíveis', inscricao: false, publico: 'Aberto ao público', imagem: feiraAdocao2,
    sobre: 'Um dia inteiro no parque com animais disponíveis para adoção, atividades para crianças e espaço de convivência para quem já tem pets. É a maior feira do mês, com a participação de voluntários de várias ONGs parceiras da Rede ADota.',
    requisitos: ['Documento com foto', 'Comprovante de residência', 'Ser maior de 18 anos', 'Conversar com o voluntário responsável pelo animal'],
    detalhes: [
      { icone: 'pata', rotulo: 'Animais disponíveis', valor: '32 cães e gatos de 4 ONGs parceiras' },
      { icone: 'documento', rotulo: 'Triagem', valor: 'Formulário e entrevista no local' },
      { icone: 'coracao', rotulo: 'Também no evento', valor: 'Orientação veterinária e atividades para crianças' },
    ],
  },
  {
    _id: 'e5', tipo: 'Campanhas de Vacinação', titulo: 'Campanha de Vacinação - Bairro Leste', ong: 'o2',
    data: 'Sáb, 26 jan', horario: '09:00-16:00', local: 'Rua do Comércio, 55, Benedito Bentes, Maceió - AL',
    descricao: 'Vacinação e atendimento veterinário. Acompanhamento de saúde e orientação.',
    destaque: '20 animais participantes', inscricao: false, publico: 'Aberto ao público', imagem: vacinacao2,
    sobre: 'Ação itinerante que leva vacinação e atendimento veterinário básico para bairros com pouco acesso a clínicas. Além da vacina, a equipe avalia o estado geral do animal e encaminha os casos que precisam de tratamento.',
    requisitos: ['Levar o animal em coleira, guia ou caixa de transporte', 'Animais acima de 3 meses', 'Levar a carteira de vacinação, se já tiver', 'Atendimento por ordem de chegada'],
    detalhes: [
      { icone: 'seringa', rotulo: 'Vacinas aplicadas', valor: 'Antirrábica, com vermifugação no mesmo dia' },
      { icone: 'pata', rotulo: 'Público atendido', valor: 'Cães e gatos acima de 3 meses' },
    ],
  },
  {
    _id: 'e6', tipo: 'Mutirão de Castração', titulo: 'Mutirão de Castração - ONG Vida Animal', ong: 'o3',
    data: 'Sáb, 02 fev', horario: '08:00-17:00', local: 'Rua dos Animais, 88, Tabuleiro, Maceió - AL',
    descricao: 'Castração e esterilização com equipe especializada. Agendamento obrigatório.',
    destaque: '15 vagas disponíveis', inscricao: true, publico: 'Somente com agendamento', imagem: castracao2,
    sobre: 'Mutirão voltado a tutores de baixa renda e a protetores independentes que cuidam de animais comunitários. As vagas são limitadas e distribuídas por ordem de agendamento, com prioridade para fêmeas.',
    requisitos: ['Agendamento prévio pelo WhatsApp da ONG', 'Jejum de 8 horas antes do procedimento', 'Levar caixa de transporte ou coleira', 'Acompanhar o animal durante a recuperação no local'],
    detalhes: [
      { icone: 'tesoura', rotulo: 'Procedimento', valor: 'Castração de cães e gatos, com prioridade para fêmeas' },
      { icone: 'pata', rotulo: 'Vagas', valor: '15 vagas, com prioridade para animais comunitários' },
      { icone: 'aviso', rotulo: 'Preparo', valor: 'Jejum de 8 horas antes do horário marcado' },
    ],
  },
]

export const tiposDeEvento = ['Todos', 'Feiras de Adoção', 'Campanhas de Vacinação', 'Mutirão de Castração']
