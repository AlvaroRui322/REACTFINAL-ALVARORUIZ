import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBiNNZnJHMR3h5WCQ1bqDvSJWAVu3Ylm7A",
    authDomain: "creador-de-equipos-pokem-51aa2.firebaseapp.com",
    projectId: "creador-de-equipos-pokem-51aa2",
    storageBucket: "creador-de-equipos-pokem-51aa2.appspot.com", // Corregir el Storage Bucket
    messagingSenderId: "1901822251",
    appId: "1:1901822251:web:a1a5ae4ce46831cb01056e",
    measurementId: "G-QSGX48T382"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore para datos adicionales
export const storage = getStorage(app); // Storage para almacenar imágenes

// Funciones de autenticación
export const login = ({ email, password }) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const register = ({ email, password }) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const logOut = () => signOut(auth);

