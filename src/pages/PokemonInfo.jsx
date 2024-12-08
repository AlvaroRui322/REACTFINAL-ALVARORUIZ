import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import "../styles/Pokemon.css";
import Swal from "sweetalert2";
import { AuthContext } from "../context/UserContext";

const PokemonInfo = () => {
    const { id } = useParams(); // Obtiene el ID del Pokémon desde la URL
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState(() => {
        const storedTeams = localStorage.getItem("teams");
        return storedTeams ? JSON.parse(storedTeams) : [];
    });
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    /**
     * Fetches the Pokémon data from the API based on the provided ID.
     * Updates the component state with the fetched Pokémon details.
     */
    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                const data = await response.json();
                setPokemon(data);
            } catch (error) {
                console.error("Error fetching Pokémon:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemon();
    }, [id]);

    /**
     * Creates a new team with the provided name and adds the current Pokémon to it.
     * Updates the local storage and state with the new team.
     */
    const createTeam = () => {
        Swal.fire({
            title: "Crear nuevo equipo",
            input: "text",
            inputLabel: "Nombre del equipo",
            inputPlaceholder: "Escribe el nombre del equipo",
            showCancelButton: true,
            confirmButtonText: "Crear",
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const newTeam = { name: result.value, pokemons: [pokemon] }; // Añadimos el Pokémon directamente al equipo
                const updatedTeams = [...teams, newTeam];
                setTeams(updatedTeams);
                localStorage.setItem("teams", JSON.stringify(updatedTeams));
                Swal.fire("Equipo creado y Pokémon añadido", `${pokemon.name} ha sido añadido al equipo "${result.value}".`, "success");
            }
        });
    };

    /**
     * Adds the current Pokémon to an existing team selected by the user.
     * If no teams exist, prompts the user to create a new team.
     */
    const handleAddToTeam = () => {
        if (!currentUser) {
            Swal.fire("Inicia sesión", "Debes estar registrado para añadir Pokémon a un equipo.", "warning");
            return;
        }

        if (teams.length === 0) {
            // Si no hay equipos, creamos uno y añadimos el Pokémon
            createTeam();
            return;
        }

        Swal.fire({
            title: "Selecciona un equipo",
            input: "select",
            inputOptions: teams.reduce((acc, team, index) => {
                acc[index] = team.name;
                return acc;
            }, {}),
            inputPlaceholder: "Selecciona un equipo",
            showCancelButton: true,
            confirmButtonText: "Añadir",
        }).then((result) => {
            if (result.isConfirmed) {
                const selectedIndex = parseInt(result.value);
                if (!isNaN(selectedIndex)) {
                    const updatedTeams = [...teams];
                    updatedTeams[selectedIndex].pokemons.push(pokemon);
                    setTeams(updatedTeams);
                    localStorage.setItem("teams", JSON.stringify(updatedTeams));
                    Swal.fire("Pokémon añadido", `${pokemon.name} añadido al equipo "${updatedTeams[selectedIndex].name}".`, "success");
                }
            }
        });
    };

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (!pokemon) {
        return <p>No se pudo cargar la información del Pokémon.</p>;
    }

    return (
        <div className="pokedex-container">
            <div className="pokedex-frame"></div> {/* Marco */}
            <div className="pokedex-screen">
                <button className="pokedex-back" onClick={() => navigate(-1)}>Volver</button>
                <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
                <img
                    className="pokemon-gif"
                    src={
                        pokemon.sprites.versions['generation-v']['black-white'].animated.front_default ||
                        pokemon.sprites.front_default
                    }
                    alt={pokemon.name}
                />
                <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
                <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
                <p>
                    <strong>Tipos:</strong>{" "}
                    {pokemon.types.map((type) => type.type.name).join(", ")}
                </p>
                <p>
                    <strong>Habilidades:</strong>{" "}
                    {pokemon.abilities.map((ability) => ability.ability.name).join(", ")}
                </p>
                <button onClick={handleAddToTeam}>Añadir al equipo</button>
            </div>
        </div>
    );
};

export default PokemonInfo;




