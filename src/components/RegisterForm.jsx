import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { register, db } from "../config/firebase";
import Swal from "sweetalert2";
import "../styles/Form.css";
import { doc, setDoc } from "firebase/firestore";

const RegisterForm = () => {
    const navigate = useNavigate();

    const initialValues = { username: "", email: "", password: "" };

    // Esquema de validación con Yup
    const validationSchema = Yup.object({
        username: Yup.string()
            .min(3, "El nombre de usuario debe tener al menos 3 caracteres.")
            .required("El nombre de usuario es obligatorio."),
        email: Yup.string()
            .email("Correo no válido")
            .required("El correo es obligatorio."),
        password: Yup.string()
            .min(6, "La contraseña debe tener al menos 6 caracteres.")
            .required("La contraseña es obligatoria."),
    });

    // Función para manejar el envío del formulario
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            // Registrar el usuario
            const userCredential = await register({ email: values.email, password: values.password });
            const userId = userCredential.user.uid;

            // Almacenar información adicional en Firestore
            await setDoc(doc(db, "users", userId), {
                username: values.username,
                email: values.email,
                profilePicture: "", // Inicialmente vacío
            });

            Swal.fire("¡Registro exitoso!", "Bienvenido a Pokémon Team Builder", "success");
            resetForm();
            navigate("/profile");
        } catch (error) {
            Swal.fire("Error al registrar", error.message, "error");
        }
        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="auth-form-container">
                    <h1>Regístrate</h1>

                    {/* Campo de nombre de usuario */}
                    <Field name="username">
                        {({ field }) => (
                            <TextField
                                {...field}
                                label="Nombre de usuario"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                            />
                        )}
                    </Field>
                    <ErrorMessage name="username" component="div" className="error" />

                    {/* Campo de correo electrónico */}
                    <Field name="email">
                        {({ field }) => (
                            <TextField
                                {...field}
                                label="Correo electrónico"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                            />
                        )}
                    </Field>
                    <ErrorMessage name="email" component="div" className="error" />

                    {/* Campo de contraseña */}
                    <Field name="password">
                        {({ field }) => (
                            <TextField
                                {...field}
                                type="password"
                                label="Contraseña"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                            />
                        )}
                    </Field>
                    <ErrorMessage name="password" component="div" className="error" />

                    {/* Botón de registro */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        fullWidth
                    >
                        Registrarse
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default RegisterForm;



