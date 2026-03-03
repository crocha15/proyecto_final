import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Asegúrate de que la ruta sea correcta

function Pin({ pin }) {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(pin.saved || false);

    const handleSave = async (e) => {
        e.stopPropagation(); // Evita que el clic dispare otros eventos del contenedor

        if (isSaved) return; // Si ya está guardado, no hace nada

        setIsSaving(true);

        try {
            // 1. Obtener el usuario actual
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert("Debes iniciar sesión para guardar pines");
                return;
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

            if (error) throw error;

            // 3. Actualizar estado visual
            setIsSaved(true);

        } catch (error) {
            console.error('Error al guardar:', error.message);
            alert('Error al guardar el pin');
        } finally {
            setIsSaving(false);
        }
    };

    return (
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
                            className={`px-6 py-3 rounded-full font-bold text-base shadow-lg active:scale-90 transition-all ${isSaved
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
                </div>
            </div>
        </div>
    );
}

export default Pin;