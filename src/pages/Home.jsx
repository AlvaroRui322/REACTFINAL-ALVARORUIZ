import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/UserContext";
import "../styles/Home.css";
import Swal from "sweetalert2";
import { db } from "../config/firebase"; // Firebase config
import { doc, updateDoc } from "firebase/firestore"; // Firebase functions
import { Link } from "react-router-dom"; // Para la navegación hacia detalles de Pokémon

const Home = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        type: "",
        minWeight: "",
        maxHeight: "",
        minExperience: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const pokemonsPerPage = 12;
    const [types, setTypes] = useState([]);
    const [teams, setTeams] = useState(() => {
        const storedTeams = localStorage.getItem("teams");
        return storedTeams ? JSON.parse(storedTeams) : [];
    });
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);

    const { currentUser } = useContext(AuthContext);

    const weightOptions = [
        { value: "", label: "Cualquier peso" },
        { value: "1", label: "1 kg o más" },
        { value: "10", label: "10 kg o más" },
        { value: "50", label: "50 kg o más" },
        { value: "100", label: "100 kg o más" },
    ];

    const heightOptions = [
        { value: "", label: "Cualquier altura" },
        { value: "1", label: "1 m o más" },
        { value: "2", label: "2 m o más" },
        { value: "5", label: "5 m o más" },
        { value: "10", label: "10 m o más" },
    ];

    const experienceOptions = [
        { value: "", label: "Cualquier experiencia" },
        { value: "50", label: "50 XP o más" },
        { value: "100", label: "100 XP o más" },
        { value: "200", label: "200 XP o más" },
    ];

    useEffect(() => {
        fetchPokemons();
        fetchTypes();

        // Listener para detectar el scroll y mostrar/ocultar el botón
        const handleScroll = () => {
            if (window.scrollY > 300) {  // Muestra el botón cuando se haya desplazado 300px hacia abajo
                setShowScrollTopButton(true);
            } else {
                setShowScrollTopButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Limpiar el listener cuando el componente se desmonte
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const fetchPokemons = async () => {
        try {
            const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
            const data = await response.json();
            const detailedPokemons = await Promise.all(
                data.results.map(async (pokemon) => {
                    const detailResponse = await fetch(pokemon.url);
                    return await detailResponse.json();
                })
            );
            setPokemonList(detailedPokemons);
            setFilteredPokemons(detailedPokemons);
        } catch (error) {
            console.error("Error fetching Pokémon data:", error);
        }
    };

    const fetchTypes = async () => {
        try {
            const response = await fetch("https://pokeapi.co/api/v2/type");
            const data = await response.json();
            setTypes(data.results.map((type) => type.name));
        } catch (error) {
            console.error("Error fetching Pokémon types:", error);
        }
    };

    const applyFilters = () => {
        const filtered = pokemonList.filter((pokemon) => {
            const matchesName = filters.name === "" || pokemon.name.includes(filters.name.toLowerCase());
            const matchesType = filters.type === "" || pokemon.types.some((t) => t.type.name === filters.type);
            const matchesMinWeight = filters.minWeight === "" || pokemon.weight >= parseFloat(filters.minWeight);
            const matchesMaxHeight = filters.maxHeight === "" || pokemon.height <= parseFloat(filters.maxHeight);
            const matchesMinExperience = filters.minExperience === "" || pokemon.base_experience >= parseFloat(filters.minExperience);

            return matchesName && matchesType && matchesMinWeight && matchesMaxHeight && matchesMinExperience;
        });
        setFilteredPokemons(filtered);
        setCurrentPage(1);
    };

    const createTeam = async () => {
        Swal.fire({
            title: "Crear nuevo equipo",
            input: "text",
            inputLabel: "Nombre del equipo",
            inputPlaceholder: "Escribe el nombre del equipo",
            showCancelButton: true,
            confirmButtonText: "Crear",
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                const newTeam = { name: result.value, pokemons: [] };
                const updatedTeams = [...teams, newTeam];
                setTeams(updatedTeams);
                localStorage.setItem("teams", JSON.stringify(updatedTeams)); // Guardamos en localStorage

                // Si el usuario está autenticado, también lo guardamos en Firestore
                if (currentUser) {
                    const docRef = doc(db, "users", currentUser.uid);
                    await updateDoc(docRef, { teams: updatedTeams });
                }

                Swal.fire("Equipo creado", `El equipo "${result.value}" ha sido creado.`, "success");
            }
        });
    };

    const handleAddToTeam = (pokemon) => {
        if (!currentUser) {
            Swal.fire("Inicia sesión", "Debes estar registrado para añadir Pokémon a un equipo.", "warning");
            return;
        }

        if (teams.length === 0) {
            Swal.fire({
                title: "No tienes equipos",
                text: "Primero crea un equipo para añadir Pokémon.",
                icon: "info",
                confirmButtonText: "Crear equipo",
            }).then(() => createTeam());
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
                    localStorage.setItem("teams", JSON.stringify(updatedTeams)); // Guardamos en localStorage

                    // Si el usuario está autenticado, también lo actualizamos en Firestore
                    if (currentUser) {
                        const docRef = doc(db, "users", currentUser.uid);
                        updateDoc(docRef, { teams: updatedTeams });
                    }

                    Swal.fire("Pokémon añadido", `${pokemon.name} añadido al equipo "${updatedTeams[selectedIndex].name}".`, "success");
                }
            }
        });
    };

    const indexOfLastPokemon = currentPage * pokemonsPerPage;
    const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
    const currentPokemons = filteredPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="pokemon-container">
            <h1>Pokémon Team Builder</h1>

            {/* Filtros */}
            <div className="filter-container">
                {/* Filtro por nombre */}
                <input
                    type="text"
                    placeholder="Nombre"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />

                {/* Filtro por tipo */}
                <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                    <option value="">Todos los tipos</option>
                    {types.map((type) => (
                        <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                    ))}
                </select>

                {/* Filtro por peso mínimo */}
                <select
                    value={filters.minWeight}
                    onChange={(e) => setFilters({ ...filters, minWeight: e.target.value })}
                >
                    <option value="">Peso mínimo</option>
                    {weightOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Filtro por altura máxima */}
                <select
                    value={filters.maxHeight}
                    onChange={(e) => setFilters({ ...filters, maxHeight: e.target.value })}
                >
                    <option value="">Altura máxima</option>
                    {heightOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Filtro por experiencia mínima */}
                <select
                    value={filters.minExperience}
                    onChange={(e) => setFilters({ ...filters, minExperience: e.target.value })}
                >
                    {experienceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <button onClick={applyFilters}>Aplicar filtros</button>
            </div>

            {/* Lista de Pokémon */}
            <div className="pokemon-list">
                {currentPokemons.map((pokemon) => (
                    <div key={pokemon.id} className="pokemon-card">
                        <h2>{pokemon.name}</h2>
                        <img src={pokemon.sprites.front_default} alt={pokemon.name} />

                        {/* Enlace al detalle del Pokémon */}
                        <Link to={`/pokemon/${pokemon.id}`}>
                            <button>Ver detalles</button>
                        </Link>

                        <button onClick={() => handleAddToTeam(pokemon)}>Añadir a un equipo</button>
                    </div>
                ))}
            </div>

            {/* Paginación */}
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={indexOfLastPokemon >= filteredPokemons.length}
                >
                    Siguiente
                </button>
            </div>

            {/* Botón Volver Arriba */}
            {showScrollTopButton && (
                <button
                    className="scroll-top-button"
                    onClick={scrollToTop}
                >
                    ↑
                </button>
            )}
        </div>
    );
};

export default Home;












