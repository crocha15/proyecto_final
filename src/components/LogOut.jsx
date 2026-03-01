import React from 'react';
import { supabase } from '../supabaseClient';

export default function LogOut() {
    const handleLogout = async (e) => {
        // Esto nos confirmará si el clic entra
        console.log("BOTON PRESIONADO"); 
        
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            // Si el listener de Home no reacciona, esto lo obliga
            window.location.href = "/"; 
        } catch (error) {
            alert("Error al salir: " + error.message);
        }
    };

    return (
        <button 
            type="button"
            onClick={handleLogout}
            // pointer-events-auto asegura que reciba clics
            className="w-full text-left p-2 hover:bg-gray-100 rounded-lg font-semibold text-red-600 transition-colors cursor-pointer pointer-events-auto relative z-[130]"
        >
            Salir
        </button>
    );
}