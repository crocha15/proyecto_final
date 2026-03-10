import React, { useState } from 'react'
import Login from '../components/Login'
import Registrate from '../components/Registrate'

// IMPORTACIÓN DE ASSETS
import logoPinterest from '../assets/logo-pinterest.png'
import pinFood from "../assets/pin-food.jpg";
import pinInterior from "../assets/pin-interior.jpg";
import pinCrafts from "../assets/pin-crafts.jpg";
import pinVilla from "../assets/pin-villa.jpg";
import pinCoffee from "../assets/pin-coffee.jpg";
import pinSwans from "../assets/pin-swans.jpg";
import pinCar from "../assets/pin-car.jpg";
import pinQuote from "../assets/pin-quote.jpg";

// Configuración del collage: se agrupan las imágenes en columnas (arrays)
// para poder mapearlas fácilmente en la interfaz.
const collageImages = [
    [pinFood, pinInterior],
    [pinCrafts, pinVilla],
    [pinCoffee, pinSwans],
    [pinCar, pinQuote],
];

function Landing() {
    // --- ESTADOS DE CONTROL DE MODALES ---
    // Controlan si se muestra o no el formulario de inicio de sesión o registro
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    const [isRegistrateOpen, setIsRegistrateOpen] = useState(false)

    return (
        <>
            {/* COMPONENTES DE MODAL
                Se pasan los estados y funciones para cerrarlos como props.
            */}
            <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <Registrate isOpen={isRegistrateOpen} onClose={() => setIsRegistrateOpen(false)} />

            <div className="min-h-screen bg-white">

                {/* NAVEGACIÓN (BARRA SUPERIOR) 
                    fixed: siempre visible al hacer scroll.
                    z-50: asegura que esté por encima de las imágenes del collage.
                */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white h-20 px-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <img src={logoPinterest} alt="Pinterest" className="h-8 w-auto cursor-pointer" />
                        <button className="text-black font-bold px-4 py-2 hover:bg-gray-100 rounded-full">Explorar</button>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Botones que disparan la apertura de los modales */}
                        <button
                            onClick={() => setIsLoginOpen(true)}
                            className="bg-[#E60023] hover:bg-[#ad001a] text-white font-bold px-5 py-3 rounded-full transition-all"
                        >
                            Iniciar sesión
                        </button>
                        <button
                            onClick={() => setIsRegistrateOpen(true)}
                            className="bg-[#efefef] hover:bg-[#e2e2e2] text-black font-bold px-5 py-3 rounded-full transition-all"
                        >
                            Regístrate
                        </button>
                    </div>
                </nav>

                {/* SECCIÓN HERO (CONTENIDO PRINCIPAL) */}
                <section className="relative pt-32 text-center bg-white">
                    <h1 className="text-6xl font-bold text-[#211922] mb-4">Descubre tu próxima</h1>
                    <h2 className="text-6xl font-bold text-[#0076d3] mb-12">idea de atuendos de verano</h2>

                    {/* COLLAGE DE IMÁGENES 
                        Utiliza un sistema de columnas para imitar el estilo de Pinterest.
                    */}
                    <div className="relative flex justify-center gap-4 h-[450px] overflow-hidden">
                        {collageImages.map((column, colIndex) => (
                            <div
                                key={colIndex}
                                // colIndex % 2 === 0: crea un efecto de "zigzag" bajando las columnas pares
                                className={`flex flex-col gap-4 w-52 ${colIndex % 2 === 0 ? 'pt-12' : 'pt-0'}`}
                            >
                                {column.map((img, imgIndex) => (
                                    <img
                                        key={imgIndex}
                                        src={img}
                                        alt="Idea"
                                        className="w-full rounded-3xl object-cover h-72 shadow-md"
                                    />
                                ))}
                            </div>
                        ))}

                        {/* DEGRADADO INFERIOR 
                            Aplica una sombra blanca difuminada al final del collage para que se mezcle con el fondo
                        */}
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent z-10"></div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Landing