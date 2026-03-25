import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const CrearPin = ({ user }) => {
    const navigate = useNavigate(); // Hook para redireccionar al usuario después de guardar
    
    // --- ESTADOS ---
    const [image, setImage] = useState(null);    // Guarda la vista previa de la imagen (base64)
    const [loading, setLoading] = useState(false); // Estado de carga para el botón guardar
    const [title, setTitle] = useState("");      // Estado para el título del Pin
    const [description, setDescription] = useState(""); // Estado para la descripción
    const [link, setLink] = useState("");        // Estado para el link externo

    // Referencia al input de tipo file oculto. 
    // Se usa para disparar la selección de archivos al hacer clic en el área de diseño.
    const fileInputRef = useRef(null);

    // --- MANEJO DE ARCHIVOS ---

    // Procesa el archivo seleccionado (vía input o vía drag & drop)
    const processFile = (file) => {
        if (file) {
            const reader = new FileReader(); // FileReader para convertir el archivo en una URL de datos (base64) que se puede mostrar como vista previa
            reader.onload = (ev) => setImage(ev.target?.result); // Cuando la lectura se completa, actualizamos el estado 'image' con la URL de datos resultante, lo que permite mostrar una vista previa de la imagen seleccionada en la interfaz de usuario.
            reader.readAsDataURL(file); // Iniciamos la lectura del archivo como URL de datos. Esto es necesario para mostrar la imagen en el navegador sin necesidad de subirla primero a un servidor.
        }
    };

    // Maneja la selección manual de archivos desde el explorador
    const handleFileChange = (e) => {
        const file = e.target.files?.[0]; // Obtenemos el primer archivo seleccionado (si hay alguno)
        processFile(file); // Procesamos el archivo para generar la vista previa y actualizar el estado 'image'
    };

    // Maneja el evento de soltar un archivo sobre el área designada (Drag & Drop)
    const handleDrop = (e) => {
        e.preventDefault(); // Evita que el navegador abra la imagen por defecto al soltarla
        const file = e.dataTransfer.files?.[0]; // Obtenemos el primer archivo soltado (si hay alguno)
        processFile(file); // Procesamos el archivo para generar la vista previa y actualizar el estado 'image'
    };


    // Función para enviar los datos a la tabla 'pines' de Supabase
    const handleSave = async () => {
        // Validación básica: no permitir guardar sin imagen
        if (!image) return alert("Por favor selecciona una imagen");
        setLoading(true); // Bloquea el botón mientras se procesa la petición

        try {
            const { error } = await supabase
                .from('pines') // Nombre de la tabla en Supabase
                .insert([
                    {
                        user_id: user.id,            // ID del usuario que crea el Pin
                        title: title || "Sin título", // Título opcional
                        image_url: image,             // URL o base64 de la imagen
                    }
                ]);

            if (error) throw error; // Si Supabase devuelve error, se captura en el catch

            alert("¡Pin creado con éxito!");
            navigate('/perfil'); // Redirige al perfil para ver el nuevo Pin
        } catch (error) {
            alert("Error al guardar: " + error.message);
        } finally {
            setLoading(false); // Libera el botón al finalizar (éxito o error)
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            {/* CABECERA: Título y Botón de acción principal */}
            <div className="flex items-center justify-between border-b pb-4 mb-8">
                <h1 className="text-xl font-bold">Crear Pin</h1>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition-colors disabled:bg-gray-400"
                >
                    {loading ? "Guardando..." : "Guardar"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* COLUMNA IZQUIERDA: Área de carga e Imagen */}
                <div className="flex flex-col gap-4">
                    <div
                        className="relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 min-h-[450px] cursor-pointer transition-colors hover:bg-gray-100 overflow-hidden"
                        onClick={() => fileInputRef.current?.click()} // Abre el selector de archivos al hacer clic en el cuadro
                        onDragOver={(e) => e.preventDefault()}       // Necesario para permitir el drop
                        onDrop={handleDrop}                          // Captura la imagen soltada
                    >
                        {image ? (
                            // Si hay imagen seleccionada, muestra la previsualización
                            <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            // Si no hay imagen, muestra el icono y las instrucciones
                            <div className="flex flex-col items-center gap-3 p-8 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black">
                                    <Upload className="h-5 w-5 text-black" />
                                </div>
                                <p className="text-sm font-semibold">Elige un archivo o arrástralo y colócalo aquí</p>
                                <p className="text-xs text-gray-500 mt-20">
                                    Recomendamos usar archivos JPG de alta calidad con un tamaño inferior a 20 MB.
                                </p>
                            </div>
                        )}
                        {/* Input real oculto controlado por la referencia */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    <button className="w-full bg-gray-200 hover:bg-gray-300 py-3 rounded-full font-semibold transition-colors">
                        Guardar desde la URL
                    </button>
                </div>

                {/* COLUMNA DERECHA: Campos de texto */}
                <div className="flex flex-col gap-6">
                    {/* Campo Título */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Título</label>
                        <input
                            type="text"
                            placeholder="Agrega un título"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-12 rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 focus:border-blue-400 outline-none transition-all"
                        />
                    </div>

                    {/* Campo Descripción */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descripción</label>
                        <textarea
                            placeholder="Agrega una descripción detallada"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full min-h-[120px] rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-400 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Campo Enlace */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Enlace</label>
                        <input
                            type="text"
                            placeholder="Agrega un enlace"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="w-full h-12 rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 focus:border-blue-400 outline-none transition-all"
                        />
                    </div>

                    {/* Selector de Tablero (Dropdown estático por ahora) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tablero</label>
                        <select className="w-full h-12 rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 outline-none cursor-pointer appearance-none text-gray-500">
                            <option value="">Elige un tablero</option>
                            <option value="1">Inspiración</option>
                            <option value="2">Muebles</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrearPin;