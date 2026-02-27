import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import Buttonpinterest from '../components/buttonpinterest'
import Buttonwhite from '../components/Buttonwhite'
import Login from '../components/Login'
import Registrate from '../components/Registrate'

import logoPinterest from '../assets/logo-pinterest.png'
import pinFood from "../assets/pin-food.jpg";
import pinInterior from "../assets/pin-interior.jpg";
import pinCrafts from "../assets/pin-crafts.jpg";
import pinVilla from "../assets/pin-villa.jpg";
import pinCoffee from "../assets/pin-coffee.jpg";
import pinSwans from "../assets/pin-swans.jpg";
import pinCar from "../assets/pin-car.jpg";
import pinQuote from "../assets/pin-quote.jpg";
import plato1 from "../assets/plato1.jpg"
import plato2 from "../assets/plato2.jpg"
import plato3 from "../assets/plato3.jpg"
import plato4 from "../assets/plato4.jpg"
import plato5 from "../assets/plato5.jpg"

const collageImages = [
    [pinFood, pinInterior],
    [pinCrafts, pinVilla],
    [pinCoffee, pinSwans],
    [pinCar, pinQuote],
];

function Landing() {
    // Estado para controlar si el modal de login está abierto
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    // Estado para controlar si el modal de registro está abierto
    const [isRegistrateOpen, setIsRegistrateOpen] = useState(false)

    return (
        <>
            {/* Modal de Login */}
            <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            {/* Modal de Registrate */}
            <Registrate isOpen={isRegistrateOpen} onClose={() => setIsRegistrateOpen(false)} />
            <div className="min-h-screen bg-background">
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white h-20 px-6 flex items-center justify-between font-sans shadow-sm">

                    {/* SECCIÓN IZQUIERDA: Logo y Explorar */}
                    <div className="flex items-center gap-4">
                        <img
                            src={logoPinterest}
                            alt="Pinterest"
                            className="h-8 w-auto object-contain cursor-pointer"
                        />
                        <button className="text-black font-bold text-[16px] px-4 py-2 hover:bg-gray-100 rounded-full transition-colors">
                            Explorar
                        </button>
                    </div>

                    {/* SECCIÓN DERECHA: Links y Botones */}
                    <div className="flex items-center gap-8">
                        {/* Links de navegación */}
                        <div className="hidden lg:flex items-center gap-8 text-[16px] font-semibold">
                            <a href="#" className="text-blue-700 hover:underline">Información</a>
                            <a href="#" className="text-blue-700 hover:underline">Empresas</a>
                            <a href="#" className="text-blue-700 hover:underline">Crear</a>
                            <a href="#" className="text-blue-700 hover:underline">Lo nuevo</a>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsLoginOpen(true)}
                                className="bg-[#E60023] hover:bg-[#ad001a] text-white font-bold px-5 py-3 rounded-full text-[16px] transition-all"
                            >
                                Iniciar sesión
                            </button>
                            <button
                                onClick={() => setIsRegistrateOpen(true)}
                                className="bg-[#efefef] hover:bg-[#e2e2e2] text-black font-bold px-5 py-3 rounded-full text-[16px] transition-all"
                            >
                                Regístrate
                            </button>
                        </div>
                    </div>

                </nav>

                {/*SECTION#1*/}
                <section id='section1' className="relative pt-32 pb-0 overflow-hidden bg-white">
                    {/* Título Principal */}
                    <div className="text-center mb-12 px-4">
                        <h1 className="text-5xl md:text-6xl font-bold text-[#211922] mb-4">
                            Descubre tu próxima
                        </h1>
                        <h2 className="text-5xl md:text-6xl font-bold text-[#0076d3]">
                            idea de atuendos de verano
                        </h2>

                        {/* Indicadores de carrusel (puntos) */}
                        <div className="flex justify-center gap-2 mt-8">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#0076d3]"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                        </div>
                    </div>

                    {/* Botón Central de Scroll (Flecha hacia abajo) */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-20">
                        <div className="bg-[#0076d3] p-3 rounded-full text-white shadow-lg cursor-pointer hover:scale-110 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Contenedor del Collage con degradado inferior */}
                    <div className="relative flex justify-center gap-4 px-4 h-112.5 overflow-hidden">
                        {collageImages.map((column, colIndex) => (
                            <div
                                key={colIndex}
                                className={`flex flex-col gap-4 w-40 md:w-52 ${colIndex % 2 === 0 ? 'pt-12' : 'pt-0'}`}
                            >
                                {column.map((img, imgIndex) => (
                                    <img
                                        key={imgIndex}
                                        src={img}
                                        alt="Pinterest Idea"
                                        className="w-full rounded-3xl object-cover h-72 shadow-md"
                                    />
                                ))}
                            </div>
                        ))}

                        {/* Capa de degradado para desvanecer las imágenes (Efecto Pinterest) */}
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-white via-white/80 to-transparent z-10"></div>
                    </div>

                    {/* Franja Amarilla Inferior */}
                    <div className="bg-[#ffff99] py-4 text-center font-bold text-[#211922] flex items-center justify-center gap-1">
                        Aquí te mostramos cómo funciona
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </section>

                {/*SECTION#2*/}
                <section id='section2' className="w-full bg-rose-200 py-20 px-6 md:px-16">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">

                        {/* LEFT - Collage de imágenes */}
                        <div className="relative flex justify-center md:justify-start">

                            {/* Imagen principal */}
                            <div className="relative w-72 h-96 mx-6 rounded-3xl overflow-hidden shadow-2xl z-10">
                                <img
                                    src={plato1}
                                    alt="Plato principal"
                                    className="w-full h-full object-cover"
                                />

                                {/* Barra de búsqueda */}
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-4/5 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-md">
                                    <span className="text-gray-600 text-sm">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="receta fácil con pollo"
                                        className="bg-transparent outline-none text-sm w-full"
                                    />
                                </div>
                            </div>

                            {/* Imagen decorativa arriba derecha */}
                            <div className="absolute -top-10 right-50 w-42 h-42 rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src={plato2}
                                    alt="Plato 2"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Imagen decorativa izquierda */}
                            <div className="absolute top-20 -left-10 w-42 h-42 rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src={plato3}
                                    alt="Plato 3"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Imagen decorativa abajo derecha */}
                            <div className="absolute -bottom-10 right-50 w-42 h-42 rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src={plato4}
                                    alt="Plato 4"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* RIGHT - Texto */}
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold text-rose-700 mb-6">
                                Busca una idea
                            </h1>

                            <p className="text-lg text-rose-600 mb-8 max-w-md mx-auto md:mx-0">
                                ¿Qué quieres probar ahora? Piensa en algo que te guste, como
                                “receta fácil con pollo”, y ve lo que encuentras.
                            </p>

                            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-xl transition duration-300 shadow-lg">
                                Explorar
                            </button>
                        </div>
                    </div>
                </section>

                {/*SECTION#3*/}
            </div>
        </>
    )
}

export default Landing
