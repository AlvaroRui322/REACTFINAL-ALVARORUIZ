# Pokémon Team Builder

## Índice

1. [Descripción del proyecto](#descripción-del-proyecto)
2. [Funcionalidades principales](#funcionalidades-principales)
3. [Tecnologías utilizadas](#tecnologías-utilizadas)
4. [Instrucciones para instalar y ejecutar](#instrucciones-para-instalar-y-ejecutar)
5. [Estructura del código](#estructura-del-código)
6. [Reflexión sobre el proyecto](#reflexión-sobre-el-proyecto)
---

## Descripción del proyecto

**Pokémon Team Builder** es una aplicación interactiva creada con React que permite a los usuarios explorar una lista de Pokémon, aplicar filtros para buscar según sus características, y construir equipos personalizados. La app se conecta con la [PokéAPI](https://pokeapi.co/) para obtener datos de Pokémon en tiempo real y utiliza Firebase/Firestore para la autenticación y el almacenamiento de los equipos creados.

El objetivo principal del proyecto es ofrecer una experiencia sencilla y funcional para los fans de Pokémon que quieran organizar sus equipos de manera visual e interactiva.

---

## Funcionalidades principales

1. **Explorar Pokémon**
    - Ver una lista de los primeros 150 Pokémon con sus detalles básicos.
    - Aplicar filtros por nombre, tipo, peso, altura y experiencia.

2. **Gestionar equipos personalizados**
    - Crear equipos Pokémon con nombres personalizados.
    - Agregar Pokémon a los equipos desde la lista principal.
    - Visualizar y editar los equipos, incluyendo la opción de eliminar Pokémon.
    - Guardar los equipos localmente y, si tienes una cuenta, en Firebase/Firestore.

3. **Autenticación de usuarios**
    - Registro e inicio de sesión utilizando Firebase Authentication.
    - Sincronización de los equipos con la base de datos de cada usuario autenticado.

---

## Tecnologías utilizadas

- **Frontend:**
    - React (Componentes funcionales y hooks como `useState` y `useEffect`)
    - Formik y Yup para formularios y validaciones.
    - CSS para los estilos (sin frameworks adicionales).

- **Backend:**
    - Firebase Authentication para el inicio de sesión y registro.
    - Firestore como base de datos en la nube para guardar los equipos.

- **API:**
    - [PokéAPI](https://pokeapi.co/) para obtener datos de Pokémon.

- **Otros:**
    - SweetAlert2 para notificaciones y confirmaciones interactivas.
    - LocalStorage para guardar los datos localmente cuando no se está autenticado.

---

## Instrucciones para instalar y ejecutar

1. Clona este repositorio:
   ```bash
   git clone https://github.com/AlvaroRui322/ProyectoREACT-FINAL-ALVARORUIZ.git

2. Abre un editor de codigo como webStorm o visualStudio (Tienes que tener npm instalado)

3. Ejecuta npm install para instalar todas las dependencias del proyecto

4. Abre una terminal y escribe npm run dev para correr una preview en tiempo real del codigo




## Estructura del código

### Principales componentes:

#### **`Home.jsx`**
- **Descripción:** Pantalla principal donde se listan los Pokémon.
- **Características principales:**
    - Contiene filtros para buscar y seleccionar Pokémon por sus características.
    - Permite añadir Pokémon a los equipos creados.

#### **`MyTeams.jsx`**
- **Descripción:** Pantalla para gestionar los equipos creados.
- **Características principales:**
    - Incluye funciones para crear, editar y eliminar equipos.
    - Permite visualizar los detalles de cada equipo y eliminar Pokémon específicos.

#### **`RegisterForm.jsx` y `LoginForm.jsx`**
- **Descripción:** Formularios para registro e inicio de sesión de usuarios.
- **Características principales:**
    - Utilizan **Formik** y **Yup** para manejar los datos y validaciones.
    - Registran usuarios en **Firebase Authentication** y sincronizan sus datos en **Firestore**.

##### Ejemplo del formulario de registro (`RegisterForm.jsx`):
```javascript
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

    const validationSchema = Yup.object({
        username: Yup.string().min(3).required(),
        email: Yup.string().email().required(),
        password: Yup.string().min(6).required(),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const userCredential = await register({ email: values.email, password: values.password });
            const userId = userCredential.user.uid;

            await setDoc(doc(db, "users", userId), {
                username: values.username,
                email: values.email,
                profilePicture: "",
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
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
                <Form className="auth-form-container">
                    <h1>Regístrate</h1>
                    <Field name="username">
                        {({ field }) => <TextField {...field} label="Nombre de usuario" />}
                    </Field>
                    <ErrorMessage name="username" component="div" className="error" />
                    <Field name="email">
                        {({ field }) => <TextField {...field} label="Correo electrónico" />}
                    </Field>
                    <ErrorMessage name="email" component="div" className="error" />
                    <Field name="password">
                        {({ field }) => <TextField {...field} type="password" label="Contraseña" />}
                    </Field>
                    <ErrorMessage name="password" component="div" className="error" />
                    <Button type="submit" disabled={isSubmitting}>Registrarse</Button>
                </Form>
            )}
        </Formik>
    );
};

export default RegisterForm;
```

## Reflexión sobre el proyecto

### **Lo que aprendí:**

- **React**: Profundicé en el uso de hooks y componentes funcionales.
- **Formik y Yup**: Implementé formularios dinámicos con validación sencilla.
- **Firebase**: Aprendí a usar Firebase para autenticar usuarios y gestionar datos en la nube.
- **APIs externas**: Practiqué el consumo y la integración de una API REST.

### **Retos superados:**

- **Optimización de la API**: Aprendí a manejar respuestas asíncronas con múltiples llamadas a la vez.
- **Sincronización de datos**: Logré gestionar la sincronización de LocalStorage y Firestore sin conflictos.

