import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import Swal from 'sweetalert2';
import "../styles/Form.css";

const validationSchema = Yup.object({
    email: Yup.string().email('Correo inválido').required('El correo es obligatorio.'),
    subject: Yup.string().required('El asunto es obligatorio.'),
    description: Yup.string().required('La descripción es obligatoria.'),
    terms: Yup.boolean().oneOf([true], 'Debes aceptar los términos y condiciones'),
});

const ContactForm = () => {
    return (
        <Formik
            initialValues={{ email: '', subject: '', description: '', terms: false }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
                Swal.fire('¡Formulario enviado!', 'Gracias por tu mensaje', 'success');
                resetForm();
            }}
        >
            {({ isSubmitting }) => (
                <Form className="auth-form-container">
                    <h1>Contacto</h1>

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

                    <Field name="subject">
                        {({ field }) => (
                            <TextField
                                {...field}
                                label="Asunto"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                            />
                        )}
                    </Field>
                    <ErrorMessage name="subject" component="div" className="error" />

                    <Field name="description">
                        {({ field }) => (
                            <TextField
                                {...field}
                                label="Descripción"
                                variant="outlined"
                                multiline
                                rows={4}
                                fullWidth
                                margin="normal"
                            />
                        )}
                    </Field>
                    <ErrorMessage name="description" component="div" className="error" />

                    <Field name="terms" type="checkbox">
                        {({ field }) => (
                            <FormControlLabel
                                control={<Checkbox {...field} />}
                                label="Aceptar términos y condiciones"
                            />
                        )}
                    </Field>
                    <ErrorMessage name="terms" component="div" className="error" />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        fullWidth
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar'}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default ContactForm;






