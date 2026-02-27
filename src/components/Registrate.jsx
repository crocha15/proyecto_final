import React, { useState } from "react";

function Registrate({ isOpen, onClose }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email, password, birthdate);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Fondo oscuro + blur */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-[999] px-4">
                <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[98vh] overflow-y-scroll p-10">

                    {/* Botón cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 border border-blue-400 text-gray-600 rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition"
                    >
                        ✕
                    </button>

                    {/* Logo */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl">
                            P
                        </div>
                    </div>

                    {/* Título */}
                    <h2 className="text-2xl font-bold text-center text-gray-900">
                        Te damos la bienvenida a Pinterest
                    </h2>

                    <p className="text-center text-gray-600 text-sm mt-2 mb-6">
                        Encuentra nuevas ideas para experimentar
                    </p>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Crea una contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    👁
                                </button>
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                                Usa ocho o más letras, números y símbolos
                            </p>

                            <p className="text-sm text-gray-800 mt-3 font-medium">
                                Consejos para la contraseña ⓘ
                            </p>
                        </div>

                        {/* Fecha nacimiento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de nacimiento ⓘ
                            </label>

                            <div className="relative">
                                <input
                                    type="date"
                                    value={birthdate}
                                    onChange={(e) => setBirthdate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Botón continuar */}
                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition mt-2"
                        >
                            Continuar
                        </button>
                    </form>

                    {/* Separador */}
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-3 text-gray-500 text-sm">o</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Google */}
                    <button className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-400 py-3 rounded-full font-semibold transition">
                        <span>Continuar como Carlos</span>
                    </button>

                </div>
            </div>
        </>
    );
}

export default Registrate;