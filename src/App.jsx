import React, { useState, useEffect } from 'react';
// IMPORTANTE: Solo importamos BrowserRouter como 'Router' para evitar confusiones
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Asegúrate de que el archivo esté en './components/SearchContext' como dice tu ruta
import { SearchProvider } from './components/SearchContext'; 
import { supabase } from './supabaseClient';
import CrearPin from './pages/CrearPin';

// Importaciones de tus componentes
import Layout from './components/Layout';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import Landing from './pages/Landing';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="p-10 text-center">Cargando...</div>;
  if (!user) return <Landing />;

  return (
    <SearchProvider>
      {/* 1. Usamos solo el componente 'Router' (que es BrowserRouter) */}
      <Router>
        {/* 2. El Layout envuelve las rutas */}
        <Layout user={user}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/perfil" element={<Perfil user={user} />} />
            <Route path="/crear-pin" element={<CrearPin user={user} />} />
          </Routes>
        </Layout>
      </Router>
    </SearchProvider>
  );
}

export default App;