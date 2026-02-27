import React, { useState } from 'react'

function Login({ isOpen, onClose }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Iniciar sesión con:', email, password)
    }

    if (!isOpen) return null

    return (
        <>
            {/* Fondo oscuro + blur */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-[999] px-4">
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-10">

                    {/* Botón cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-2xl"
                    >
                        ✕
                    </button>

                    {/* Título */}
                    <h2 className="text-2xl font-bold text-center text-gray-900">
                        Te damos la bienvenida a
                    </h2>
                    <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
                        Pinterest
                    </h2>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Correo"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Contraseña
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Contraseña"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                >
                                    👁
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition mt-4"
                        >
                            Iniciar sesión
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <a href="#" className="text-sm text-blue-600 hover:underline">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    {/* Separador */}
                    <div className="relative my-6">
                        <div className="border-t border-gray-200"></div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-400 py-3 rounded-full font-semibold transition">
                        <span>Continuar con Google</span>
                    </button>

                    <div className="text-center mt-6 text-sm text-gray-600">
                        ¿Aún no estás en Pinterest?{' '}
                        <a href="#" className="text-blue-600 font-semibold hover:underline">
                            Regístrate
                        </a>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Login