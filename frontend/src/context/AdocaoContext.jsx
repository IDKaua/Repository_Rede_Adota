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


    // Enquanto nao existe a tela de formulario, apenas confirma a intencao
    const solicitarAdocao = (pet) => {
        toast.success(`Solicitação de adoção enviada para ${pet.nome}!`);
    }


    // A lista fica em estado porque a ONG pode editar o proprio perfil
    const [listaOngs, setListaOngs] = useState(ongs);

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
        eventos,
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
        solicitarAdocao,
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
