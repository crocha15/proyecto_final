import React from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {

    // Iniciar sesión con Google
    const handleGoogleLogin = async () => { 
        // Redirige al usuario a la página de inicio de sesión de Google 
        supabase.auth.signInWithOAuth({ 
            provider: 'google',
            // Opciones para la redirección después de la autenticación
            options: {
                redirectTo: window.location.origin + window.location.pathname + window.location.search
            }
        })
    }
    
    return (
        <>
            <button onClick={handleGoogleLogin}>
                <span>Iniciar sesión con Google</span>
            </button>
        </>
    )
}
