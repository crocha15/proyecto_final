import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const CrearPin = ({ user }) => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Estados para el formulario
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");

    const fileInputRef = useRef(null);

    // Manejar selección de archivo
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImage(ev.target?.result);
            reader.readAsDataURL(file);
        }
    };

    // Manejar arrastrar y soltar
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImage(ev.target?.result);
            reader.readAsDataURL(file);
        }
    };

    // Función para guardar en Supabase
    const handleSave = async () => {
        if (!image) return alert("Por favor selecciona una imagen");

        setLoading(true);
        try {
            const { error } = await supabase
                .from('pines')
                .insert([
                    {
                        user_id: user.id,
                        title: title || "Sin título",
                        image_url: image, // Guardamos el base64 o la URL
                    }
                ]);

            if (error) throw error;

            alert("¡Pin creado con éxito!");
            navigate('/perfil');
        } catch (error) {
            alert("Error al guardar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            {/* Encabezado con botón de Guardar */}
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
                {/* Izquierda: Carga de imagen */}
                <div className="flex flex-col gap-4">
                    <div
                        className="relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 min-h-[450px] cursor-pointer transition-colors hover:bg-gray-100 overflow-hidden"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {image ? (
                            <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-3 p-8 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black">
                                    <Upload className="h-5 w-5 text-black" />
                                </div>
                                <p className="text-sm font-semibold">
                                    Elige un archivo o arrástralo y colócalo aquí
                                </p>
                                <p className="text-xs text-gray-500 mt-20">
                                    Recomendamos usar archivos JPG de alta calidad con un tamaño inferior a 20 MB.
                                </p>
                            </div>
                        )}
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

                {/* Derecha: Formulario */}
                <div className="flex flex-col gap-6">
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descripción</label>
                        <textarea
                            placeholder="Agrega una descripción detallada"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full min-h-[120px] rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-400 outline-none transition-all resize-none"
                        />
                    </div>

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