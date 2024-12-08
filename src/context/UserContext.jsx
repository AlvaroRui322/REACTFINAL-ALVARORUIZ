import { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import PropTypes from 'prop-types';
import { login as firebaseLogin } from '../config/firebase'; // Make sure to import the login function from firebase

/**
 * Authentication context to manage the global user state.
 */
export const AuthContext = createContext();

/**
 * Authentication provider that manages the user state.
 *
 * @param props - React props.
 * @param props.children - Child components that receive access to the authentication context.
 * @returns Authentication provider that wraps the application.
 */
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const auth = getAuth();

    /**
     * Effect that runs when the component mounts.
     * Listens for changes in the user's authentication state.
     */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, [auth]);

    /**
     * Signs out the current user.
     */
    const logout = async () => {
        await signOut(auth);
    };

    /**
     * Login function using Firebase
     */
    const login = async (email, password) => {
        try {
            await firebaseLogin({ email, password });
        } catch (error) {
            throw new Error(error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};




