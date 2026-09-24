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

    const buscarOng = (ongId) => ongs.find((item) => item._id === ongId);

    const value = {
        pets,
        ongs,
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
        buscarOng
    }

    return (
        <AdocaoContext.Provider value={value}>
            {props.children}
        </AdocaoContext.Provider>
    )
}

export default AdocaoContextProvider;
