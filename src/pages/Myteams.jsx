import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/UserContext";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "../styles/MyTeams.css";

const MyTeams = () => {
    const { currentUser } = useContext(AuthContext);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

    /**
     * Fetches the user's teams from the database or localStorage.
     * Updates the state with the retrieved teams.
     */
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                if (currentUser) {
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setTeams(userData.teams || []);
                    } else {
                        console.warn("No se encontraron datos del usuario.");
                        setTeams([]);
                    }
                } else {
                    const storedTeams = localStorage.getItem("teams");
                    setTeams(storedTeams ? JSON.parse(storedTeams) : []);
                }
            } catch (error) {
                console.error("Error al cargar los equipos:", error);
            }
        };

        fetchTeams();
    }, [currentUser]);

    /**
     * Creates a new team with the user-provided name.
     * Updates the database and localStorage with the new team.
     */
    const createTeam = async () => {
        try {
            const { value: teamName } = await Swal.fire({
                title: "Crear un nuevo equipo",
                input: "text",
                inputLabel: "Nombre del equipo",
                inputPlaceholder: "Escribe el nombre del equipo",
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return "¡Necesitas escribir un nombre para el equipo!";
                    }
                },
            });

            if (teamName) {
                const newTeam = {
                    name: teamName,
                    pokemons: [],
                };

                const updatedTeams = [...teams, newTeam];
                setTeams(updatedTeams);
                localStorage.setItem("teams", JSON.stringify(updatedTeams));

                if (currentUser) {
                    const docRef = doc(db, "users", currentUser.uid);
                    await updateDoc(docRef, { teams: updatedTeams });
                }

                Swal.fire("Equipo creado", `${teamName} ha sido creado exitosamente.`, "success");
            }
        } catch (error) {
            console.error("Error al crear el equipo:", error);
        }
    };

    /**
     * Deletes a team from the user's list.
     * Updates the database and localStorage after deletion.
     *
     * @param {Object} team - The team object to be deleted.
     */
    const deleteTeam = async (team) => {
        try {
            const confirmDelete = await Swal.fire({
                title: "¿Estás seguro?",
                text: `¿Estás seguro de que quieres eliminar el equipo ${team.name}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Eliminar",
                cancelButtonText: "Cancelar",
            });

            if (confirmDelete.isConfirmed) {
                const updatedTeams = teams.filter((t) => t.name !== team.name);
                setTeams(updatedTeams);
                localStorage.setItem("teams", JSON.stringify(updatedTeams));

                if (currentUser) {
                    const docRef = doc(db, "users", currentUser.uid);
                    await updateDoc(docRef, { teams: updatedTeams });
                }

                Swal.fire("Eliminado", `${team.name} ha sido eliminado exitosamente.`, "success");
            }
        } catch (error) {
            console.error("Error al eliminar el equipo:", error);
        }
    };

    /**
     * Removes a Pokémon from the currently selected team.
     * Updates the database and localStorage after removal.
     *
     * @param {Object} pokemon - The Pokémon object to be removed.
     */
    const removePokemonFromTeam = async (pokemon) => {
        if (selectedTeam) {
            const updatedPokemons = selectedTeam.pokemons.filter((p) => p.id !== pokemon.id);
            const updatedTeam = { ...selectedTeam, pokemons: updatedPokemons };
            const updatedTeams = teams.map((team) =>
                team.name === selectedTeam.name ? updatedTeam : team
            );

            setTeams(updatedTeams);
            setSelectedTeam(updatedTeam);
            localStorage.setItem("teams", JSON.stringify(updatedTeams));

            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                await updateDoc(docRef, { teams: updatedTeams });
            }

            Swal.fire("Eliminado", `${pokemon.name} ha sido eliminado del equipo.`, "success");
        }
    };

    /**
     * Closes the team details view.
     * Resets the selected team state.
     */
    const closeTeamDetails = () => {
        setSelectedTeam(null);
    };

    return (
        <div className="my-teams-container">
            <h1 className="app-title">Mis Equipos Pokémon</h1>
            <button className="create-button" onClick={createTeam}>
                Crear un nuevo equipo
            </button>
            <div className="teams-list">
                {teams.length === 0 ? (
                    <p>No tienes equipos. Crea uno para empezar.</p>
                ) : (
                    teams.map((team) => (
                        <div key={team.name} className="team-card">
                            <h3>{team.name}</h3>
                            <button className="view-button" onClick={() => setSelectedTeam(team)}>
                                Ver equipo
                            </button>
                            <button className="delete-button" onClick={() => deleteTeam(team)}>
                                Eliminar equipo
                            </button>
                        </div>
                    ))
                )}
            </div>
            {selectedTeam && (
                <div className="team-details">
                    <h2>Equipo: {selectedTeam.name}</h2>
                    <button className="close-button" onClick={closeTeamDetails}>
                        Cerrar equipo
                    </button>
                    <div className="pokemon-list">
                        {selectedTeam.pokemons.length === 0 ? (
                            <p>No tienes Pokémon en este equipo.</p>
                        ) : (
                            selectedTeam.pokemons.map((pokemon) => (
                                <div key={pokemon.id} className="pokemon-card">
                                    <img
                                        src={pokemon.image || pokemon.sprites?.front_default || "default-image.png"}
                                        alt={pokemon.name}
                                        className="pokemon-image"
                                    />
                                    <p>{pokemon.name}</p>
                                    <button
                                        className="delete-pokemon-button"
                                        onClick={() => removePokemonFromTeam(pokemon)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <p>Slots disponibles: {6 - selectedTeam.pokemons.length} / 6</p>
                </div>
            )}
        </div>
    );
};

export default MyTeams;





