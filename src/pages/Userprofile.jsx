import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { TextField, Button, Grid, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "../styles/UserProfile.css";

const UserProfile = () => {
    const { currentUser } = useContext(AuthContext);
    const [profileData, setProfileData] = useState({
        username: "",
        email: "",
        profilePicture: "",
    });
    const [newProfilePicture, setNewProfilePicture] = useState(null); // Archivo de imagen
    const [previewImage, setPreviewImage] = useState(null); // Previsualización de la imagen

    /**
     * Carga los datos del perfil del usuario autenticado desde Firestore.
     * Si el usuario no existe o ocurre un error, muestra una alerta.
     */
    useEffect(() => {
        const fetchProfileData = async () => {
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid); // Documento del usuario autenticado
                try {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setProfileData(docSnap.data());
                        setPreviewImage(docSnap.data().profilePicture || null);
                    } else {
                        Swal.fire("Error", "No se encontraron datos del perfil.", "error");
                    }
                } catch (error) {
                    console.error("Error al obtener datos:", error);
                }
            }
        };

        fetchProfileData();
    }, [currentUser]);

    /**
     * Maneja los cambios en los campos de texto del perfil y actualiza el estado local.
     * @param {Event} e Evento del cambio en el campo de texto.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * Maneja la selección y previsualización de una nueva imagen de perfil.
     * Valida que la imagen tenga al menos 500x500 píxeles.
     * @param {Event} e Evento de cambio en el input de archivo.
     */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.onload = () => {
                if (img.width >= 500 && img.height >= 500) {
                    const reader = new FileReader();
                    reader.onload = () => setPreviewImage(reader.result); // Mostrar previsualización (Base64)
                    setNewProfilePicture(file); // Guardar el archivo para convertirlo a base64
                    reader.readAsDataURL(file); // Convertir a Base64
                } else {
                    Swal.fire("Error", "La imagen debe tener al menos 500x500 píxeles.", "error");
                }
            };
            img.src = URL.createObjectURL(file);
        }
    };

    /**
     * Actualiza los datos del perfil en Firestore, incluyendo la imagen en formato Base64.
     * Si no hay una nueva imagen seleccionada, muestra un mensaje de advertencia.
     */
    const handleUpdateProfile = async () => {
        if (!currentUser) return;

        const docRef = doc(db, "users", currentUser.uid);

        try {
            let updatedProfilePicture = profileData.profilePicture; // Mantener la imagen existente si no hay nueva

            if (newProfilePicture) {
                // Convertir la imagen a Base64 y guardarla en Firestore como cadena
                const reader = new FileReader();
                reader.onloadend = async () => {
                    updatedProfilePicture = reader.result; // Cadena Base64

                    // Actualizar Firestore con la nueva cadena Base64 de la imagen
                    const updatedData = {
                        username: profileData.username,
                        profilePicture: updatedProfilePicture, // Guardar la imagen como cadena Base64
                    };

                    await updateDoc(docRef, updatedData); // Subir datos a Firestore

                    // Actualizar estado local
                    setProfileData((prevData) => ({
                        ...prevData,
                        ...updatedData,
                    }));

                    Swal.fire("¡Perfil actualizado!", "Tus datos han sido actualizados exitosamente.", "success");
                };
                reader.readAsDataURL(newProfilePicture); // Convertir archivo a base64
            } else {
                Swal.fire("No se seleccionó imagen", "Debes seleccionar una nueva imagen para actualizar.", "warning");
            }
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            Swal.fire("Error al actualizar perfil", error.message, "error");
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-form">
                <Typography variant="h4" gutterBottom>
                    Mi Perfil
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} className="profile-image">
                        <div>
                            <img
                                src={previewImage || profileData.profilePicture || "https://via.placeholder.com/150"}
                                alt="Profile"
                                width="150"
                                height="150"
                                style={{ borderRadius: "50%" }}
                                onClick={() => document.getElementById("profileImageInput").click()}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                id="profileImageInput"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            label="Nombre de usuario"
                            name="username"
                            value={profileData.username}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Correo electrónico"
                            name="email"
                            value={profileData.email}
                            disabled
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
                            Actualizar Perfil
                        </Button>
                    </Grid>
                </Grid>
            </div>
            <div className="links-container">
                <Link to="/profile/teams" className="link-item">
                    <i className="fas fa-pokeball"></i> Mis Equipos
                </Link>
            </div>
        </div>
    );
};

export default UserProfile;














