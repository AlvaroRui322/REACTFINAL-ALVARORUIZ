import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/index.jsx';
import { AuthProvider } from './context/UserContext.jsx';  // Importa el AuthProvider en lugar de UserProvider

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>  {/* Utiliza AuthProvider */}
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);

