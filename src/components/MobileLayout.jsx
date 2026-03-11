import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../components/SearchContext';
import LogOut from '../components/LogOut';
import Crear from '../assets/crear.png';

const HomeIcon = () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" /></svg>;
const SearchIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const MessageIcon = () => <div className="relative"><svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98 1 4.28L2 22l5.72-1c1.3.64 2.74 1 4.28 1 5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg><span className="absolute -top-1 -right-1 bg-red-600 w-3 h-3 rounded-full border-2 border-white"></span></div>;

const MobileLayout = ({ children, user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { searchTerm } = useSearch();

    // Extraemos la URL de la foto de forma segura
    const profilePic = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* --- BARRA SUPERIOR --- */}
            <header className="fixed top-0 left-0 right-0 bg-white z-50 pt-10 pb-2 px-4 flex justify-start gap-6 border-b border-transparent">
                <button
                    onClick={() => navigate('/')}
                    className={`text-lg font-bold pb-1 ${location.pathname === '/' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
                >
                    Todas
                </button>
                <button className="text-lg font-bold text-gray-500 pb-1">
                    Prueba
                </button>
                <span className="ml-auto">
                    <LogOut />
                </span>
            </header>

            {/* --- CONTENIDO --- */}
            <main className="flex-1 mt-24 mb-20 px-2">
                {children}
            </main>

            {/* --- NAVEGACIÓN INFERIOR --- */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white h-16 flex items-center justify-around border-t border-gray-100 px-4 z-50">
                <button onClick={() => navigate('/')} className="p-2 text-black">
                    <HomeIcon />
                </button>
                <button className="p-2 text-gray-400">
                    <SearchIcon />
                </button>
                <button onClick={() => navigate('/crear-pin')} className="w-12 h-12 p-2">
                    <img src={Crear} alt="Crear" className="w-full h-full object-contain" />
                </button>
                <button className="p-2 text-gray-400">
                    <MessageIcon />
                </button>
                
                {/* Botón de Perfil Corregido */}
                <button onClick={() => navigate('/perfil')} className="p-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
                        {profilePic ? (
                            <img
                                src={profilePic}
                                alt="Perfil"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            // Icono por defecto si no hay foto
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs text-white">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </button>
            </nav>
        </div>
    );
};

export default MobileLayout;