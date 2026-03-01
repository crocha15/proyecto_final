import React, { useState, useEffect } from 'react';
import Pin from '../components/Pin';
import { supabase } from '../supabaseClient';
import Landing from './Landing';

// Assets
import Pint from '../assets/pint.png';
import Inicio from '../assets/inicio.png';
import Explorar from '../assets/explorar.png';
import Tableros from '../assets/tableros.png';
import Crear from '../assets/crear.png';
import Notificaciones from '../assets/notificaciones.png';
import Mensajes from '../assets/mensajes.png';
import Configuracion from '../assets/configuracion.png';
import LogOut from '../components/LogOut';

function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pins, setPins] = useState([]);
    // Estado para controlar el menú desplegable
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    // --- DENTRO DE HOME ---

    useEffect(() => {
        // 1. Obtener sesión inicial
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // 2. Escuchar cambios (Login/Logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("Evento de Auth:", _event); // Esto te dirá en consola si detecta el SIGNED_OUT
            setUser(session?.user ?? null);
            if (_event === 'SIGNED_OUT') {
                setIsMenuOpen(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);


    useEffect(() => {
        if (user) loadPins();
    }, [user]);

    const loadPins = () => {
        const heights = [300, 400, 500, 350, 450];
        const newPins = Array.from({ length: 40 }, (_, i) => ({
            id: i + 1,
            image: `https://picsum.photos/seed/${i + 40}/300/${heights[i % heights.length]}`,
            title: `Pin Inspiración ${i + 1}`,
            saved: false,
        }));
        setPins(newPins);
    };

    // 1. Si está cargando, muestra el spinner
    if (loading) return <div>Cargando...</div>;

    // 2. IMPORTANTE: Si NO hay usuario, renderiza Landing
    if (!user) {
        return <Landing />;
    }

    return (
        <div className="flex min-h-screen bg-white font-sans text-[#111111]">
            {/* Sidebar fijo */}
            <aside className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-5 gap-5 border-r border-gray-100 bg-white z-[60]">
                <img src={Pint} alt="Logo" className="w-10 h-10 mb-2 cursor-pointer" />
                <SidebarIcon img={Inicio} />
                <SidebarIcon img={Explorar} />
                <SidebarIcon img={Tableros} />
                <SidebarIcon img={Crear} />
                <SidebarIcon img={Notificaciones} />
                <SidebarIcon img={Mensajes} />
                <div className="mt-auto mb-2">
                    <SidebarIcon img={Configuracion} />
                </div>
            </aside>

            {/* Contenido principal */}
            <div className="flex-1 ml-20">
                <header className="sticky top-0 z-50 bg-white px-8 h-20 flex items-center gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Buscar"
                            className="w-full bg-[#efefef] hover:bg-[#e1e1e1] rounded-full py-3 px-12 outline-none transition-colors"
                        />
                    </div>

                    {/* Contenedor del Perfil y Menú */}
                    <div className="relative z-[110]">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-1 p-2 hover:bg-gray-100 rounded-full transition-all"
                        >
                            <div className="w-12 h-12 bg-[#d4ebd4] text-[#2d5a27] flex items-center justify-center rounded-full font-bold">
                                <img className='rounded-full' src={user.user_metadata.picture} referrerPolicy='no-referrer' />
                            </div>
                            <svg className={`w-4 h-4 text-gray-600 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu (Pinterest Style) */}
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-[120]">
                                <p className="text-xs text-gray-500 mb-2 px-2">Actualmente en</p>

                                {/* Info Usuario */}
                                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                    <div className="w-12 h-12 bg-[#d4ebd4] text-[#2d5a27] flex items-center justify-center rounded-full font-bold text-xl">
                                        <img className='rounded-full' src={user.user_metadata.picture} referrerPolicy='no-referrer' />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-semibold truncate">{user.user_metadata.full_name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>

                                <div className="my-3 border-t border-gray-100"></div>

                                <p className="text-xs text-gray-500 mb-1 px-2">Tus cuentas</p>
                                <button className="w-full text-left p-2 hover:bg-gray-100 rounded-lg font-semibold transition-colors">
                                    Agregar cuenta
                                </button>
                                <button className="w-full text-left p-2 hover:bg-gray-100 rounded-lg font-semibold transition-colors">
                                    Convertir en cuenta para empresa
                                </button>

                                <div className="my-3 border-t border-gray-100"></div>

                                <p className="text-xs text-gray-500 mb-1 px-2">Más opciones</p>
                                <button className="w-full text-left p-2 hover:bg-gray-100 rounded-lg font-semibold transition-colors">
                                    Configuración
                                </button>
                                {/* Botón SALIR */}
                                <div className="relative z-[105]">
                                    <LogOut />
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <main className="p-4 px-8">
                    <div className="columns-2 md:columns-4 lg:columns-6 gap-4 space-y-4">
                        {pins.map((pin) => (
                            <Pin key={pin.id} pin={pin} onSavePin={() => { }} />
                        ))}
                    </div>
                </main>
            </div>

            {/* Overlay para cerrar el menú si se hace clic fuera */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-[40] cursor-default bg-transparent"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}
        </div>
    );
}

const SidebarIcon = ({ img, active = false }) => (
    <div className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-black shadow-lg' : 'hover:bg-gray-100'}`}>
        <img
            src={img}
            alt="icon"
            className={`w-7 h-7 object-contain ${active ? 'invert' : ''}`}
        />
    </div>
);

export default Home;