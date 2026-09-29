/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { eventos, ongs, ongsParceiras, pets } from "../assets/assets";

export const AdocaoContext = createContext();

const AdocaoContextProvider = (props) => {

    // Menu lateral no mobile
    const [menuAberto, setMenuAberto] = useState(false);

    // Busca e filtros da pagina de Animais
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

    // Aplica busca + filtros sobre a lista de pets
    const filtrarPets = () => {
        return pets.filter((pet) => {
            const termo = busca.trim().toLowerCase();
            const combinaBusca = termo === ''
                || pet.nome.toLowerCase().includes(termo)
                || pet.raca.toLowerCase().includes(termo)
                || pet.local.toLowerCase().includes(termo);

            const combinaEspecie = especie === 'Todos' || pet.especie === especie;
            const combinaPorte = porte === 'Todos' || pet.porte === porte;
            const combinaSexo = sexo === 'Todos' || pet.sexo === sexo;

            return combinaBusca && combinaEspecie && combinaPorte && combinaSexo;
        })
    }


    // Ofertas de doacao de animais enviadas pelos tutores
    const [doacoes, setDoacoes] = useState([]);

    const enviarDoacao = (ong, formulario) => {
        const doacao = {
            _id: `d${Date.now()}`,
            ong: ong._id,
            status: 'Solicitado',
            enviadaEm: new Date().toLocaleDateString('pt-BR'),
            ...formulario,
        };

        setDoacoes((anterior) => [doacao, ...anterior]);
        toast.success(`Formulário de doação enviado para ${ong.nome}!`);
        return doacao;
    }

    // Solicitacoes de adocao enviadas pelo formulario
    const [solicitacoes, setSolicitacoes] = useState([]);

    const enviarSolicitacao = (pet, formulario) => {
        const solicitacao = {
            _id: `s${Date.now()}`,
            pet: pet._id,
            ong: pet.ong,
            status: 'Solicitado',
            enviadaEm: new Date().toLocaleDateString('pt-BR'),
            ...formulario,
        };

        setSolicitacoes((anterior) => [solicitacao, ...anterior]);
        toast.success(`Solicitação enviada para ${pet.nome}!`);
        return solicitacao;
    }


    // A lista fica em estado porque a ONG pode editar o proprio perfil
    const [listaOngs, setListaOngs] = useState(ongs);

    // Eventos tambem ficam em estado: a ONG cria novos pela plataforma
    const [listaEventos, setListaEventos] = useState(eventos);

    const criarEvento = (dadosEvento) => {
        const novo = { ...dadosEvento, _id: `e${Date.now()}` };
        setListaEventos((anterior) => [novo, ...anterior]);
        toast.success('Evento criado e publicado na agenda!');
        return novo;
    }

    const buscarOng = (ongId) => listaOngs.find((item) => item._id === ongId);

    const atualizarOng = (ongId, novosDados) => {
        setListaOngs((anterior) => anterior.map((item) => (
            item._id === ongId ? { ...item, ...novosDados } : item
        )));
        toast.success('Perfil da ONG atualizado!');
    }

    // Sessao da ONG. Enquanto nao existe backend, o login apenas confere se o
    // CNPJ pertence a uma ONG cadastrada; a senha ainda nao e verificada.
    const [ongLogadaId, setOngLogadaId] = useState(null);
    const ongLogada = listaOngs.find((item) => item._id === ongLogadaId) || null;

    const entrarComoOng = (cnpjDigitado) => {
        const ong = listaOngs.find((item) => item.cnpj === cnpjDigitado.replace(/\D/g, ''));

        if (!ong) return null;

        setOngLogadaId(ong._id);
        toast.success(`Bem-vindo(a), ${ong.nome}!`);
        return ong;
    }

    const sairDaConta = () => {
        setOngLogadaId(null);
        toast.info('Você saiu da conta.');
    }

    const value = {
        pets,
        ongs: listaOngs,
        ongsParceiras,
        eventos: listaEventos,
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
        solicitacoes,
        doacoes,
        enviarDoacao,
        enviarSolicitacao,
        buscarOng,
        atualizarOng,
        ongLogada,
        entrarComoOng,
        sairDaConta
    }

    return (
        <AdocaoContext.Provider value={value}>
            {props.children}
        </AdocaoContext.Provider>
    )
}

export default AdocaoContextProvider;
