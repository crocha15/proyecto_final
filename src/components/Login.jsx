import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import Google from "../assets/google.png";

function Login({ isOpen, onClose }) {
    // 1. Aseguramos que el estado se llame 'correo' para que coincida con el input
    const [correo, setCorreo] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // 2. CORRECCIÓN CRÍTICA: Supabase exige la palabra 'email'
            const { data, error } = await supabase.auth.signInWithPassword({
                email: correo, // Enviamos el estado 'correo' a la propiedad 'email'
                password: password,
            });

            if (error) {
                // 3. Manejo de error de credenciales (el 400 que veías en consola)
                alert("Error de acceso: " + error.message);
            } else {
                console.log("¡Login exitoso!", data);
                onClose();
            }
        } catch (err) {
            console.error("Error inesperado:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });
    };

    if (!isOpen) return null

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-[101] px-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 relative">
                    <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 text-2xl hover:text-gray-600">✕</button>

                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Te damos la bienvenida a Pinterest</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                            value={correo} // Debe coincidir con el nombre del useState
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition disabled:bg-gray-400"
                        >
                            {loading ? "Cargando..." : "Iniciar sesión"}
                        </button>
                    </form>

                    <div className="relative my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="px-3 text-gray-400 text-xs font-bold uppercase">O</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-full font-bold transition text-gray-700"
                    >
                        <img src={Google} alt="Google" className="w-5 h-5" />
                        Continuar con Google
                    </button>
                </div>
            </div>
        </>
    )
}

export default Login