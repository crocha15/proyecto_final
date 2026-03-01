import React from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {

    const handleGoogleLogin = async () => {
        supabase.auth.signInWithOAuth({
            provider: 'google',
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
