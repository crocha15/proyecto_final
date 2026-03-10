import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../components/SearchContext';
// Assets
import Crear from '../assets/crear.png';

// Iconos (Puedes usar los que ya tienes o HeroIcons para mayor fidelidad a la imagen)
const HomeIcon = () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" /></svg>;
const SearchIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const MessageIcon = () => <div className="relative"><svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98 1 4.28L2 22l5.72-1c1.3.64 2.74 1 4.28 1 5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg><span className="absolute -top-1 -right-1 bg-red-600 w-3 h-3 rounded-full border-2 border-white"></span></div>;
const UserIcon = ({ src }) => <img src={src} className="w-7 h-7 rounded-full object-cover" alt="Perfil" />;

const MobileLayout = ({ children, user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { searchTerm, setSearchTerm } = useSearch();

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* --- BARRA SUPERIOR DE PESTAÑAS --- */}
            <header className="fixed top-0 left-0 right-0 bg-white z-50 pt-10 pb-2 px-4 flex justify-start gap-6 border-b border-transparent">
                <button
                    onClick={() => navigate('/')}
                    className={`text-lg font-bold pb-1 ${location.pathname === '/' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
                >
                    Todas
                </button>
                <button
                    className="text-lg font-bold text-gray-500 pb-1"
                >
                    Prueba
                </button>
            </header>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="flex-1 mt-24 mb-20 px-2">
                {/* Inyectamos el searchTerm a los hijos para que el Grid funcione */}
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { searchTerm });
                    }
                    return child;
                })}
            </main>

            {/* --- NAVEGACIÓN INFERIOR (MobileNav) --- */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white h-16 flex items-center justify-around border-t border-gray-100 px-4 z-50">
                <button onClick={() => navigate('/')} className="p-2 text-black">
                    <HomeIcon />
                </button>
                <button onClick={() => {/* Lógica para abrir búsqueda focalizada */ }} className="p-2 text-gray-400">
                    <SearchIcon />
                </button>
                <button onClick={() => navigate('/crear-pin')} className="w-12 h-12 p-2 text-black">
                    <img src={Crear} alt="Crear" />
                </button>
                <button className="p-2 text-gray-400">
                    <MessageIcon />
                </button>
                <button onClick={() => navigate('/perfil')} className="nav-item">
                    <div className="profile-img-container">
                        <img
                            src={user?.user_metadata?.picture || user?.user_metadata?.avatar_url}
                            alt="Perfil"
                            className="profile-mini-avatar"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                </button>
            </nav>
        </div>
    );
};

export default MobileLayout;