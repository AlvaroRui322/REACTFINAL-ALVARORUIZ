import PokemonInfo from "../pages/PokemonInfo.jsx";
import Myteams from "../pages/Myteams.jsx";
import Userprofile from "../pages/Userprofile.jsx";
import Contact from "../pages/Contact.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Home from "../pages/Home.jsx";
import NotFound from "../pages/NotFound.jsx";
import LayoutPublic from "../layouts/LayoutPublic.jsx";
import {createBrowserRouter} from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutPublic />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: "/profile",
                element: <Userprofile />
            },
            {
                path: "/profile/teams",
                element: <Myteams />
            },
            {
                path: "/pokemon/:id", // Ruta para mostrar la información de un Pokémon
                element: <PokemonInfo />
            }
        ]
    }
]);
