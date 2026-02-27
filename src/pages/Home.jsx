import React, { useState, useEffect } from 'react';
import Pin from '../components/Pin';

function Home() {
    const [pins, setPins] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadPins();
    }, []);

    const loadPins = () => {
        // Generamos alturas aleatorias para simular el efecto Pinterest real
        const heights = [300, 400, 500, 350, 450];
        const newPins = Array.from({ length: 40 }, (_, i) => ({
            id: i + 1,
            // Usamos dimensiones variables para el efecto masonry
            image: `https://picsum.photos/seed/${i + 40}/300/${heights[i % heights.length]}`,
            title: `Pin Inspiración ${i + 1}`,
            saved: false,
        }));
        setPins(newPins);
    };

    const toggleSavePin = (id) => {
        setPins(pins.map(pin =>
            pin.id === id ? { ...pin, saved: !pin.saved } : pin
        ));
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* --- HEADER FIJO (Estilo Pinterest Real) --- */}
            <header className="fixed top-0 z-50 w-full bg-white px-4 h-20 flex items-center gap-2">
                {/* Logo */}
                <div className="p-3 hover:bg-gray-100 rounded-full cursor-pointer">
                    <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.17-.1-.95-.19-2.4.04-3.43.21-.93 1.35-5.73 1.35-5.73s-.34-.69-.34-1.71c0-1.61.93-2.81 2.09-2.81 1 0 1.47.74 1.47 1.64 0 1-.63 2.49-.96 3.88-.27 1.15.58 2.1 1.71 2.1 2.05 0 3.63-2.16 3.63-5.28 0-2.76-1.99-4.7-4.82-4.7-3.28 0-5.21 2.46-5.21 5 0 .99.38 2.06.86 2.64.09.11.11.21.08.33-.09.37-.29 1.18-.33 1.33-.05.21-.17.25-.4.15-1.5-.7-2.44-2.88-2.44-4.63 0-3.77 2.74-7.23 7.9-7.23 4.14 0 7.36 2.95 7.36 6.89 0 4.11-2.6 7.43-6.2 7.43-1.21 0-2.35-.63-2.73-1.37l-.74 2.82c-.27 1.03-1 2.32-1.49 3.12C8.38 23.83 10.14 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
                    </svg>
                </div>

                {/* Navegación Principal */}
                <nav className="hidden md:flex items-center">
                    <button className="bg-black text-white px-4 py-3 rounded-full font-semibold">Inicio</button>
                    <button className="text-black px-4 py-3 rounded-full font-semibold hover:bg-gray-100 transition">Explorar</button>
                    <button className="text-black px-4 py-3 rounded-full font-semibold hover:bg-gray-100 transition">Crear</button>
                </nav>

                {/* Barra de Búsqueda */}
                <div className="flex-1 ml-2 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar"
                        className="w-full bg-[#efefef] hover:bg-[#e2e2e2] rounded-full py-3 pl-12 pr-4 text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Iconos Derecha */}
                <div className="flex items-center gap-1">
                    <IconButton icon="Notifications" />
                    <IconButton icon="Messages" />
                    <div className="w-10 h-10 ml-2 rounded-full overflow-hidden cursor-pointer hover:opacity-80">
                        <img src="https://i.pravatar.cc/100" alt="profile" />
                    </div>
                </div>
            </header>

            {/* --- CUERPO PRINCIPAL --- */}
            <main className="pt-24 px-4 pb-8">
                {/* Masonry Grid Layout */}
                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 mx-auto max-w-500">
                    {pins.map((pin) => (
                        <Pin key={pin.id} pin={pin} onSavePin={toggleSavePin} />
                    ))}
                </div>
            </main>
        </div>
    );
}

// Componente auxiliar para los iconos del header
const IconButton = ({ icon }) => (
    <div className="p-3 hover:bg-gray-100 rounded-full cursor-pointer text-gray-500 hover:text-gray-700 transition">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            {icon === 'Notifications' && <path d="M12 24c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V6c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 7.36 6 9.92 6 13v5l-2 2v1h16v-1l-2-2z" />}
            {icon === 'Messages' && <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-10H6v2h12V4z" />}
        </svg>
    </div>
);

export default Home;