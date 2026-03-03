import React, { useState, useEffect } from 'react';
import Pin from '../components/Pin';

function Home({ searchTerm }) {
    const [pins, setPins] = useState([]);
    const [page, setPage] = useState(1);
    const PEXELS_API_KEY = 'yy2PQedRMHSRh3cgF4w0OAJTp7pJzZA54rERI3vPHL8SB84k1ziSJi1O';

    useEffect(() => {
        fetchPexelsPhotos();
    }, [page, searchTerm]);

    const fetchPexelsPhotos = async () => {
        const query = searchTerm || 'nature';
        const url = `https://api.pexels.com/v1/search?query=${query}&per_page=40&page=${page}`;
        try {
            const response = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } });
            const data = await response.json();
            const newPins = data.photos.map(photo => ({
                id: photo.id,
                image: photo.src.large,
                title: photo.alt || `Foto por ${photo.photographer}`
            }));
            setPins(prev => (page === 1 ? newPins : [...prev, ...newPins]));
        } catch (error) { console.error(error); }
    };

    // Scroll infinito
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
                setPage(prev => prev + 1);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="p-4 px-8">
            <div className="columns-2 md:columns-4 lg:columns-6 gap-4 space-y-4">
                {pins.map((pin) => (
                    <Pin key={pin.id} pin={pin} onSavePin={() => { }} />
                ))}
            </div>
        </div>
    );
}

export default Home;