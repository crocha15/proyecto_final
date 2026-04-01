import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function Pin({ pin }) {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(pin.saved || false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    // Agregamos un estado interno para el usuario si no viene por props
    const [user, setUser] = useState(null);

    // Efecto para obtener el usuario y los likes
    useEffect(() => {
        const getInitialData = async () => {
            // 1. Obtener el usuario actual primero
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            setUser(currentUser);

            // 2. Traer cuántos likes tiene el pin
            const { count } = await supabase
                .from('likes')
                .select('*', { count: 'exact', head: true })
                .eq('pin_id', pin.id);

            setLikeCount(count || 0);

            // 3. Verificar si EL USUARIO ACTUAL le dio like
            if (currentUser) {
                const { data } = await supabase
                    .from('likes')
                    .select('*')
                    .eq('pin_id', pin.id)
                    .eq('user_id', currentUser.id)
                    .single();

                if (data) setIsLiked(true);
            }
        };

        getInitialData();
    }, [pin.id]);

    const handleSave = async (e) => {
        e.stopPropagation();

        if (isSaved) return;
        setIsSaving(true);

        try {
            // Usamos el user del estado o lo pedimos de nuevo por seguridad
            const { data: { user: currentUser } } = await supabase.auth.getUser();

            if (!currentUser) {
                alert("Debes iniciar sesión para guardar pines");
                return;
            }

            const { error } = await supabase
                .from('pines')
                .insert([
                    {
                        user_id: currentUser.id,
                        image_url: pin.image,
                        title: pin.title || 'Sin título',
                        pexels_id: pin.id
                    }
                ]);

            if (error) throw error;
            setIsSaved(true);

        } catch (error) {
            console.error('Error al guardar:', error.message);
            alert('Error al guardar el pin: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleLike = async (e) => {
        e.stopPropagation(); // Evita que al dar like se abra el pin (si tuvieras esa lógica)
        
        if (!user) {
            alert("Debes iniciar sesión para dar me gusta");
            return;
        }

        if (isLiked) {
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('pin_id', pin.id)
                .eq('user_id', user.id);

            if (!error) {
                setLikeCount(prev => prev - 1);
                setIsLiked(false);
            }
        } else {
            const { error } = await supabase
                .from('likes')
                .insert({ pin_id: pin.id, user_id: user.id });

            if (!error) {
                setLikeCount(prev => prev + 1);
                setIsLiked(true);
            }
        }
    };

    return (
        
        <div className="break-inside-avoid mb-4 group relative cursor-pointer transition-transform duration-500 hover:scale-[1.02]">
            {/* La imagen del pin se muestra siempre, pero los botones solo aparecen al hacer hover gracias a 'group-hover' */}
            <div className="relative overflow-hidden rounded-3xl bg-gray-200 shadow-md">
                <img
                    src={pin.image}
                    alt={pin.title}
                    className="w-full h-auto block object-cover group-hover:brightness-90 transition duration-300"
                    loading="lazy"
                />
                {/* Capa de botones que aparece al hacer hover sobre el pin */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 bg-black/10">
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving || isSaved}
                            className={`px-6 py-3 rounded-full font-bold text-base shadow-lg active:scale-90 transition-all 
                                ${isSaved
                                    ? 'bg-black text-white cursor-default'
                                    : 'bg-[#E60023] text-white hover:bg-[#ad001a] hover:shadow-xl'
                                }`}
                        >
                            {isSaving ? '...' : isSaved ? 'Guardado' : 'Guardar'}
                        </button>
                    </div>
                    {/* Contenedor de botones de Like y Compartir, siempre visible al hacer hover, pero con un fondo semitransparente para mejorar la legibilidad sobre la imagen */}
                    <div className="flex justify-between items-end">
                        {/* Botón de Like con contador movido aquí para que no choque con los otros botones */}
                        <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full shadow-sm">
                            <button onClick={toggleLike} className="flex items-center">
                                <svg
                                    className={`w-6 h-6 transition-colors ${isLiked ? 'fill-red-600 text-red-600' : 'text-gray-600'}`}
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </button>
                            <span className="text-sm font-bold text-gray-800">{likeCount}</span>
                        </div>
                        {/* Botones de Compartir y Más opciones, siempre visibles al hacer hover, pero con un fondo semitransparente para mejorar la legibilidad sobre la imagen */}
                        <div className="flex gap-2">
                            <div className="bg-white/95 p-2 rounded-full hover:bg-white transition-all shadow-md">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </div>
                            <div className="bg-white/95 p-2 rounded-full hover:bg-white transition-all shadow-md">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pin;