import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Importaciones de tus componentes
import Layout from './components/Layout';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import Landing from './pages/Landing';

function App() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
    <Router>
      <Layout user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
        <Routes>
          <Route path="/" element={<Home searchTerm={searchTerm} />} />
          <Route path="/perfil" element={<Perfil user={user} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;