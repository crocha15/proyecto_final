import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import Google from "../assets/google.png";

function Registrate({ isOpen, onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Registro en Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (authError) throw authError;

            // Inserción en tabla personalizada 'usuarios'
            if (authData.user) {
                const { error: tableError } = await supabase
                    .from('usuarios')
                    .insert([
                        {
                            id: authData.user.id,
                            correo: email,
                            fecha_nacimiento: birthdate
                        }
                    ]);

                if (tableError) throw tableError;
            }

            alert("¡Registro exitoso! Ya puedes iniciar sesión.");
            onClose();       // Cierra Registrate
            onOpenLogin();   // Abre Login para que el usuario pueda iniciar sesión

        } catch (error) {
            alert("Error: " + error.message);
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

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-[101] px-4">
                <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">

                    <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-2xl">✕</button>

                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Regístrate en Pinterest</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                            required
                        />
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
                        <input
                            type="date"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition disabled:bg-gray-400"
                        >
                            {loading ? "Registrando..." : "Continuar"}
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="grow border-t border-gray-200"></div>
                        <span className="mx-3 text-gray-400 text-xs font-bold uppercase">o</span>
                        <div className="grow border-t border-gray-200"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-full font-bold transition"
                    >
                        {/* 2. Aquí es donde se usa la variable importada arriba */}
                        <img src={Google} alt="Google" className="w-5 h-5" />
                        Continuar con Google
                    </button>
                </div>
            </div>
        </>
    );
}

export default Registrate;