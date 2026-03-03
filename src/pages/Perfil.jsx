import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Pin from '../components/Pin';

function Perfil({ user }) {
    const [misPines, setMisPines] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Cargar los pines desde Supabase
    const fetchMisPines = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('pines')
                .select('*')
                .eq('user_id', user.id) // Solo los del usuario actual
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Formateamos los datos para que el componente <Pin /> los entienda
            const pinesAdaptados = data.map(p => ({
                id: p.id, // ID de la fila en Supabase para poder borrarlo
                pexels_id: p.pexels_id,
                image: p.image_url,
                title: p.title,
                saved: true // En el perfil, todos están guardados
            }));

            setMisPines(pinesAdaptados);
        } catch (error) {
            console.error('Error al obtener pines:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchMisPines();
    }, [user]);

    // 2. Función para eliminar un pin
    const deletePin = async (id) => {
        const { error } = await supabase
            .from('pines')
            .delete()
            .eq('id', id);

        if (!error) {
            // Actualizamos la lista localmente para que desaparezca al instante
            setMisPines(misPines.filter(pin => pin.id !== id));
        } else {
            alert("No se pudo eliminar el pin");
        }
    };

    if (!user) return <div className="p-10 text-center">Inicia sesión para ver tu perfil</div>;

    return (
        <div className="flex-1 min-h-screen bg-white">
            <main className="p-8">
                {/* Cabecera del Perfil */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-gray-100 shadow-sm">
                        <img
                            src={user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${user.email}`}
                            alt="avatar"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {user.user_metadata?.full_name || 'Usuario'}
                    </h1>
                    <p className="text-gray-500 font-medium">@{user.email.split('@')[0]}</p>

                    <div className="flex gap-2 mt-6">
                        <button className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-3 px-6 rounded-full transition-colors">
                            Compartir perfil
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-3 px-6 rounded-full transition-colors">
                            Editar perfil
                        </button>
                    </div>
                </div>

                {/* Tabs de navegación */}
                <div className="flex justify-center gap-8 mb-8 border-b border-gray-100">
                    <button className="font-bold border-b-2 border-black pb-4 px-2">Creados</button>
                    <button className="font-bold border-b-2 border-black pb-4 px-2">Guardados</button>
                </div>

                {/* Grid de Pines Guardados */}
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                        </div>
                    ) : misPines.length > 0 ? (
                        <div className="columns-2 md:columns-3 lg:columns-5 gap-4 space-y-4">
                            {misPines.map((pin) => (
                                <div key={pin.id} className="relative group">
                                    <Pin pin={pin} />
                                    {/* Botón extra para eliminar (Solo visible en Perfil) */}
                                    <button
                                        onClick={() => deletePin(pin.id)}
                                        className="absolute bottom-14 right-4 bg-white hover:bg-red-50 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 border border-gray-200"
                                        title="Eliminar pin"
                                    >
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-500 mb-4">Aún no has guardado ninguna idea.</p>
                            <a href="/" className="bg-red-600 text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition-colors">
                                Explorar ideas
                            </a>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Perfil;