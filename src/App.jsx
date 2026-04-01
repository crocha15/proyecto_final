import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SearchProvider } from './components/SearchContext'; 
import { supabase } from './supabaseClient';
import CrearPin from './pages/CrearPin';

import Layout from './components/Layout';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import Landing from './pages/Landing';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión al cargar la aplicación y configurar el listener de autenticación
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    // Configura un listener para cambios en el estado de autenticación (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    // Limpia el listener cuando el componente se desmonte para evitar fugas de memoria
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="p-10 text-center">Cargando...</div>;
  if (!user) return <Landing />;

  return (
    <SearchProvider>
      <Router>
        <Layout user={user}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/perfil" element={<Perfil user={user} />} />
            <Route path="/crear-pin" element={<CrearPin user={user} />} />
          </Routes>
        </Layout>
      </Router>
    </SearchProvider>
  );
}

export default App;