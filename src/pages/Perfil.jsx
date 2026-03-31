import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Pin from '../components/Pin';

function Perfil({ user }) {

    const [misPines, setMisPines] = useState([]); // Almacena los pines recuperados de la base de datos
    const [loading, setLoading] = useState(true); // Controla el estado visual de carga

    // BLOQUE 1: Recuperar datos de Supabase
    const fetchMisPines = async () => {
        setLoading(true);
        try {
            // Consulta a la tabla 'pines' filtrando por el ID del usuario actual
            const { data, error } = await supabase
                .from('pines')
                .select('*')
                .eq('user_id', user.id) // Seguridad: solo trae lo que me pertenece
                .order('created_at', { ascending: false }); // Mostrar los más recientes primero

            if (error) throw error;

            // ADAPTACIÓN DE DATOS:
            // Transformamos los nombres de las columnas de la DB (image_url) 
            // a los nombres que espera el componente <Pin /> (image).
            const pinesAdaptados = data.map(p => ({
                id: p.id,
                pexels_id: p.pexels_id,
                image: p.image_url,
                title: p.title,
                saved: true // Marcamos como guardados por defecto al estar en el perfil
            }));

            setMisPines(pinesAdaptados);
        } catch (error) {
            console.error('Error al obtener pines:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Efecto que dispara la carga inicial cuando el componente se monta o el usuario cambia
    useEffect(() => {
        if (user) fetchMisPines();
    }, [user]);

    // --- BLOQUE 2: Eliminar un Pin ---
    const deletePin = async (id) => {
        // Petición de borrado a Supabase filtrando por el ID único de la fila
        const { error } = await supabase
            .from('pines')
            .delete()
            .eq('id', id);

        if (!error) {
            /* Filtramos el estado local para que el Pin desaparezca 
               de la pantalla inmediatamente sin tener que recargar la página. */
            setMisPines(misPines.filter(pin => pin.id !== id));
        } else {
            alert("No se pudo eliminar el pin");
        }
    };

    // Protección: Si no hay usuario (ej. sesión expirada), mostramos mensaje de aviso
    if (!user) return <div className="p-10 text-center">Inicia sesión para ver tu perfil</div>;


    return (
        <div className="flex-1 min-h-screen bg-white">
            <main className="p-8">

                {/* CABECERA: Información del usuario extraída de los Metadatos de Supabase */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-gray-100 shadow-sm">
                        <img
                            // Intenta sacar la foto de Google/OAuth, si no, genera un avatar con las iniciales
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

                {/* TABS: Navegación interna del perfil */}
                <div className="flex justify-center gap-8 mb-8 border-b border-gray-100">
                    <button className="font-bold border-b-2 border-black pb-4 px-2">Creados</button>
                    <button className="font-bold border-b-2 border-black pb-4 px-2">Guardados</button>
                </div>

                {/* GRID DE RESULTADOS */}
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        // Spinner de carga mientras fetchMisPines trabaja
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                        </div>
                    ) : misPines.length > 0 ? (
                        // Galería de pines estilo Pinterest
                        <div className="columns-2 md:columns-3 lg:columns-5 gap-4 space-y-4">
                            {misPines.map((pin) => (
                                <div key={pin.id} className="relative group">
                                    <Pin pin={pin} />

                                    {/* Botón de eliminación solo visible al hacer hover sobre el Pin */}
                                    <p className="text-yellow-400 text-xs break-all">
                                        {pin?.created_at}
                                    </p>
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
                        // Estado vacío: si el usuario no tiene nada guardado
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