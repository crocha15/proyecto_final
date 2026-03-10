import React from 'react'
import { supabase } from '../supabaseClient'

export default function LogOut() {

    // Función para cerrar sesión, que utiliza el método signOut de Supabase para finalizar la sesión del usuario actual, lo que permite a los usuarios salir de su cuenta de manera segura y volver a la pantalla de inicio de sesión o a la página principal sin acceso a funciones protegidas
    const handleLogOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <>

            <button
                type="button"
                onClick={handleLogOut}
                // pointer-events-auto asegura que reciba clics
                className="w-full text-left p-2 hover:bg-gray-100 rounded-lg font-semibold text-red-600 transition-colors cursor-pointer pointer-events-auto relative z-[130]"
            >
                Salir
            </button>

        </>
    )
}