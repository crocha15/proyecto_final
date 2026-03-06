import React, { useState, useEffect, useRef } from 'react';
import Pin from '../components/Pin';
import { useSearch } from '../components/SearchContext'; // Importamos el hook para acceder al contexto de búsqueda


function Home() {
    // 2. Extraemos searchTerm del contexto global
    const { searchTerm } = useSearch(); 
    const [pins, setPins] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef(null); 
    const PEXELS_API_KEY = 'yy2PQedRMHSRh3cgF4w0OAJTp7pJzZA54rERI3vPHL8SB84k1ziSJi1O';

    const fetchPexelsPhotos = async (pageNumber, isNewSearch, currentQuery) => {
        // Cancelar petición anterior para evitar que resultados viejos pisen a los nuevos
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        const controller = new AbortController();
        abortControllerRef.current = controller;

        // Si el buscador está vacío, buscamos 'nature' por defecto
        const query = currentQuery.trim() || 'nature';
        setLoading(true);

        try {
            const url = `https://api.pexels.com/v1/search?query=${query}&per_page=30&page=${pageNumber}`;
            const response = await fetch(url, {
                headers: { Authorization: PEXELS_API_KEY },
                signal: controller.signal 
            });
            const data = await response.json();

            if (data.photos) {
                const newPins = data.photos.map(photo => ({
                    id: photo.id,
                    image: photo.src.large,
                    title: photo.alt || `Foto por ${photo.photographer}`,
                    pexels_id: photo.id
                }));

                // Si es búsqueda nueva (letra nueva), reemplazamos. Si es scroll, sumamos.
                setPins(prev => (isNewSearch ? newPins : [...prev, ...newPins]));
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("Error en la búsqueda:", error);
            }
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    };

    // --- EFECTO: Búsqueda reactiva (Letra a letra) ---
    useEffect(() => {
        // Debounce de 300ms: espera a que el usuario deje de escribir
        const delayDebounceFn = setTimeout(() => {
            setPage(1);
            fetchPexelsPhotos(1, true, searchTerm);
        }, 300);

        return () => {
            clearTimeout(delayDebounceFn);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [searchTerm]); // Se activa cada vez que el contexto cambia

    // --- EFECTO: Scroll Infinito ---
    useEffect(() => {
        if (page > 1) {
            fetchPexelsPhotos(page, false, searchTerm);
        }
    }, [page]);

    // Manejador de scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
                if (!loading) {
                    setPage(prev => prev + 1);
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    return (
        <div className="p-4 px-8">
            <div className="columns-2 md:columns-4 lg:columns-6 gap-4 space-y-4">
                {pins.map((pin, index) => (
                    <Pin key={`${pin.id}-${index}`} pin={pin} onSavePin={() => { }} />
                ))}
            </div>

            {loading && (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
            )}
            
            {!loading && pins.length === 0 && (
                <p className="text-center text-gray-500 mt-10">
                    No se encontraron resultados para "{searchTerm}"
                </p>
            )}
        </div>
    );
}

export default Home;