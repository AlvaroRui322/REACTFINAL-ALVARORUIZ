import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/UserContext.jsx';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/Navbar.css';

const Navbar = () => {
    const { currentUser: user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);

    // Obtener los datos del perfil del usuario actual desde Firestore
    const fetchUserData = async () => {
        if (!user) return;

        try {
            const docRef = doc(db, 'users', user.uid); // Referencia al documento del usuario
            const docSnap = await getDoc(docRef); // Obtener datos del usuario
            if (docSnap.exists()) {
                const userData = docSnap.data();
                setProfileImage(userData.profilePicture || '../src/assets/default-avatar.jpg'); // Asignar imagen de perfil
            }
        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
        }
    };

    // Llamar a fetchUserData cuando el usuario cambie
    useEffect(() => {
        fetchUserData();
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">Home</Link>

                <div className="navbar-links">
                    {!user && (
                        <>
                            <NavLink to="/register" className="navbar-button">Register</NavLink>
                            <NavLink to="/login" className="navbar-button">Login</NavLink>
                        </>
                    )}

                    {user && (
                        <>
                            <NavLink to="/profile" className="navbar-profile">
                                <img
                                    src={profileImage || '../src/assets/default-avatar.jpg'}
                                    alt="Avatar"
                                    className="navbar-avatar"
                                />
                                <span>Profile</span>
                            </NavLink>
                            <button onClick={handleLogout} className="navbar-button">
                                Log Out
                            </button>
                        </>
                    )}

                    <NavLink to="/contact" className="navbar-button">Contact</NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;



