/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { assets, capasEvento } from "../assets/assets";

export const AdocaoContext = createContext();

// Formata "2026-01-12" como "Seg, 12 jan", o formato usado nos cards
const formatarData = (valor) => {
    if (!valor) return 'Data a definir';
    const [ano, mes, dia] = valor.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    const semana = data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    const mesCurto = data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    return `${semana.charAt(0).toUpperCase()}${semana.slice(1)}, ${String(dia).padStart(2, '0')} ${mesCurto}`;
}

// Converte a linha do banco para o formato que as telas de eventos usam
const normalizarEvento = (linha) => {
    let sobre = linha.descricao || '';
    let { tipo, publico, destaque } = linha;

    // Eventos antigos guardavam tipo, público e animais juntos no fim da descrição
    const antigo = sobre.match(/^(.*?) \| Tipo: (.*?) \| Público: (.*?) \| Animais: (.*)$/s);
    if (!tipo && antigo) {
        [, sobre, tipo, publico, destaque] = antigo;
    }

    const horario = [linha.hora_inicio_texto, linha.hora_fim_texto].filter(Boolean).join('-');

    return {
        id: linha.id,
        id_ong: linha.id_ong,
        ong_nome: linha.ong_nome,
        tipo: tipo || 'Feiras de Adoção',
        titulo: linha.titulo_evento,
        data: formatarData(linha.data_iso),
        horario: horario || 'Horário a definir',
        local: linha.local_texto || 'Local não informado',
        descricao: sobre.length > 120 ? `${sobre.slice(0, 120).trim()}...` : sobre,
        sobre,
        destaque: destaque || '',
        publico: publico || 'Aberto ao público',
        inscricao: Boolean(publico) && publico !== 'Aberto ao público',
        imagem: linha.url_imagem ? `http://localhost:5000${linha.url_imagem}` : (capasEvento[tipo] || assets.logo),
        requisitos: Array.isArray(linha.requisitos) ? linha.requisitos : [],
        detalhes: Array.isArray(linha.detalhes) ? linha.detalhes : [],
        observacoes: linha.observacoes || '',
    }
}

const AdocaoContextProvider = (props) => {

    const [menuAberto, setMenuAberto] = useState(false);
    const [pets, setPets] = useState([]);
    const [ongs, setListaOngs] = useState([]);
    const [eventos, setListaEventos] = useState([]);
    const [carregandoDados, setCarregandoDados] = useState(true);

    useEffect(() => {
        const carregarDadosDoBanco = async () => {
            try {
                const [resPets, resOngs, resEventos] = await Promise.all([
                    api.get('/pets'),
                    api.get('/ongs'),
                    api.get('/eventos') // Eventos integrados
                ]);
                
                setPets(resPets.data);
                setListaOngs(resOngs.data);
                setListaEventos(resEventos.data.map(normalizarEvento));
            } catch (erro) {
                console.error("Erro ao conectar com o banco:", erro);
                toast.error("Falha ao carregar os dados do servidor.");
            } finally {
                setCarregandoDados(false);
            }
        };

        carregarDadosDoBanco();
    }, []);

    const [busca, setBusca] = useState('');
    const [especie, setEspecie] = useState('Todos');
    const [porte, setPorte] = useState('Todos');
    const [sexo, setSexo] = useState('Todos');

    const limparFiltros = () => {
        setBusca(''); setEspecie('Todos'); setPorte('Todos'); setSexo('Todos');
    }

    const filtrarPets = () => {
        return pets.filter((pet) => {
            const termo = busca.trim().toLowerCase();
            const combinaBusca = termo === '' || pet.nome.toLowerCase().includes(termo) || pet.raca.toLowerCase().includes(termo) || (pet.ong_cidade && pet.ong_cidade.toLowerCase().includes(termo));
            const combinaEspecie = especie === 'Todos' || pet.especie === especie;
            const combinaPorte = porte === 'Todos' || pet.porte === porte;
            const combinaSexo = sexo === 'Todos' || pet.sexo === sexo;
            return combinaBusca && combinaEspecie && combinaPorte && combinaSexo;
        })
    }

    const enviarDoacao = async (ong, formulario) => {
        try {
            await api.post('/solicitacoes/doacao', { ...formulario, id_ong: ong.id });
            toast.success(`Formulário de doação enviado para ${ong.nome}!`);
            return true;
        } catch (erro) {
            toast.error("Erro ao enviar doação.");
            return false;
        }
    }

    const enviarSolicitacao = async (pet, formulario) => {
        try {
            await api.post('/solicitacoes/adocao', { ...formulario, id_pet: pet.id, id_ong: pet.id_ong });
            toast.success(`Solicitação enviada para adotar ${pet.nome}!`);
            return true;
        } catch (erro) {
            toast.error("Erro ao enviar solicitação.");
            return false;
        }
    }

    // Envia os dados e as fotos do animal; depois recarrega a lista para ele aparecer em Animais
    const cadastrarPet = async (dadosPet, fotos) => {
        try {
            const formulario = new FormData();
            Object.entries(dadosPet).forEach(([campo, valor]) => formulario.append(campo, valor));
            fotos.forEach((foto) => formulario.append('fotos', foto));

            const resposta = await api.post('/pets', formulario);
            const resPets = await api.get('/pets');
            setPets(resPets.data);

            toast.success(`${dadosPet.nome} foi cadastrado(a) para adoção!`);
            return resposta.data.petId;
        } catch (erro) {
            console.error('Erro ao cadastrar pet:', erro);
            toast.error(erro.response?.data?.erro || 'Erro ao cadastrar o animal. Tente novamente.');
            return null;
        }
    }

    // Envia o evento com a capa; depois recarrega a agenda para ele aparecer na lista e no perfil da ONG
    const criarEvento = async (dadosEvento, capa) => {
        try {
            const formulario = new FormData();
            Object.entries(dadosEvento).forEach(([campo, valor]) => {
                formulario.append(campo, Array.isArray(valor) ? JSON.stringify(valor) : valor);
            });
            if (capa) formulario.append('imagem', capa);

            const resposta = await api.post('/eventos', formulario);
            const resEventos = await api.get('/eventos');
            setListaEventos(resEventos.data.map(normalizarEvento));

            toast.success('Evento publicado na agenda!');
            return { id: resposta.data.eventoId };
        } catch (erro) {
            console.error('Erro ao criar evento:', erro);
            toast.error(erro.response?.data?.erro || 'Erro ao publicar o evento. Tente novamente.');
            return null;
        }
    }

    const buscarOng = (ongId) => ongs.find((item) => item.id === Number(ongId));

    const atualizarOng = async (ongId, novosDados) => {
        try {
            const token = localStorage.getItem('token');
            const resposta = await api.put(`/ongs/${ongId}`, novosDados, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setListaOngs((anterior) => anterior.map((item) => item.id === ongId ? { ...item, ...resposta.data.ong } : item));
            
            if (ongLogada && ongLogada.id === ongId) {
                 const ongAtualizada = { ...ongLogada, ...resposta.data.ong };
                 setOngLogada(ongAtualizada);
                 localStorage.setItem('ong_logada', JSON.stringify(ongAtualizada));
            }

            toast.success(resposta.data.mensagem || 'Perfil da ONG atualizado!');
            return true;
        } catch (erro) {
            console.error('Erro ao atualizar ONG:', erro);
            toast.error(erro.response?.data?.erro || 'Erro ao atualizar o perfil. Tente novamente.');
            return false;
        }
    }

    const [ongLogada, setOngLogada] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const ongSalva = localStorage.getItem('ong_logada');
        if (token && ongSalva) setOngLogada(JSON.parse(ongSalva));
    }, []);

    const entrarComoOng = (dadosDaOng) => {
        setOngLogada(dadosDaOng);
        localStorage.setItem('ong_logada', JSON.stringify(dadosDaOng));
    }

    const sairDaConta = () => {
        setOngLogada(null);
        localStorage.removeItem('token');
        localStorage.removeItem('ong_logada');
        toast.info('Você saiu da conta.');
    }

    const value = {
        pets, ongs, eventos, criarEvento, cadastrarPet, menuAberto, setMenuAberto, busca, setBusca, especie, setEspecie, porte, setPorte, sexo, setSexo, limparFiltros, filtrarPets, enviarDoacao, enviarSolicitacao, buscarOng, atualizarOng, ongLogada, entrarComoOng, sairDaConta, carregandoDados
    }

    return (
        <AdocaoContext.Provider value={value}>
            {props.children}
        </AdocaoContext.Provider>
    )
}

export default AdocaoContextProvider;