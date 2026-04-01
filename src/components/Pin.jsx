import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function Pin({ pin }) {
    const [isSaving, setIsSaving] = useState(false); // Estado para controlar si se está guardando el pin, lo que permite mostrar un indicador de carga y evitar múltiples clics mientras se procesa la acción de guardado
    const [isSaved, setIsSaved] = useState(pin.saved || false);// Estado para controlar si el pin ya está guardado, lo que permite cambiar el estilo del botón y evitar guardar el mismo pin varias veces, mejorando la experiencia del usuario al proporcionar feedback visual sobre el estado de guardado del pin

    const handleSave = async (e) => {
        e.stopPropagation(); // Evita que el clic dispare otros eventos del contenedor 

        if (isSaved) return; // Si ya está guardado, no hace nada
        setIsSaving(true);

        try {
            // 1. Obtener el usuario actual
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert("Debes iniciar sesión para guardar pines");
                return; // Si no hay usuario, no continúa con el guardado
            }

            // 2. Insertar en la tabla 'pines' de Supabase
            const { error } = await supabase
                .from('pines')
                .insert([
                    {
                        user_id: user.id,
                        image_url: pin.image,
                        title: pin.title || 'Sin título',
                        pexels_id: pin.id
                    }
                ]);

            if (error) throw error;// Manejo de error en la inserción

            // 3. Actualizar estado visual
            setIsSaved(true);

        } catch (error) {
            console.error('Error al guardar:', error.message);
            alert('Error al guardar el pin: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleLike = async () => {
        if (isLiked) {
            // Si ya tiene like, lo borramos (Unlike)
            await supabase.from('likes').delete().eq('pin_id', pin.id).eq('user_id', user.id);
            setLikeCount(prev => prev - 1);
            setIsLiked(false);
        } else {
            // Si no tiene, lo creamos
            await supabase.from('likes').insert({ pin_id: pin.id, user_id: user.id });
            setLikeCount(prev => prev + 1);
            setIsLiked(true);
        }
    };

    return (
        // El componente Pin muestra una imagen con un overlay que aparece al hacer hover, permitiendo al usuario guardar el pin en su cuenta de Supabase. El botón de guardado cambia su estado y estilo según si el pin ya está guardado o si se está procesando la acción, proporcionando una experiencia de usuario interactiva y visualmente atractiva.
        <div className="break-inside-avoid mb-4 group relative cursor-pointer transition-transform duration-500 hover:scale-[1.02]">
            <div className="relative overflow-hidden rounded-3xl bg-gray-200 shadow-md">
                <img
                    src={pin.image}
                    alt={pin.title}
                    className="w-full h-auto block object-cover group-hover:brightness-90 transition duration-300"
                    loading="lazy"
                />

                {/* Overlay de Interacción */}
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

                    {/* Botones inferiores estéticos */}
                    <div className="flex justify-end items-center gap-2">
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

                    {/* Botón de Like (Me gusta) con contador, que cambia su estilo y funcionalidad según si el usuario ya ha dado like al pin o no, proporcionando una interacción adicional para los usuarios que desean expresar su aprecio por el contenido del pin. */}
                    <div className="flex items-center gap-1">
                        <button onClick={toggleLike}>
                            <svg
                                className={`w-6 h-6 ${isLiked ? 'fill-red-600 text-red-600' : 'text-gray-600'}`}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </button>
                        <span className="text-sm font-bold">{likeCount}</span>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Pin;