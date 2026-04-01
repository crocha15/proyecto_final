import React from 'react';

const PinModal = ({ img, onClose }) => {
    // Evitamos que al hacer clic en la imagen se cierre el modal (burbujeo)
    const handleImageClick = (e) => {
        e.stopPropagation();
    };

    return (
        // Contenedor principal: Fondo negro transparente con z-index alto para estar sobre todo
        <div
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 cursor-zoom-out transition-opacity duration-300"
            onClick={onClose} // Si hacen clic en el fondo, se cierra
        >
            {/* Contenedor de la imagen con hover */}
            <div
                className="relative max-w-7xl max-h-[90vh] group overflow-hidden rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-[1.01]"
                onClick={handleImageClick} // Evita el cierre al clicar la imagen
            >
                <img
                    src={img}
                    alt="Pin ampliado"
                    className="w-full h-auto object-contain block rounded-3xl"
                />

                {/* Overlay de hover idéntico al del Pin original (Opcional, si quieres botones aquí) */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 flex flex-col justify-between p-6">
                    <div className="flex justify-end">
                        <button className="bg-[#E60023] text-white px-6 py-3 rounded-full font-bold shadow-lg">Guardar</button>
                    </div>
                    {/* Aquí podrías poner más botones si quisieras */}
                </div>

                {/* Botón de cerrar (X) en la esquina superior derecha */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-gray-800 shadow-md transition-all active:scale-95"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default PinModal;