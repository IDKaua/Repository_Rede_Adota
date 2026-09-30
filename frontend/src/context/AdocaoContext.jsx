/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api"; // A nossa ligação ao Node.js
// Removemos a importação do assets.js pois os dados agora vêm do banco!

export const AdocaoContext = createContext();

const AdocaoContextProvider = (props) => {

    // Menu lateral no mobile
    const [menuAberto, setMenuAberto] = useState(false);

    // ============================================================
    // 1. ESTADOS PRINCIPAIS (Vêm do PostgreSQL via Node.js)
    // ============================================================
    const [pets, setPets] = useState([]);
    const [ongs, setListaOngs] = useState([]);
    const [eventos, setListaEventos] = useState([]);
    const [carregandoDados, setCarregandoDados] = useState(true);

    // Efeito para carregar os dados iniciais ao abrir o site
    useEffect(() => {
        const carregarDadosDoBanco = async () => {
            try {
                // Carrega Pets e ONGs ao mesmo tempo
                const [resPets, resOngs] = await Promise.all([
                    api.get('/pets'),
                    api.get('/ongs')
                ]);
                
                setPets(resPets.data);
                setListaOngs(resOngs.data);
                
                // Os eventos podem vir daqui também quando a rota GET /eventos estiver pronta
                // const resEventos = await api.get('/eventos');
                // setListaEventos(resEventos.data);

            } catch (erro) {
                console.error("Erro ao conectar com o banco:", erro);
                toast.error("Falha ao carregar os dados do servidor.");
            } finally {
                setCarregandoDados(false);
            }
        };

        carregarDadosDoBanco();
    }, []);


    // ============================================================
    // 2. BUSCA E FILTROS DE ANIMAIS
    // ============================================================
    const [busca, setBusca] = useState('');
    const [especie, setEspecie] = useState('Todos');
    const [porte, setPorte] = useState('Todos');
    const [sexo, setSexo] = useState('Todos');

    const limparFiltros = () => {
        setBusca('');
        setEspecie('Todos');
        setPorte('Todos');
        setSexo('Todos');
    }

    const filtrarPets = () => {
        return pets.filter((pet) => {
            const termo = busca.trim().toLowerCase();
            const combinaBusca = termo === ''
                || pet.nome.toLowerCase().includes(termo)
                || pet.raca.toLowerCase().includes(termo)
                || (pet.cidade && pet.cidade.toLowerCase().includes(termo)); // Ajustado para o banco

            const combinaEspecie = especie === 'Todos' || pet.especie === especie;
            const combinaPorte = porte === 'Todos' || pet.porte === porte;
            const combinaSexo = sexo === 'Todos' || pet.sexo === sexo;

            return combinaBusca && combinaEspecie && combinaPorte && combinaSexo;
        })
    }


    // ============================================================
    // 3. SOLICITAÇÕES (Adoção e Doação)
    // ============================================================
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


    // ============================================================
    // 4. ONGS E EVENTOS
    // ============================================================
    const criarEvento = async (dadosEvento) => {
        // Implementaremos o POST de eventos aqui futuramente
        toast.info('Criação de eventos integrada à API em breve.');
    }

    const buscarOng = (ongId) => ongs.find((item) => item.id === Number(ongId)); // PostgreSQL usa IDs numéricos

    const atualizarOng = (ongId, novosDados) => {
        // Implementaremos o PUT /ongs aqui futuramente
        toast.info('Atualização de perfil em breve.');
    }


    // ============================================================
    // 5. AUTENTICAÇÃO (SESSÃO DA ONG REAL)
    // ============================================================
    const [ongLogada, setOngLogada] = useState(null);

    // Quando o utilizador recarrega a página, tenta recuperar o login
    useEffect(() => {
        const token = localStorage.getItem('token');
        const ongSalva = localStorage.getItem('ong_logada');
        
        if (token && ongSalva) {
            setOngLogada(JSON.parse(ongSalva));
        }
    }, []);

    // Chamado pelo Login.jsx quando o Node.js responde com sucesso
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
        pets,
        ongs,
        eventos,
        criarEvento,
        menuAberto,
        setMenuAberto,
        busca,
        setBusca,
        especie,
        setEspecie,
        porte,
        setPorte,
        sexo,
        setSexo,
        limparFiltros,
        filtrarPets,
        enviarDoacao,
        enviarSolicitacao,
        buscarOng,
        atualizarOng,
        ongLogada,
        entrarComoOng,
        sairDaConta,
        carregandoDados // Pode usar isto para mostrar um spinner no React enquanto o banco responde
    }

    return (
        <AdocaoContext.Provider value={value}>
            {props.children}
        </AdocaoContext.Provider>
    )
}

export default AdocaoContextProvider;