import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogOut from '../components/LogOut';

// Assets
import Pint from '../assets/pint.png';
import Inicio from '../assets/inicio.png';
import Explorar from '../assets/explorar.png';
import Tableros from '../assets/tableros.png';
import Crear from '../assets/crear.png';
import Notificaciones from '../assets/notificaciones.png';
import Mensajes from '../assets/mensajes.png';
import Configuracion from '../assets/configuracion.png';

function Layout({ children, user, searchTerm, setSearchTerm }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-white font-sans text-[#111111]">
            {/* Sidebar Fijo */}
            <div className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-5 gap-5 border-r border-gray-100 bg-white z-[60]">
                <img src={Pint} alt="Logo" className="w-12 h-10 mb-2 cursor-pointer" onClick={() => navigate('/')} />
                <SidebarIcon img={Inicio} onClick={() => navigate('/')} />
                <SidebarIcon img={Explorar} />
                <SidebarIcon img={Tableros} />
                <SidebarIcon img={Crear} />
                <SidebarIcon img={Notificaciones} />
                <SidebarIcon img={Mensajes} />
                <div className="mt-auto mb-2">
                    <SidebarIcon img={Configuracion} />
                </div>
            </div>

            <div className="flex-1 ml-20 flex flex-col">
                {/* Header Fijo */}
                <header className="sticky top-0 z-50 bg-white px-8 h-20 flex items-center gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Buscar en Pexels..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#efefef] hover:bg-[#e1e1e1] rounded-full py-3 px-12 outline-none transition-colors"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* // Solo mostrar el menú de usuario si hay un usuario autenticado */}
                    <div className="relative z-[110]">
                        <div className='flex items-center gap-2'>
                            <button onClick={() => navigate('/perfil')} className="w-12 h-12 rounded-full overflow-hidden hover:opacity-80 transition-opacity">
                                <img className='w-full h-full object-cover' src={user?.user_metadata?.picture} referrerPolicy='no-referrer' />
                            </button>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-gray-100 rounded-full">
                                <svg className={`w-4 h-4 text-gray-600 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-[120]">
                                <p className="text-xs text-gray-500 mb-2 px-2">Actualmente en</p>

                                {/* Info Usuario */}
                                <div onClick={() => navigate('/perfil')} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
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

                {/* Contenido variable */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
// Componente para los íconos del sidebar, con estado activo y función onClick
const SidebarIcon = ({ img, active = false, onClick }) => (
    <div onClick={onClick} className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-black shadow-lg' : 'hover:bg-gray-100'}`}>
        <img src={img} alt="icon" className={`w-7 h-7 object-contain ${active ? 'invert' : ''}`} />
    </div>
);

export default Layout;