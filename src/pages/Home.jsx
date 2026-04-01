import React, { useState, useEffect, useRef } from 'react';
import Pin from '../components/Pin';
import { useSearch } from '../components/SearchContext'; // Hook para acceder al término de búsqueda global

function Home({ user }) {

    const { searchTerm } = useSearch();        // Obtiene lo que el usuario escribe en la barra de búsqueda (Contexto)
    const [pins, setPins] = useState([]);      // Almacena la lista de fotos/pines a mostrar
    const [page, setPage] = useState(1);       // Controla el número de página actual para la API
    const [loading, setLoading] = useState(false); // Estado para mostrar el spinner de carga
    const abortControllerRef = useRef(null);   // useRef para guardar el AbortController y poder cancelar peticiones HTTP si el usuario sigue escribiendo

    const VITE_PEXELS_API_KEY = 'yy2PQedRMHSRh3cgF4w0OAJTp7pJzZA54rERI3vPHL8SB84k1ziSJi1O';

    // --- FUNCIÓN DE CARGA DE DATOS (PEXELS) ---
    const fetchPexelsPhotos = async (pageNumber, isNewSearch, currentQuery) => {
        // Bloque de cancelación: Si hay una petición en curso, la cancelamos antes de empezar la nueva
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        // Creamos un nuevo AbortController para esta nueva petición y lo guardamos en el ref
        const controller = new AbortController();
        abortControllerRef.current = controller;

        // Si no hay búsqueda, usamos 'nature' por defecto para que la Home no aparezca vacía
        const query = currentQuery.trim() || 'nature';
        setLoading(true);

        try {
            const url = `https://api.pexels.com/v1/search?query=${query}&per_page=30&page=${pageNumber}`;
            const response = await fetch(url, {
                headers: { Authorization: VITE_PEXELS_API_KEY },
                signal: controller.signal // Conectamos la señal de aborto a la petición fetch
            });
            const data = await response.json(); // Parseamos la respuesta JSON de Pexels que contiene la lista de fotos

            if (data.photos) {
                // Formateamos los datos recibidos de Pexels para que coincidan con lo que espera el componente <Pin />
                const newPins = data.photos.map(photo => ({
                    id: photo.id,
                    image: photo.src.large,
                    title: photo.alt || `Foto por ${photo.photographer}`,
                    pexels_id: photo.id
                }));

                // Lógica de actualización de lista:
                // Si es búsqueda nueva (isNewSearch), borramos todo y ponemos los nuevos resultados.
                // Si es scroll infinito, los sumamos al final de los existentes (...prev).
                setPins(prev => (isNewSearch ? newPins : [...prev, ...newPins]));
            }
        } catch (error) {
            // No mostramos error si fue una cancelación manual (AbortError)
            if (error.name !== 'AbortError') {
                console.error("Error en la búsqueda:", error);
            }
        } finally {
            // Solo quitamos el estado de carga si la petición terminó realmente y no fue cancelada
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    };

    // --- EFECTO 1: Búsqueda reactiva con Debounce ---
    // Este efecto se dispara cada vez que cambia 'searchTerm'
    useEffect(() => {
        /* Debounce: Esperamos 300ms después de que el usuario deje de escribir para disparar la API.
        Esto ahorra muchísimas peticiones innecesarias. */
        const delayDebounceFn = setTimeout(() => {
            setPage(1); // Reiniciamos a la página 1 para una nueva búsqueda
            fetchPexelsPhotos(1, true, searchTerm);
        }, 300);

        // Cleanup function: Limpia el timer y cancela peticiones si el usuario escribe otra letra antes de los 300ms
        return () => {
            clearTimeout(delayDebounceFn);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [searchTerm]);

    // --- EFECTO 2: Carga por cambio de página (Scroll) ---
    // Se dispara cuando 'page' aumenta
    useEffect(() => {
        if (page > 1) {
            fetchPexelsPhotos(page, false, searchTerm); // Carga más fotos sin borrar las anteriores (isNewSearch = false) usando el mismo término de búsqueda actual
        }
    }, [page]);

    // --- EFECTO 3: Manejador del Scroll Infinito ---
    useEffect(() => {
        const handleScroll = () => {
            // Verificamos si el usuario ha llegado casi al final de la página (a 800px del fondo)
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
                // Si no estamos cargando ya, aumentamos el número de página para disparar el Efecto 2
                if (!loading) {
                    setPage(prev => prev + 1); // Incrementamos la página para cargar más fotos. El Efecto 2 se encargará de llamar a la API con el nuevo número de página y el mismo término de búsqueda, añadiendo los resultados al final de la lista actual. Esto crea el efecto de scroll infinito, donde a medida que el usuario baja, se van cargando más fotos automáticamente.
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // Limpieza al desmontar
    }, [loading]);

    return (
        <div className="p-4 px-8">
            {/* GRID DE PINES: Estilo Masonry (columnas que se adaptan) */}
            <div className="columns-2 md:columns-4 lg:columns-6 gap-4 space-y-4">
                {pins.map((pin, index) => (
                    // Renderizamos cada Pin. Usamos index en la key para evitar conflictos si hay IDs repetidos
                    <Pin
                        key={`${pin.id}-${index}`}
                        pin={pin}
                        user={user}
                        onSavePin={() => { }} />
                ))}
            </div>

            {/* INDICADOR DE CARGA (Spinner) */}
            {loading && (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
            )}

            {/* MENSAJE DE RESULTADOS VACÍOS */}
            {!loading && pins.length === 0 && (
                <p className="text-center text-gray-500 mt-10">
                    No se encontraron resultados para "{searchTerm}"
                </p>
            )}
        </div>
    );
}

export default Home;