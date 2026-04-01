import React from 'react';

const PinModal = ({ img, onClose }) => {

    // NUEVA FUNCIÓN: Intercepta el clic en la imagen/tarjeta
    const handleCardClick = (e) => {
        // Evita que el clic "burbujee" hacia el fondo negro y cierre el modal.
        e.stopPropagation();
    };

    return (
        // Contenedor principal: Fondo negro transparente (Overlay)
        // onClick aquí está BIEN, es para que cierre al clicar FUERA de la foto.
        <div
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 animate-fadeIn"
            onClick={onClose}
        >
            {/* Contenedor de la imagen (LA TARJETA) */}
            {/* Agregamos el onClick aquí para detener el burbujeo. */}
            <div
                className="relative max-w-7xl max-h-[95vh] group rounded-3xl shadow-2xl transition-all duration-300 hover:scale-[1.01]"
                onClick={handleCardClick} // <--- ¡ESTA ES LA LÍNEA CRÍTICA!
            >
                <img
                    src={img}
                    alt="Pin ampliado"
                    // Agregamos cursor-default para que sepan que la imagen en sí no hace nada.
                    className="w-full h-auto object-contain block rounded-3xl cursor-default"
                />

                {/* Overlay de hover idéntico al del Pin original */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 flex flex-col justify-between p-6 rounded-3xl">
                    <div className="flex justify-end">
                        {/* Aquí puedes poner botones si quieres, recuerda añadirles e.stopPropagation() si tienen lógica */}
                        <button className="bg-[#E60023] text-white px-6 py-3 rounded-full font-bold shadow-lg text-lg active:scale-95 transition-all">Guardar</button>
                    </div>
                </div>

                {/* Botón de cerrar (X) en la esquina superior derecha */}
                {/* Este botón SÍ debe llamar a onClose al clicar en él. */}
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 bg-white p-2.5 rounded-full hover:bg-white text-gray-800 shadow-xl transition-all active:scale-90 z-20 group-hover:opacity-100 opacity-90"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default PinModal;