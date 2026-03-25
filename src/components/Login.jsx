import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import Google from "../assets/google.png";

function Login({ isOpen, onClose }) {
 
    const [correo, setCorreo] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    // 2. Función de manejo de envío del formulario, que se encarga de autenticar al usuario con Supabase utilizando el correo electrónico y la contraseña proporcionados, y maneja los estados de carga y error para proporcionar feedback al usuario durante el proceso de inicio de sesión
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // 3. Autenticación con Supabase utilizando el método signInWithPassword, que verifica las credenciales del usuario y devuelve los datos de autenticación o un error en caso de credenciales incorrectas, lo que permite a los usuarios iniciar sesión de manera segura en la aplicación
            const { data, error } = await supabase.auth.signInWithPassword({
                email: correo, // Enviamos el estado 'correo' a la propiedad 'email'
                password: password,
            });

            if (error) {
                // 4. Manejo de error de credenciales
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
    // 5. Función para iniciar sesión con Google, que utiliza la autenticación OAuth de Supabase para redirigir al usuario a la página de inicio de sesión de Google y manejar la redirección después de la autenticación, lo que permite a los usuarios iniciar sesión fácilmente con su cuenta de Google sin necesidad de crear una cuenta separada en la aplicación
    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });
    };

    if (!isOpen) return null// Si el modal no está abierto, no renderizamos nada

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-[101] px-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 relative">
                    <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 text-2xl hover:text-gray-600">✕</button>

                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Te damos la bienvenida a Pinterest</h2>
                    
                    {/* // 6. El formulario de inicio de sesión incluye campos para el correo electrónico y la contraseña */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                            value={correo}
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
                            disabled={loading}// El botón se desactiva mientras se está procesando el inicio de sesión para evitar múltiples envíos
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition disabled:bg-gray-400"
                        >
                            {loading ? "Cargando..." : "Iniciar sesión"}
                        </button>
                    </form>

                    {/* 7. Separador visual con la palabra "O" para indicar opciones de inicio de sesión alternativas, mejorando la claridad y la experiencia del usuario al ofrecer múltiples métodos de autenticación en la interfaz de inicio de sesión */ }
                    <div className="relative my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="px-3 text-gray-400 text-xs font-bold uppercase">O</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* 8. Botón para iniciar sesión con Google, que incluye el logo de Google*/ }
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