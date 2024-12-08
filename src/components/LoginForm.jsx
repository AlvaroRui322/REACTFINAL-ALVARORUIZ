import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../context/UserContext.jsx';
import Swal from 'sweetalert2';
import "../styles/Form.css";
import {useNavigate} from "react-router-dom";

const validationSchema = Yup.object({
    email: Yup.string().email('Correo inválido').required('El correo es obligatorio.'),
    password: Yup.string().required('La contraseña es obligatoria.'),
});

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await login(values.email, values.password);
            Swal.fire('¡Bienvenido!', 'Inicio de sesión exitoso', 'success');
            resetForm();
            navigate("/profile");
        } catch (error) {
            Swal.fire('Error al iniciar sesión', error.message || 'Credenciales incorrectas', 'error');
        }
        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="auth-form-container">
                    <h1>Iniciar Sesión</h1>

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

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        fullWidth
                    >
                        {isSubmitting ? 'Iniciando...' : 'Iniciar sesión'}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;





