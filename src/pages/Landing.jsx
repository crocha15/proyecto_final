import React, { useState } from 'react'
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

const collageImages = [
    [pinFood, pinInterior],
    [pinCrafts, pinVilla],
    [pinCoffee, pinSwans],
    [pinCar, pinQuote],
];

function Landing() {
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    const [isRegistrateOpen, setIsRegistrateOpen] = useState(false)

    return (
        <>
            <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <Registrate isOpen={isRegistrateOpen} onClose={() => setIsRegistrateOpen(false)} />

            {/* <Registrate
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                onOpenLogin={() => setIsLoginOpen(true)} // <--- Pasar esta prop
            />

            <Login
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
            /> */}

            <div className="min-h-screen bg-white">
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white h-20 px-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <img src={logoPinterest} alt="Pinterest" className="h-8 w-auto cursor-pointer" />
                        <button className="text-black font-bold px-4 py-2 hover:bg-gray-100 rounded-full">Explorar</button>
                    </div>

                    <div className="flex items-center gap-2">
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

                <section className="relative pt-32 text-center bg-white">
                    <h1 className="text-6xl font-bold text-[#211922] mb-4">Descubre tu próxima</h1>
                    <h2 className="text-6xl font-bold text-[#0076d3] mb-12">idea de atuendos de verano</h2>

                    <div className="relative flex justify-center gap-4 h-[450px] overflow-hidden">
                        {collageImages.map((column, colIndex) => (
                            <div key={colIndex} className={`flex flex-col gap-4 w-52 ${colIndex % 2 === 0 ? 'pt-12' : 'pt-0'}`}>
                                {column.map((img, imgIndex) => (
                                    <img key={imgIndex} src={img} alt="Idea" className="w-full rounded-3xl object-cover h-72 shadow-md" />
                                ))}
                            </div>
                        ))}
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent z-10"></div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Landing