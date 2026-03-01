import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

function Login({ isOpen, onClose }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert("Error: " + error.message);
        } else {
            onClose(); // <--- IMPORTANTE: Al cerrar el modal, Home.js detectará al 'user'
        }
    };

    const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin // Esto te regresa a tu página actual
        }
    });
};

    if (!isOpen) return null

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-[101] px-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 relative">
                    <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 text-2xl">✕</button>

                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Te damos la bienvenida a Pinterest</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Correo"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">👁</button>
                        </div>
                        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition">Iniciar sesión</button>
                    </form>

                    <div className="relative my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="px-3 text-gray-500 text-sm font-bold">O</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-full font-semibold transition"
                    >
                        {/* Puedes poner un icono de Google aquí */}
                        Continuar con Google
                    </button>
                </div>
            </div>
        </>
    )
}

export default Login