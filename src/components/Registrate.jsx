import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import Google from "../assets/google.png";

function Registrate({ isOpen, onClose, onOpenLogin }) {

    // Guardan la información que el usuario escribe en los inputs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthdate, setBirthdate] = useState("");

    // Estados visuales: mostrar/ocultar contraseña y estado de carga del botón
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // --- FUNCIÓN PRINCIPAL: REGISTRO CON CORREO ---
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario
        setLoading(true);   // Desactiva el botón para evitar múltiples clics

        try {
            // BLOQUE 1: Registro en Supabase Auth (Sistema de autenticación interno)
            // Crea el usuario con correo y contraseña en la base de datos de seguridad
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (authError) throw authError; // Si hay error (ej. correo duplicado), va al catch

            // BLOQUE 2: Inserción en tabla personalizada 'usuarios'
            // Si el registro anterior fue exitoso, guardamos datos extra (como fecha de nacimiento)
            // en nuestra propia tabla de base de datos vinculándola por el ID de usuario.
            if (authData.user) {
                const { error: tableError } = await supabase
                    .from('usuarios')
                    .insert([
                        {
                            id: authData.user.id, // Vincula el ID de Auth con esta tabla
                            correo: email,
                            fecha_nacimiento: birthdate
                        }
                    ]);

                if (tableError) throw tableError;
            }
            // BLOQUE 3: Finalización exitosa
            alert("¡Registro exitoso!");
            onClose();       // Cierra este modal de Registro
            onOpenLogin();   // Llama a la función para abrir el modal de Login automáticamente

        } catch (error) {
            // Manejo de errores (contraseña corta, email inválido, etc.)
            alert("Error: " + error.message);
        } finally {
            setLoading(false); // Reactiva el botón al terminar el proceso
        }
    };

    // --- FUNCIÓN: LOGIN CON GOOGLE ---
    const handleGoogleLogin = async () => {
        // Redirige al usuario a la página de inicio de sesión de Google
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin // Al terminar, vuelve a la URL actual
            }
        });
    };

    // Si el prop 'isOpen' es falso, el componente no renderiza nada (está oculto)
    if (!isOpen) return null;

    return (
        <>
            {/* CAPA DE FONDO (Overlay): Oscurece el resto de la página y cierra el modal al hacer clic */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={onClose}></div>

            {/* CONTENEDOR DEL MODAL: Centrado en pantalla */}
            <div className="fixed inset-0 flex items-center justify-center z-[101] px-4">
                <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">

                    {/* Botón de cierre (X) */}
                    <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-2xl">✕</button>

                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Regístrate en Pinterest</h2>

                    {/* FORMULARIO DE REGISTRO */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Input de Correo */}
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                            required
                        />

                        {/* Input de Contraseña con opción de ver/ocultar */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Crea una contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>

                        {/* Input de Fecha de Nacimiento */}
                        <input
                            type="date"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                            required
                        />

                        {/* Botón de envío: cambia su texto y se desactiva si está cargando */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition disabled:bg-gray-400"
                        >
                            {loading ? "Registrando..." : "Continuar"}
                        </button>
                    </form>

                    {/* SEPARADOR VISUAL "o" */}
                    <div className="flex items-center my-6">
                        <div className="grow border-t border-gray-200"></div>
                        <span className="mx-3 text-gray-400 text-xs font-bold uppercase">o</span>
                        <div className="grow border-t border-gray-200"></div>
                    </div>

                    {/* BOTÓN DE GOOGLE */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-full font-bold transition"
                    >
                        <img src={Google} alt="Google" className="w-5 h-5" />
                        Continuar con Google
                    </button>
                </div>
            </div>
        </>
    );
}

export default Registrate;