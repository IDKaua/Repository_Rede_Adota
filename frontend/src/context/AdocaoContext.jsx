/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

export const AdocaoContext = createContext();

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
                setListaEventos(resEventos.data);
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

    const criarEvento = async (dadosEvento) => {
        toast.info('Criação de eventos integrada à API em breve.');
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
        pets, ongs, eventos, criarEvento, menuAberto, setMenuAberto, busca, setBusca, especie, setEspecie, porte, setPorte, sexo, setSexo, limparFiltros, filtrarPets, enviarDoacao, enviarSolicitacao, buscarOng, atualizarOng, ongLogada, entrarComoOng, sairDaConta, carregandoDados
    }

    return (
        <AdocaoContext.Provider value={value}>
            {props.children}
        </AdocaoContext.Provider>
    )
}

export default AdocaoContextProvider;