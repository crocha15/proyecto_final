import React, { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

// Proveedor del contexto de búsqueda, que envuelve a toda la aplicación para que cualquier componente pueda acceder al término de búsqueda y actualizarlo
export const SearchProvider = ({ children }) => {// El estado searchTerm se mantiene aquí para que sea global y pueda ser accedido y modificado desde cualquier componente que consuma este contexto, como el campo de búsqueda en la barra superior y la lógica de búsqueda en la página de inicio
    const [searchTerm, setSearchTerm] = useState('');// El estado searchTerm se inicializa como una cadena vacía, lo que significa que al cargar la aplicación por primera vez, no hay ningún término de búsqueda y se pueden mostrar resultados predeterminados o vacíos hasta que el usuario comience a escribir en el campo de búsqueda
    return (
        // El proveedor del contexto envuelve a los children, lo que permite que cualquier componente dentro de este proveedor pueda acceder al valor de searchTerm y a la función setSearchTerm para actualizarlo, lo que facilita la gestión del estado de búsqueda en toda la aplicación sin necesidad de props drilling (pasar props a través de múltiples niveles de componentes)
        <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);