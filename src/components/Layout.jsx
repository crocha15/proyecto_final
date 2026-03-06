import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogOut from '../components/LogOut';
import { supabase } from '../supabaseClient';
import Landing from '../pages/Landing';
import { useSearch } from '../components/SearchContext';

// Assets
import Pint from '../assets/pint.png';
import Inicio from '../assets/inicio.png';
import Explorar from '../assets/explorar.png';
import Tableros from '../assets/tableros.png';
import Crear from '../assets/crear.png';
import Notificaciones from '../assets/notificaciones.png';
import Mensajes from '../assets/mensajes.png';
import Configuracion from '../assets/configuracion.png';
import Pin_icon from '../assets/pin_icon.png';
import Collage_icon from '../assets/collage_icon.png';
import Tablero_icon from '../assets/tablero_icon.png';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
    
    // USAMOS EL CONTEXTO GLOBAL EN LUGAR DEL STATE LOCAL
    const { searchTerm, setSearchTerm } = useSearch();

    React.useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const toggleCreateMenu = () => setIsCreateMenuOpen(!isCreateMenuOpen);

    const SidebarIcon = ({ img, active = false, onClick }) => (
        <div
            onClick={onClick}
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-black shadow-lg' : 'hover:bg-gray-100'}`}
        >
            <img src={img} alt="icon" className={`w-10 h-8 object-contain ${active ? 'invert' : ''}`} />
        </div>
    );

    const CreateMenuItem = ({ title, description, icon, onClick }) => (
        <div onClick={onClick} className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
            <div className="w-24 h-12 rounded-lg flex items-center justify-center text-2xl">{icon}</div>
            <div>
                <p className="font-semibold text-gray-950">{title}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    );

    if (loading) return null;
    if (!user) return <Landing />;

    return (
        <div className="flex min-h-screen bg-white font-sans text-[#111111]">
            {/* --- SIDEBAR IZQUIERDO --- */}
            <div className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-5 gap-5 border-r border-gray-100 bg-white z-[60]">
                <img src={Pint} alt="Logo" className="w-12 h-10 mb-2 cursor-pointer" onClick={() => navigate('/')} />
                <SidebarIcon img={Inicio} onClick={() => navigate('/')} />
                <SidebarIcon img={Explorar} />
                <SidebarIcon img={Tableros} />
                <SidebarIcon img={Crear} active={isCreateMenuOpen} onClick={toggleCreateMenu} />
                <SidebarIcon img={Notificaciones} />
                <SidebarIcon img={Mensajes} />
                <div className="mt-auto mb-2">
                    <SidebarIcon img={Configuracion} />
                </div>
            </div>

            {/* --- MENÚ CREAR --- */}
            {isCreateMenuOpen && (
                <div className="fixed left-20 top-0 bottom-0 w-80 bg-white border-r border-gray-100 p-6 z-50 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-semibold">Crear</h2>
                        <button onClick={toggleCreateMenu} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18"></path></svg>
                        </button>
                    </div>
                    <div className="space-y-4">
                        <CreateMenuItem
                            title="Pin"
                            description="Publica tus fotos..."
                            icon={<img src={Pin_icon} className="w-10 h-10" />}
                            onClick={() => { navigate('/crear-pin'); setIsCreateMenuOpen(false); }}
                        />
                        {/* Puedes añadir aquí el Collage o Tablero si tienes los iconos listos */}
                    </div>
                </div>
            )}

            <div className="flex-1 ml-20 flex flex-col">
                {/* --- BARRA SUPERIOR --- */}
                <header className="sticky top-0 z-50 bg-white px-8 h-20 flex items-center gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Buscar en Pexels..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#efefef] hover:bg-[#e1e1e1] rounded-full py-3 px-12 outline-none transition-colors"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>

                    <div className="relative z-[110] flex items-center gap-2">
                        <button onClick={() => navigate('/perfil')} className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent hover:border-gray-200 transition-all">
                            <img className="w-full h-full object-cover" src={user?.user_metadata?.picture} referrerPolicy="no-referrer" alt="profile" />
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                            <svg className={`w-4 h-4 text-gray-600 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 top-14 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-[120]">
                                <div onClick={() => navigate('/perfil')} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer mb-3">
                                    <img className="w-12 h-12 rounded-full" src={user?.user_metadata?.picture} alt="profile" />
                                    <div className="overflow-hidden">
                                        <p className="font-semibold truncate">{user?.user_metadata?.full_name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 mb-3"></div>
                                <LogOut />
                            </div>
                        )}
                    </div>
                </header>

                {/* --- CONTENIDO PRINCIPAL --- */}
                <main className="flex-1">
                    {/* Pasamos el searchTerm global a los hijos */}
                    {React.Children.map(children, child => {
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child, { searchTerm });
                        }
                        return child;
                    })}
                </main>
            </div>
        </div>
    );
};

export default Layout;